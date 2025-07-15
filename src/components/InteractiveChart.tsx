import React, { useState } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ReferenceArea,
  ReferenceLine,
  Brush,
} from 'recharts';
import { ZoomIn, ZoomOut, RefreshCw, Calendar, ArrowLeft, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';

interface InteractiveChartProps {
  data: any[];
  dateKey?: string;
  series: {
    key: string;
    name: string;
    type: 'line' | 'area' | 'bar';
    color: string;
    yAxis?: 'left' | 'right';
    opacity?: number;
    stack?: string;
  }[];
  height?: number;
  title?: string;
  allowRangeSelection?: boolean;
  allowZoom?: boolean;
  allowTimeframeSelection?: boolean;
  allowComparison?: boolean;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  dateKey = 'date',
  series,
  height = 300,
  title,
  allowRangeSelection = false,
  allowZoom = false,
  allowTimeframeSelection = false,
  allowComparison = false,
}) => {
  const [selecting, setSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<{ start: number; end: number } | null>(null);
  const [zoom, setZoom] = useState<{ start: number; end: number } | null>(null);
  const [hoverData, setHoverData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [comparisonOffset, setComparisonOffset] = useState<30 | 90 | 365>(365); // days
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Process data based on current selections
  const processData = () => {
    let processedData = [...data];
    
    // Apply timeframe filtering
    if (timeframe !== 'all' && processedData.length > 0) {
      const days = parseInt(timeframe.replace('d', ''));
      processedData = processedData.slice(-days);
    }
    
    // Apply zoom if active
    if (zoom && zoom.start !== zoom.end) {
      processedData = processedData.slice(zoom.start, zoom.end + 1);
    }
    
    // Add comparison data if enabled
    if (showComparison && allowComparison) {
      processedData = processedData.map((dataPoint, index) => {
        // Find the data point from a year ago (or the selected comparison period)
        const comparisonIndex = index - comparisonOffset;
        const comparisonData = comparisonIndex >= 0 ? data[comparisonIndex] : null;
        
        // Add comparison data points with "Previous" prefix
        const result = { ...dataPoint };
        
        if (comparisonData) {
          series.forEach(s => {
            if (s.type !== 'bar') { // Only add comparison for line/area
              result[`Previous${s.key}`] = comparisonData[s.key];
            }
          });
        }
        
        return result;
      });
    }
    
    return processedData;
  };
  
  const chartData = processData();
  
  // Mouse event handlers for range selection
  const handleMouseDown = (e: any) => {
    if (!allowRangeSelection || !e || !e.activeLabel) return;
    
    setSelecting(true);
    const index = chartData.findIndex(d => d[dateKey] === e.activeLabel);
    setSelectionStart(index);
    setSelectionEnd(index);
  };
  
  const handleMouseMove = (e: any) => {
    if (!selecting || !e || !e.activeLabel) return;
    
    const index = chartData.findIndex(d => d[dateKey] === e.activeLabel);
    if (index !== -1) {
      setSelectionEnd(index);
    }
  };
  
  const handleMouseUp = () => {
    if (!selecting) return;
    
    setSelecting(false);
    if (selectionStart !== null && selectionEnd !== null) {
      const start = Math.min(selectionStart, selectionEnd);
      const end = Math.max(selectionStart, selectionEnd);
      
      if (start !== end) {
        setSelectedArea({ start, end });
      }
    }
  };
  
  const applyZoom = () => {
    if (selectedArea) {
      setZoom(selectedArea);
      setSelectedArea(null);
    }
  };
  
  const resetZoom = () => {
    setZoom(null);
    setSelectedArea(null);
  };
  
  const refreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };
  
  // Generate tooltip content
  const formatTooltip = (value: any, name: any) => {
    if (name.startsWith('Previous')) {
      const originalName = name.replace('Previous', '');
      const seriesInfo = series.find(s => s.key === originalName);
      return [`$${value.toLocaleString()}`, `Previous ${seriesInfo?.name || name}`];
    }
    
    if (typeof value === 'number') {
      return [`$${value.toLocaleString()}`, name];
    }
    
    return [value, name];
  };
  
  // Function to shift dates for comparison tooltips
  const formatTooltipLabel = (label: string) => {
    if (!showComparison) return format(parseISO(label), 'MMM dd, yyyy');
    
    const date = parseISO(label);
    return format(date, 'MMM dd, yyyy');
  };
  
  // Custom legends for the chart
  const customLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-wrap gap-2 justify-center text-xs">
        {payload.map((entry: any, index: number) => {
          const isPrevious = entry.value.startsWith('Previous');
          
          return (
            <div 
              key={`legend-${index}`}
              className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => console.log('Legend clicked', entry.value)}
            >
              <div 
                className="w-3 h-3 mr-1 rounded-sm" 
                style={{ backgroundColor: entry.color, opacity: isPrevious ? 0.5 : 1 }}
              />
              <span className={isPrevious ? 'text-gray-500' : ''}>
                {isPrevious 
                  ? `Previous ${entry.value.replace('Previous', '')}`
                  : entry.value
                }
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Generate comparison series for the chart
  const getFullSeriesList = () => {
    if (!showComparison) return series;
    
    // Create comparison series with adjusted styling
    const comparisonSeries = series
      .filter(s => s.type !== 'bar') // Only add comparison for line/area
      .map(s => ({
        ...s,
        key: `Previous${s.key}`,
        name: `Previous ${s.name}`,
        opacity: 0.5,
        dashArray: '3 3', // Dashed line for previous periods
      }));
    
    return [...comparisonSeries, ...series];
  };
  
  const allSeries = getFullSeriesList();
  
  // Check if the chart has right axis series
  const hasRightAxis = allSeries.some(s => s.yAxis === 'right');
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 relative">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <div className="flex space-x-2 items-center">
            {allowTimeframeSelection && (
              <div className="flex border rounded overflow-hidden">
                <button 
                  onClick={() => setTimeframe('7d')}
                  className={`px-2 py-1 text-xs ${timeframe === '7d' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'}`}
                >
                  7D
                </button>
                <button 
                  onClick={() => setTimeframe('30d')}
                  className={`px-2 py-1 text-xs ${timeframe === '30d' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'}`}
                >
                  30D
                </button>
                <button 
                  onClick={() => setTimeframe('90d')}
                  className={`px-2 py-1 text-xs ${timeframe === '90d' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'}`}
                >
                  90D
                </button>
                <button 
                  onClick={() => setTimeframe('all')}
                  className={`px-2 py-1 text-xs ${timeframe === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'}`}
                >
                  All
                </button>
              </div>
            )}
            
            {allowComparison && (
              <button 
                onClick={toggleComparison}
                className={`p-1 rounded ${showComparison ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                title="Compare with previous period"
              >
                <Calendar size={16} />
              </button>
            )}
            
            <button 
              onClick={refreshData}
              className={`p-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 ${isLoading ? 'animate-spin' : ''}`}
              title="Refresh data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      )}
      
      {showComparison && (
        <div className="mb-3 flex items-center text-xs text-gray-500">
          <span>Comparing with: </span>
          <select 
            value={comparisonOffset}
            onChange={(e) => setComparisonOffset(parseInt(e.target.value) as 30 | 90 | 365)}
            className="ml-2 border rounded p-1"
          >
            <option value={30}>Previous Month</option>
            <option value={90}>Previous Quarter</option>
            <option value={365}>Previous Year</option>
          </select>
        </div>
      )}
      
      <div 
        className="relative"
        onMouseLeave={handleMouseUp}
      >
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            
            <XAxis 
              dataKey={dateKey} 
              tickFormatter={(date) => format(parseISO(date), 'MM/dd')}
              axisLine={false}
              tick={{ fontSize: 10 }}
            />
            
            <YAxis 
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
              axisLine={false}
              tick={{ fontSize: 10 }}
            />
            
            {hasRightAxis && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
            )}
            
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={formatTooltipLabel}
              contentStyle={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '4px', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            <Legend content={customLegend} />
            
            {allSeries.map((s, index) => {
              if (s.type === 'line') {
                return (
                  <Line
                    key={`${s.key}-${index}`}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.color}
                    yAxisId={s.yAxis || 'left'}
                    strokeWidth={s.key.startsWith('Previous') ? 1.5 : 2}
                    opacity={s.opacity || 1}
                    dot={false}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                    strokeDasharray={s.key.startsWith('Previous') ? '3 3' : undefined}
                  />
                );
              } else if (s.type === 'area') {
                return (
                  <Area
                    key={`${s.key}-${index}`}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    fill={s.color}
                    stroke={s.color}
                    yAxisId={s.yAxis || 'left'}
                    opacity={s.opacity || 0.2}
                    strokeWidth={s.key.startsWith('Previous') ? 1.5 : 2}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                    strokeDasharray={s.key.startsWith('Previous') ? '3 3' : undefined}
                  />
                );
              } else if (s.type === 'bar') {
                return (
                  <Bar
                    key={`${s.key}-${index}`}
                    dataKey={s.key}
                    name={s.name}
                    fill={s.color}
                    yAxisId={s.yAxis || 'left'}
                    opacity={s.opacity || 0.7}
                    barSize={10}
                    stackId={s.stack}
                  />
                );
              }
              return null;
            })}
            
            {/* Selection and zoom features */}
            {selectedArea && (
              <ReferenceArea
                yAxisId="left"
                x1={chartData[selectedArea.start][dateKey]}
                x2={chartData[selectedArea.end][dateKey]}
                strokeOpacity={0.3}
                fill="blue"
                fillOpacity={0.1}
              />
            )}
            
            {allowZoom && (
              <Brush
                dataKey={dateKey}
                height={20}
                stroke="#6366f1"
                tickFormatter={(date) => format(parseISO(date), 'MM/dd')}
                startIndex={zoom?.start || 0}
                endIndex={zoom?.end || chartData.length - 1}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Zoom controls */}
        {allowZoom && selectedArea && (
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={applyZoom}
              className="bg-indigo-600 text-white p-1 rounded shadow hover:bg-indigo-700 transition-colors"
              title="Zoom to selection"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        )}
        
        {allowZoom && zoom && (
          <div className="absolute top-2 right-2">
            <button
              onClick={resetZoom}
              className="bg-indigo-600 text-white p-1 rounded shadow hover:bg-indigo-700 transition-colors"
              title="Reset zoom"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
            <RefreshCw size={24} className="text-indigo-600 animate-spin" />
          </div>
        )}
      </div>
      
      {/* Selection instructions */}
      {allowRangeSelection && !selectedArea && !zoom && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          <span>Click and drag to select a range for detailed analysis</span>
        </div>
      )}
    </div>
  );
};

export default InteractiveChart;