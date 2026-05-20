import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Pencil, UserRoundX, ChevronRight, ChevronLeft, UserRoundCheck } from 'lucide-react';

export interface Column {
  header: string;
  accessor: string;
  width?: number;
  sortable?: boolean;
  datatype?: 'date' | 'boolean' | 'datetime';
  displayInList: boolean;
  className?: string;
}

interface DataRow {
  [key: string]: any;
  totalRowsCount?: number;
}

interface DataTableProps {
  columns: Column[];
  data: DataRow[];
  rowsPerPage?: number;
  showActions: boolean;
  showDelete: boolean;
  showCreate?: boolean;
  showPagination: boolean;
  count?: number | null;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
  onSort?: (column: string, order: 'asc' | 'desc') => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onActive?: (row: any) => void;
  onCreate?: () => void;
  onRowsPerPageChange?: (rows: number) => void;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  rowsPerPage = 10,
  showActions,
  showDelete,
  showCreate,
  showPagination,
  count = 0,
  onPageChange,
  onSearch,
  onSort,
  onEdit,
  onDelete,
  onActive,
  onCreate,
  onRowsPerPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  const handlePageChangeLocal = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(e.target.value);
    onRowsPerPageChange?.(newRowsPerPage);
    setCurrentPage(1);
    onPageChange(1);
  };

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex justify-between items-center gap-4 px-4">
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
          />
        </div>
        {data.length === 0 ? (
          <div className="p-4 text-gray-500 text-sm text-center">No records found</div>
        ) : (
          data.map((row, rowIndex) => {
            const visibleColumns = columns.filter((col) => col.displayInList);
            const topRowColumns = visibleColumns.slice(0, 2);
            const middleColumns = visibleColumns.slice(2);

            return (
              <div key={rowIndex} className="flex flex-col gap-2 bg-white shadow-lg p-3 rounded-xl mx-4">
                <div className="items-center">
                  <div className="flex flex-wrap justify-between">
                    <div>
                      {topRowColumns[0] && (
                        <span className={`font-semibold text-gray-800 text-sm ${topRowColumns[0].className || ''}`}>
                          {topRowColumns[0].datatype === 'boolean'
                            ? row[topRowColumns[0].accessor]
                              ? 'Yes'
                              : 'No'
                            : topRowColumns[0].datatype === 'date' || topRowColumns[0].datatype === 'datetime'
                              ? formatDate(row[topRowColumns[0].accessor])
                              : row[topRowColumns[0].accessor] != null
                                ? topRowColumns[0].accessor.includes('gst') || topRowColumns[0].accessor === 'tds'
                                  ? `${row[topRowColumns[0].accessor]}%`
                                  : row[topRowColumns[0].accessor]
                                : '-'}
                        </span>
                      )}
                    </div>
                    {showActions && (
                      <div className="flex gap-2 items-center">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="text-gray-600 hover:text-blue-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {showDelete && row.active && onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="text-gray-600 hover:text-red-600"
                            title="Inactive"
                          >
                            <UserRoundX className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {topRowColumns[1] && (
                    <div className={`text-gray-500 text-sm ${topRowColumns[1].className || ''}`}>
                      {topRowColumns[1].datatype === 'boolean'
                        ? row[topRowColumns[1].accessor]
                          ? 'Yes'
                          : 'No'
                        : topRowColumns[1].datatype === 'date' || topRowColumns[1].datatype === 'datetime'
                          ? formatDate(row[topRowColumns[1].accessor])
                          : row[topRowColumns[1].accessor] != null
                            ? topRowColumns[1].accessor.includes('gst') || topRowColumns[1].accessor === 'tds'
                              ? `${row[topRowColumns[1].accessor]}%`
                              : row[topRowColumns[1].accessor]
                            : '-'}
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  {middleColumns.map((column, index) => (
                    <div key={index} className="flex justify-between text-sm py-1">
                      <span className="font-semibold text-gray-600">{column.header}</span>
                      <span className={`text-gray-800 ${column.className || ''}`}>
                        {column.datatype === 'boolean' ? (
                          row[column.accessor] ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <span className="text-red-500">✗</span>
                          )
                        ) : column.datatype === 'date' || column.datatype === 'datetime' ? (
                          <>
                            <div>{formatDate(row[column.accessor])}</div>
                            <div>{formatTime(row[column.accessor])}</div>
                          </>
                        ) : row[column.accessor] != null ? (
                          column.accessor.includes('gst') || column.accessor === 'tds' ? (
                            `${row[column.accessor]}%`
                          ) : (
                            row[column.accessor]
                          )
                        ) : (
                          '-'
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="w-full min-w-max">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  column.displayInList && (
                    <th
                      key={index}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 ${column.className || ''} ${column.width ? `min-w-[${column.width}px]` : 'min-w-[120px]'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{column.header}</span>
                        {column.sortable && onSort && (
                          <div className="ml-2 flex flex-col">
                            <ChevronUp
                              className="h-3 w-3 cursor-pointer hover:text-blue-600"
                              onClick={() => onSort(column.accessor, 'asc')}
                            />
                            <ChevronDown
                              className="h-3 w-3 cursor-pointer hover:text-blue-600 -mt-1"
                              onClick={() => onSort(column.accessor, 'desc')}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  )
                ))}
                {showActions && (
                  <th className="min-w-[80px] px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    column.displayInList && (
                      <td
                        key={colIndex}
                        className={`px-4 py-4 whitespace-nowrap border-r border-gray-200 ${column.className || ''}`}
                      >
                        {column.datatype === 'date' || column.datatype === 'datetime' ? (
                          <div>
                            <div className="text-xs text-gray-900">{formatDate(row[column.accessor])}</div>
                            <div className="text-xs text-gray-900">{formatTime(row[column.accessor])}</div>
                          </div>
                        ) : column.datatype === 'boolean' ? (
                          row[column.accessor] === null ? (
                            <span>-</span>
                          ) : (
                            <div className="flex items-center justify-center">
                              {row[column.accessor] ? (
                                <span className="text-green-500">✓</span>
                              ) : (
                                <span className="text-red-500">✗</span>
                              )}
                            </div>
                          )
                        ) : (
                          <span className="text-xs text-gray-900 truncate">
                            {row[column.accessor] != null
                              ? column.accessor.includes('gst') || column.accessor === 'tds'
                                ? `${row[column.accessor]}%`
                                : row[column.accessor]
                              : '-'}
                          </span>
                        )}
                      </td>
                    )
                  ))}
                  {showActions && (
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="text-gray-600 hover:text-blue-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {showDelete && row.active === true && onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="text-gray-600 hover:text-red-600"
                            title="Inactive"
                          >
                            <UserRoundX className="h-4 w-4" />
                          </button>
                        )}

                        {showDelete && row.active === false && onActive && (
                          <button
                            onClick={() => onActive(row)}
                            className="text-gray-600 hover:text-green-600"
                            title="Activate"
                          >
                            <UserRoundCheck className="h-4 w-4" />
                          </button>
                        )}

                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && data.length > 0 && (
        <div className="flex items-center gap-1 mt-2 pb-12 border-t border-gray-300 px-6 py-4">
          <div className="flex-shrink-0">
            {/* <span className="text-xs sm:text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * rowsPerPage + 1, count || 0)} to{' '}
              {Math.min(currentPage * rowsPerPage, count || 0)} of {count || 0} entries
            </span> */}
          </div>
          <div className="w-2 flex-shrink-0"></div>
          <div className="flex items-center justify-end gap-1 flex-grow">
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="px-1 py-0.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <button
              type="button"
              onClick={() => handlePageChangeLocal(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChangeLocal(page)}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm ${page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handlePageChangeLocal(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;