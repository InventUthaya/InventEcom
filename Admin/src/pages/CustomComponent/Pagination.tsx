// src/components/common/Pagination.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    onPageChange: (page: number) => void;
    hasMore: boolean;
    totalRecords: number; // Total records from server
    pageSize: number;
    isLoading?: boolean;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    onPageChange,
    hasMore,
    totalRecords,
    pageSize,
    isLoading = false,
    className,

}) => {
    // Calculate total pages correctly
    const totalPages = Math.ceil(totalRecords / pageSize);
    // Calculate visible page numbers
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Show ellipsis based on current position
            if (currentPage <= 3) {
                // Near the start: 1 2 3 4 5 ... last
                for (let i = 1; i <= 5; i++) pages.push(i);
                if (totalPages > 5) pages.push('...');
            } else if (currentPage >= totalPages - 2) {
                // Near the end: 1 ... last-4 last-3 last-2 last-1 last
                pages.push(1, '...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // In the middle: 1 ... current-1 current current+1 ... last
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    // Calculate showing records
    const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);

    // Check if next button should be enabled
    const canGoNext = currentPage < totalPages;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 py-8 px-6 bg-white border-t border-gray-200 ${className}`}>
            {/* Records Info */}
            <div className="text-sm text-gray-700 font-medium">
                Showing{' '}
                <span className="font-semibold text-gray-900">
                    {startRecord} - {endRecord}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-gray-900">
                    {totalRecords.toLocaleString()}
                </span>{' '}
                records
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    Previous
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, index) =>
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-gray-500">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                disabled={isLoading}
                                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all shadow-sm ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                } disabled:opacity-50`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext || isLoading}
                    className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    Next
                </button>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-sm text-gray-500 italic animate-pulse">Loading...</div>
            )}
        </div>
    );
};

export default Pagination;