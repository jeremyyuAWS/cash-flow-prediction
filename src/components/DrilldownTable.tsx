import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, Download, Search, RefreshCw } from 'lucide-react';

interface Column {
  key: string;
  header: string;
  formatter?: (value: any) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface NestedData {
  key: string;
  data: any[];
  columns: Column[];
}

interface DrilldownTableProps {
  data: any[];
  columns: Column[];
  nestedData?: Record<string, NestedData>;
  title?: string;
  exportable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  rowsPerPageOptions?: number[];
  onRowClick?: (row: any) => void;
}

const DrilldownTable: React.FC<DrilldownTableProps> = ({
  data,
  columns,
  nestedData,
  title,
  exportable = false,
  searchable = false,
  pagination = false,
  rowsPerPageOptions = [10, 20, 50],
  onRowClick
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset pagination when data changes
  useEffect(() => {
    setPage(0);
  }, [data, searchTerm]);
  
  // Sort and filter data
  const processedData = useMemo(() => {
    let filteredData = [...data];
    
    // Apply search filter if searchable
    if (searchable && searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        // Check all string or number fields for matches
        return columns.some(column => {
          const value = item[column.key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowerSearchTerm);
          } else if (typeof value === 'number') {
            return value.toString().includes(lowerSearchTerm);
          }
          return false;
        });
      });
    }
    
    // Apply sorting if configured
    if (sortConfig) {
      filteredData.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
        
        if (valueA === undefined || valueA === null) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valueB === undefined || valueB === null) return sortConfig.direction === 'ascending' ? 1 : -1;
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortConfig.direction === 'ascending' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        }
        
        return sortConfig.direction === 'ascending' 
          ? valueA - valueB 
          : valueB - valueA;
      });
    }
    
    return filteredData;
  }, [data, searchTerm, sortConfig, columns]);
  
  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    
    const start = page * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, pagination, page, rowsPerPage]);
  
  // Sort handler
  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    // If already sorting by this column, toggle direction
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Toggle row expansion
  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };
  
  // Export data to CSV
  const exportToCSV = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        // Create CSV content
        const headers = columns.map(col => col.header).join(',');
        const rows = processedData.map(row => 
          columns.map(col => {
            const value = row[col.key];
            // Handle string values that might contain commas
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return value;
          }).join(',')
        );
        
        const csvContent = [headers, ...rows].join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title || 'export'}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting data:', error);
      }
      
      setIsLoading(false);
    }, 500);
  };
  
  // Generate table row class
  const getRowClassName = (row: any, index: number) => {
    let className = "border-b border-gray-200 hover:bg-indigo-50 transition-colors";
    
    // Alternating row colors
    if (index % 2 === 0) {
      className += " bg-white";
    } else {
      className += " bg-gray-50";
    }
    
    // Make row clickable if handler is provided
    if (onRowClick) {
      className += " cursor-pointer";
    }
    
    return className;
  };
  
  // Render a pagination control
  const renderPagination = () => {
    if (!pagination) return null;
    
    const totalPages = Math.ceil(processedData.length / rowsPerPage);
    
    return (
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            {rowsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="text-gray-600 mr-2">
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, processedData.length)} of {processedData.length}
          </span>
          
          <button
            onClick={() => setPage(0)}
            disabled={page === 0}
            className={`p-1 rounded ${page === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          </button>
          
          <button
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
            disabled={page === 0}
            className={`p-1 rounded ${page === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button
            onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={page >= totalPages - 1}
            className={`p-1 rounded ${page >= totalPages - 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          
          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={page >= totalPages - 1}
            className={`p-1 rounded ${page >= totalPages - 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      {(title || searchable || exportable) && (
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          {title && <h3 className="font-medium text-gray-700">{title}</h3>}
          
          <div className="flex items-center space-x-3">
            {searchable && (
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            )}
            
            {exportable && (
              <button
                onClick={exportToCSV}
                disabled={isLoading}
                className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded hover:bg-indigo-100 transition-colors"
              >
                {isLoading ? (
                  <RefreshCw size={14} className="mr-1.5 animate-spin" />
                ) : (
                  <Download size={14} className="mr-1.5" />
                )}
                Export
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {nestedData && (
                <th className="w-8 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width ? `w-${column.width}` : ''}`}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.sortable !== false ? (
                    <button
                      className="flex items-center group"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      
                      <span className="ml-1">
                        {sortConfig && sortConfig.key === column.key ? (
                          sortConfig.direction === 'ascending' ? (
                            <ChevronUp size={14} className="text-indigo-600" />
                          ) : (
                            <ChevronDown size={14} className="text-indigo-600" />
                          )
                        ) : (
                          <ChevronDown size={14} className="text-gray-400 opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (nestedData ? 1 : 0)}
                  className="px-6 py-8 text-center text-sm text-gray-500 border-b border-gray-200"
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const uniqueId = row.id || `row-${rowIndex}`;
                const isExpanded = expandedRows[uniqueId] || false;
                const hasNestedData = nestedData && nestedData[uniqueId];
                
                return (
                  <React.Fragment key={uniqueId}>
                    <tr 
                      className={getRowClassName(row, rowIndex)}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {nestedData && (
                        <td className="w-8 px-3 py-3 whitespace-nowrap">
                          {hasNestedData && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Stop propagation to prevent row click
                                toggleRowExpansion(uniqueId);
                              }}
                              className="p-1 rounded-full hover:bg-gray-200"
                            >
                              <ChevronRight
                                size={16}
                                className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              />
                            </button>
                          )}
                        </td>
                      )}
                      
                      {columns.map((column) => (
                        <td
                          key={`${uniqueId}-${column.key}`}
                          className={`px-3 py-3 text-sm text-${column.align || 'left'} ${
                            column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                          }`}
                        >
                          {column.formatter 
                            ? column.formatter(row[column.key]) 
                            : row[column.key]}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Nested data row */}
                    {isExpanded && hasNestedData && (
                      <tr className="bg-gray-50">
                        <td colSpan={columns.length + 1} className="p-0">
                          <div className="border-t border-b border-gray-200 p-4">
                            <div className="text-sm font-medium mb-2">Detailed Breakdown</div>
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  {nestedData[uniqueId].columns.map((column) => (
                                    <th
                                      key={column.key}
                                      className={`px-3 py-2 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                    >
                                      {column.header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {nestedData[uniqueId].data.map((nestedRow, nestedIndex) => (
                                  <tr
                                    key={`nested-${uniqueId}-${nestedIndex}`}
                                    className={nestedIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                  >
                                    {nestedData[uniqueId].columns.map((column) => (
                                      <td
                                        key={`nested-${uniqueId}-${nestedIndex}-${column.key}`}
                                        className={`px-3 py-2 text-sm text-${column.align || 'left'}`}
                                      >
                                        {column.formatter 
                                          ? column.formatter(nestedRow[column.key]) 
                                          : nestedRow[column.key]}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && renderPagination()}
    </div>
  );
};

export default DrilldownTable;