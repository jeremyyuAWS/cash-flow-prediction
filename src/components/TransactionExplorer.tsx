import React, { useState, useMemo } from 'react';
import { Filter, Download, Eye, Calendar, ArrowUpRight, ArrowDownRight, Clock, Tag, User } from 'lucide-react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { getTransactionDetails, getTopEntities, getCategoryBreakdown } from '../utils/dataGenerator';
import DrilldownTable from './DrilldownTable';
import InteractiveChart from './InteractiveChart';

interface TransactionExplorerProps {
  historicalData: any;
  forecastData: any;
}

const TransactionExplorer: React.FC<TransactionExplorerProps> = ({
  historicalData,
  forecastData
}) => {
  const [activeTab, setActiveTab] = useState<'historical' | 'forecast'>('historical');
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: subDays(new Date(), 30).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState<{
    type: 'all' | 'inflow' | 'outflow';
    entity: string;
    category: string;
    minAmount: string;
    maxAmount: string;
  }>({
    type: 'all',
    entity: '',
    category: '',
    minAmount: '',
    maxAmount: ''
  });
  
  const [groupBy, setGroupBy] = useState<'none' | 'daily' | 'category' | 'entity'>('none');
  const [showDetailsFor, setShowDetailsFor] = useState<string | null>(null);
  
  // Get all data
  const allTransactions = useMemo(() => {
    const sourceData = activeTab === 'historical' ? historicalData : forecastData;
    if (!sourceData) return [];
    
    // Use date range based on the active tab
    const range = activeTab === 'historical' 
      ? { 
          start: dateRange.start,
          end: dateRange.end
        }
      : {
          start: forecastData.startDate,
          end: addDays(new Date(forecastData.startDate), 30).toISOString().split('T')[0]
        };
    
    return getTransactionDetails(sourceData, range.start, range.end);
  }, [historicalData, forecastData, activeTab, dateRange]);
  
  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      // Filter by type
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      
      // Filter by entity
      if (filters.entity && !t.entity?.toLowerCase().includes(filters.entity.toLowerCase())) return false;
      
      // Filter by category
      if (filters.category && !t.category?.toLowerCase().includes(filters.category.toLowerCase())) return false;
      
      // Filter by amount
      if (filters.minAmount && t.amount < parseFloat(filters.minAmount)) return false;
      if (filters.maxAmount && t.amount > parseFloat(filters.maxAmount)) return false;
      
      return true;
    });
  }, [allTransactions, filters]);
  
  // Group transactions if necessary
  const groupedTransactions = useMemo(() => {
    if (groupBy === 'none') return filteredTransactions;
    
    const grouped: Record<string, any> = {};
    
    filteredTransactions.forEach(t => {
      let key;
      if (groupBy === 'daily') {
        key = t.date;
      } else if (groupBy === 'category') {
        key = t.category || 'Uncategorized';
      } else if (groupBy === 'entity') {
        key = t.entity || 'Unknown';
      }
      
      if (!key) return;
      
      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          key,
          inflows: 0,
          outflows: 0,
          net: 0,
          count: 0,
          transactions: []
        };
      }
      
      if (t.type === 'inflow') {
        grouped[key].inflows += t.amount;
        grouped[key].net += t.amount;
      } else {
        grouped[key].outflows += t.amount;
        grouped[key].net -= t.amount;
      }
      
      grouped[key].count++;
      grouped[key].transactions.push(t);
    });
    
    return Object.values(grouped);
  }, [filteredTransactions, groupBy]);
  
  // Calculate totals
  const totals = useMemo(() => {
    const result = {
      inflows: 0,
      outflows: 0,
      net: 0,
      count: filteredTransactions.length
    };
    
    filteredTransactions.forEach(t => {
      if (t.type === 'inflow') {
        result.inflows += t.amount;
        result.net += t.amount;
      } else {
        result.outflows += t.amount;
        result.net -= t.amount;
      }
    });
    
    return result;
  }, [filteredTransactions]);
  
  // Get customers and vendors breakdown
  const customersBreakdown = useMemo(() => {
    const sourceData = activeTab === 'historical' ? historicalData : forecastData;
    return getTopEntities(sourceData, 'customer', 10);
  }, [historicalData, forecastData, activeTab]);
  
  const vendorsBreakdown = useMemo(() => {
    const sourceData = activeTab === 'historical' ? historicalData : forecastData;
    return getTopEntities(sourceData, 'vendor', 10);
  }, [historicalData, forecastData, activeTab]);
  
  // Get category breakdown
  const inflowCategories = useMemo(() => {
    const sourceData = activeTab === 'historical' ? historicalData : forecastData;
    return getCategoryBreakdown(sourceData, 'inflow');
  }, [historicalData, forecastData, activeTab]);
  
  const outflowCategories = useMemo(() => {
    const sourceData = activeTab === 'historical' ? historicalData : forecastData;
    return getCategoryBreakdown(sourceData, 'outflow');
  }, [historicalData, forecastData, activeTab]);
  
  // Prepare data for charts
  const categoryChartData = useMemo(() => {
    // Combine inflow and outflow categories for visualization
    return [...inflowCategories.map(c => ({
      name: c.name,
      value: c.total,
      type: 'inflow'
    })), ...outflowCategories.map(c => ({
      name: c.name,
      value: c.total,
      type: 'outflow'
    }))];
  }, [inflowCategories, outflowCategories]);
  
  // Daily flow chart data
  const dailyFlowChartData = useMemo(() => {
    if (groupBy !== 'daily') return [];
    
    return groupedTransactions.map(g => ({
      date: g.key,
      inflows: g.inflows,
      outflows: g.outflows,
      net: g.net
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [groupedTransactions, groupBy]);
  
  // Get detailed breakdown for entity or category
  const detailedBreakdown = useMemo(() => {
    if (!showDetailsFor) return null;
    
    const item = groupedTransactions.find(g => g.key === showDetailsFor);
    return item ? item.transactions : null;
  }, [showDetailsFor, groupedTransactions]);
  
  // Table columns for different views
  const transactionColumns = [
    { 
      key: 'date', 
      header: 'Date', 
      formatter: (value: string) => format(parseISO(value), 'MMM dd, yyyy')
    },
    { 
      key: 'type', 
      header: 'Type',
      formatter: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'inflow' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 'inflow' ? 'Inflow' : 'Outflow'}
        </span>
      )
    },
    { key: 'category', header: 'Category' },
    { key: 'entity', header: 'Entity' },
    { 
      key: 'amount', 
      header: 'Amount',
      align: 'right',
      formatter: (value: number) => `$${value.toLocaleString()}`
    },
    ...(activeTab === 'historical' ? [{ 
      key: 'notes', 
      header: 'Notes',
      formatter: (value: string) => value || '-'
    }] : [])
  ];
  
  const groupedColumns = {
    daily: [
      { 
        key: 'key', 
        header: 'Date', 
        formatter: (value: string) => format(parseISO(value), 'MMM dd, yyyy')
      },
      { 
        key: 'count', 
        header: 'Transactions',
        align: 'center',
        formatter: (value: number) => value
      },
      { 
        key: 'inflows', 
        header: 'Inflows',
        align: 'right',
        formatter: (value: number) => `$${value.toLocaleString()}`
      },
      { 
        key: 'outflows', 
        header: 'Outflows',
        align: 'right',
        formatter: (value: number) => `$${value.toLocaleString()}`
      },
      { 
        key: 'net', 
        header: 'Net Cash Flow',
        align: 'right',
        formatter: (value: number) => (
          <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
            {value >= 0 ? '+' : '-'}${Math.abs(value).toLocaleString()}
          </span>
        )
      }
    ],
    category: [
      { key: 'key', header: 'Category' },
      { 
        key: 'count', 
        header: 'Transactions',
        align: 'center',
        formatter: (value: number) => value
      },
      { 
        key: 'inflows', 
        header: 'Inflows',
        align: 'right',
        formatter: (value: number) => `$${value.toLocaleString()}`
      },
      { 
        key: 'outflows', 
        header: 'Outflows',
        align: 'right',
        formatter: (value: number) => `$${value.toLocaleString()}`
      },
      { 
        key: 'net', 
        header: 'Net',
        align: 'right',
        formatter: (value: number) => (
          <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
            {value >= 0 ? '+' : '-'}${Math.abs(value).toLocaleString()}
          </span>
        )
      }
    ],
    entity: [
      { key: 'key', header: 'Entity' },
      { 
        key: 'count', 
        header: 'Transactions',
        align: 'center',
        formatter: (value: number) => value
      },
      { 
        key: 'inflows', 
        header: 'Inflows',
        align: 'right',
        formatter: (value: number) => `$${value.toLocaleString()}`
      },
      { 
        key: 'outflows', 
        header: 'Outflows',
        align: 'right',
        formatter: (value: number) => `$${value.toLocaleString()}`
      },
      { 
        key: 'net', 
        header: 'Net',
        align: 'right',
        formatter: (value: number) => (
          <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
            {value >= 0 ? '+' : '-'}${Math.abs(value).toLocaleString()}
          </span>
        )
      }
    ]
  };
  
  // Create nested data for drilldown table
  const nestedDataConfig = useMemo(() => {
    if (groupBy === 'none') return {}; // No nesting for raw transactions
    
    const config: Record<string, any> = {};
    
    groupedTransactions.forEach((group) => {
      config[group.id] = {
        key: group.id,
        data: group.transactions,
        columns: transactionColumns
      };
    });
    
    return config;
  }, [groupedTransactions, groupBy, transactionColumns]);
  
  const updateFilter = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      type: 'all',
      entity: '',
      category: '',
      minAmount: '',
      maxAmount: ''
    });
  };
  
  const handleRowClick = (row: any) => {
    if (groupBy !== 'none') {
      setShowDetailsFor(row.key);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Transaction Explorer</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-3 py-1 rounded ${
              activeTab === 'historical' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Clock size={16} className="inline-block mr-1" />
            Historical
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-3 py-1 rounded ${
              activeTab === 'forecast' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Calendar size={16} className="inline-block mr-1" />
            Forecast
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="border rounded-md p-2 text-sm"
                disabled={activeTab === 'forecast'}
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="border rounded-md p-2 text-sm"
                disabled={activeTab === 'forecast'}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="border rounded-md p-2 text-sm w-32"
            >
              <option value="all">All</option>
              <option value="inflow">Inflows</option>
              <option value="outflow">Outflows</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="border rounded-md p-2 text-sm w-32"
            >
              <option value="none">No Grouping</option>
              <option value="daily">Daily</option>
              <option value="category">Category</option>
              <option value="entity">Entity</option>
            </select>
          </div>
          
          <button
            onClick={() => {
              const filterPanel = document.getElementById('advanced-filters');
              if (filterPanel) {
                filterPanel.classList.toggle('hidden');
              }
            }}
            className="flex items-center px-3 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200"
          >
            <Filter size={16} className="mr-1" />
            Advanced Filters
          </button>
          
          <div className="ml-auto flex items-center space-x-1 text-sm">
            <span className="text-gray-500">
              {filteredTransactions.length} transactions
            </span>
            {filteredTransactions.length !== allTransactions.length && (
              <button 
                onClick={resetFilters}
                className="text-indigo-600 hover:text-indigo-800 ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
        
        <div id="advanced-filters" className="hidden mb-4 p-4 bg-gray-50 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity</label>
              <input
                type="text"
                value={filters.entity}
                onChange={(e) => updateFilter('entity', e.target.value)}
                placeholder="Customer or vendor name"
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                placeholder="Transaction category"
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => updateFilter('minAmount', e.target.value)}
                  placeholder="Min"
                  className="w-full border rounded-md p-2 text-sm"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => updateFilter('maxAmount', e.target.value)}
                  placeholder="Max"
                  className="w-full border rounded-md p-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <span className="text-sm text-gray-500">Total Inflows</span>
            <div className="text-xl font-semibold text-green-600 flex items-center">
              ${totals.inflows.toLocaleString()}
              <ArrowUpRight size={16} className="ml-1" />
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <span className="text-sm text-gray-500">Total Outflows</span>
            <div className="text-xl font-semibold text-red-600 flex items-center">
              ${totals.outflows.toLocaleString()}
              <ArrowDownRight size={16} className="ml-1" />
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <span className="text-sm text-gray-500">Net Cash Flow</span>
            <div className={`text-xl font-semibold flex items-center ${
              totals.net >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totals.net >= 0 ? '+' : '-'}${Math.abs(totals.net).toLocaleString()}
              {totals.net >= 0 ? <ArrowUpRight size={16} className="ml-1" /> : <ArrowDownRight size={16} className="ml-1" />}
            </div>
          </div>
        </div>
        
        {/* Daily flow chart (when grouped by day) */}
        {groupBy === 'daily' && dailyFlowChartData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Daily Cash Flow</h3>
            <div className="h-64">
              <InteractiveChart
                data={dailyFlowChartData}
                series={[
                  { key: 'inflows', name: 'Inflows', type: 'bar', color: 'rgba(16, 185, 129, 0.7)' },
                  { key: 'outflows', name: 'Outflows', type: 'bar', color: 'rgba(239, 68, 68, 0.7)' },
                  { key: 'net', name: 'Net Cash Flow', type: 'line', color: '#3b82f6' }
                ]}
                height={256}
                allowTimeframeSelection={false}
              />
            </div>
          </div>
        )}
        
        {/* Transaction table */}
        <div>
          <DrilldownTable
            data={groupBy === 'none' ? filteredTransactions : groupedTransactions}
            columns={groupBy === 'none' ? transactionColumns : groupedColumns[groupBy]}
            nestedData={nestedDataConfig}
            title={groupBy === 'none' ? 'Transactions' : `Transactions (Grouped by ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)})`}
            exportable={true}
            searchable={true}
            pagination={true}
            onRowClick={handleRowClick}
          />
        </div>
        
        {/* Detail view for selected group */}
        {showDetailsFor && detailedBreakdown && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold">
                Details for {groupBy === 'daily' ? format(parseISO(showDetailsFor), 'MMMM d, yyyy') : showDetailsFor}
              </h3>
              <button
                onClick={() => setShowDetailsFor(null)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            
            <DrilldownTable
              data={detailedBreakdown}
              columns={transactionColumns}
              title=""
              searchable={true}
              pagination={true}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </div>
        )}
      </div>
      
      {/* Additional analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <User size={16} className="mr-1" />
            Top Customers
          </h3>
          <div className="space-y-2">
            {customersBreakdown.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center">
                  <div className={`w-2 h-8 rounded-sm mr-2 ${
                    customer.tier === 'large' ? 'bg-green-500' : 
                    customer.tier === 'medium' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-gray-500">{
                      customer.tier === 'large' ? 'Large Account' :
                      customer.tier === 'medium' ? 'Medium Account' : 'Small Account'
                    }</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${customer.total.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <Tag size={16} className="mr-1" />
            Top Categories
          </h3>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">Inflows</h4>
            <div className="space-y-2 mb-4">
              {inflowCategories.slice(0, 5).map((category, index) => (
                <div key={index} className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-green-700">{category.name}</div>
                    <div className="text-xs font-medium text-green-700">${category.total.toLocaleString()}</div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-green-100">
                    <div 
                      className="bg-green-500 rounded" 
                      style={{ 
                        width: `${(category.total / inflowCategories[0].total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <h4 className="text-sm font-medium text-gray-700">Outflows</h4>
            <div className="space-y-2">
              {outflowCategories.slice(0, 5).map((category, index) => (
                <div key={index} className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-red-700">{category.name}</div>
                    <div className="text-xs font-medium text-red-700">${category.total.toLocaleString()}</div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-red-100">
                    <div 
                      className="bg-red-500 rounded" 
                      style={{ 
                        width: `${(category.total / outflowCategories[0].total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionExplorer;