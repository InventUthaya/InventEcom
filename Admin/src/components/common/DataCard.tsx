import React, { useState, JSX } from 'react';
import { Copy, Check, ChevronLeft, ChevronRight, } from 'lucide-react';
import { dataTableDataTypes, formatTableCell } from '../helper/helperfunctions';


const isValidUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};


const renderCellValue = (value: any, datatype?: dataTableDataTypes): JSX.Element | string => {
  const formattedValue = formatTableCell(value, datatype);

  if (typeof formattedValue === 'string' && isValidUrl(formattedValue)) {
    return (
      <a
        href={formattedValue}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {formattedValue}
      </a>
    );
  }

  return formattedValue;
};

export interface Column {
  header: string;
  accessor: string;
  width?: number;
  sortable?: boolean;
  datatype?: dataTableDataTypes;
  displayInList: boolean;
}

interface DataRow {
  [key: string]: any;
  totalRowsCount?: number;
  showMap?: boolean;
  showAdd?: boolean;
  showCellEdit?: boolean;
  showCellRemove?: boolean;
}

interface CardGridProps {
  columns: Column[];
  data: DataRow[];
  rowsPerPage?: number;
  showPagination: boolean;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
  onRowsPerPageChange?: (rows: number) => void;
}

const DataCard: React.FC<CardGridProps> = ({
  columns,
  data,
  rowsPerPage = 10,
  showPagination,
  onPageChange,
  onSearch,
  onRowsPerPageChange,
}: CardGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const totalRowsCount = data.length > 0 && 'totalRowsCount' in data[0] ? Number(data[0].totalRowsCount) : 0;
  const totalPages = totalRowsCount > 0 ? Math.ceil(totalRowsCount / rowsPerPage) : 0;


  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  const getPaginationButtons = () => {
    const maxButtons = 5;
    const buttons: (number | string)[] = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push('…');
      }
      buttons.push(totalPages);
    }

    return buttons;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
    onSearch(newSearchTerm);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(e.target.value);
    setCurrentPage(1);
    onRowsPerPageChange?.(newRowsPerPage);
  };


  const [copiedStates, setCopiedStates] = useState<any>();

  const handleCopy = (value: any, rowId: string) => {

    navigator.clipboard.writeText(value?.props?.href ?? value);

    setCopiedStates((prev: any) => ({
      ...prev,
      [rowId]: true
    }));

    setTimeout(() => {
      setCopiedStates((prev: any) => ({
        ...prev,
        [rowId]: false
      }));
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
        />
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No records found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((row, rowIndex) => {
            const titleColumn = columns.filter(col => col.displayInList)[0] || {} as any;
            const titleValue = titleColumn ? row[titleColumn.accessor] : null;
            const rowId = row.id || rowIndex;

            return (
              <div key={rowIndex} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-all duration-300">
                {/* Card header with title */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {titleColumn && renderCellValue(titleValue, titleColumn.datatype)}
                    </h3>
                  </div>
                </div>

                {/* Card content */}
                <div className="px-5 py-4 space-y-3">
                  {columns
                    .filter(col => col.displayInList)
                    .slice(1)
                    .map((column, colIndex) => {
                      const cellValue = row[column.accessor];
                      const formattedValue = renderCellValue(cellValue, column.datatype);
                      const cellId = `${rowId}-${column.accessor}`;
                      const isEmpty = formattedValue === '';

                      return (
                        <div key={colIndex} className="flex items-center justify-between group">
                          <span className="text-sm text-gray-500 font-medium">{isEmpty ? 'OTP is required to log in' : column.header}</span>
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${column.datatype === "boolean" ? "" : "text-gray-800"}`}>
                              {column.datatype === "boolean" ? (
                                cellValue === null ? (
                                  <span className="text-gray-400">-</span>
                                ) : cellValue ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Inactive
                                  </span>
                                )
                              ) : (
                                formattedValue
                              )}
                            </span>
                            <button
                              onClick={() => handleCopy(cellValue, cellId)}
                              className="ml-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                              title={`Copy ${column.header}`}
                            >
                              {copiedStates && copiedStates[cellId] ? (
                                <Check className="w-3.5 h-3.5 text-green-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showPagination && totalRowsCount > 0 ? (
        <div
          className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3 mt-4 mb-24 md:mb-4"
          data-testid="pagination-controls"
        >
          <div className="text-gray-600 dark:text-gray-300 text-sm">
            Showing{" "}
            {Math.min((currentPage - 1) * rowsPerPage + 1, totalRowsCount)} to{" "}
            {Math.min(currentPage * rowsPerPage, totalRowsCount)} of{" "}
            {totalRowsCount} entries
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-gray-50 p-3 rounded-lg w-full sm:w-auto">
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              data-testid="rows-per-page-selector"
            >
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
                data-testid="prev-page-button"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
              {getPaginationButtons().map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => typeof button === "number" && goToPage(button)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm ${button === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  aria-label={
                    typeof button === "number" ? `Page ${button}` : undefined
                  }
                  data-testid={`page-button-${button}`}
                >
                  {button}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
                data-testid="next-page-button"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      ) : ("")}
    </div>
  );
};

export default DataCard;