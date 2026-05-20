import { ArrowLeft, ArrowRight } from "lucide-react"; 
import React, { useState } from "react";

type PaginationProps = {
    recordsCount: number
    rowsPerPage: number,
    rowName: any,
    offsetStart: any,
    setOffsetStart: any
};


export const Pagination = ({ recordsCount, offsetStart, rowsPerPage, setOffsetStart }: PaginationProps) => {
    const totalPages = Math.ceil(recordsCount / rowsPerPage);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handlePaginatbuttonClick = (type: "prev" | "next" | "fullPrev" | "fullNext") => {
        if (type === "prev") {
            const newOffset = offsetStart - rowsPerPage;
            setOffsetStart(newOffset >= 0 ? newOffset : 0); 
            setCurrentPage(cur => Math.max(cur - 1, 1)); 
        }
        if (type === "next") {
            const newOffset = offsetStart + rowsPerPage;
            setOffsetStart(newOffset < recordsCount ? newOffset : offsetStart); 
            setCurrentPage(cur => Math.min(cur + 1, totalPages)); 
        }
        if (type === "fullPrev") {
            setOffsetStart(0);
            setCurrentPage(1);
        }
        if (type === "fullNext") {
            setOffsetStart(recordsCount - rowsPerPage);
            setCurrentPage(totalPages);
        }
    };


    return (
        <React.Fragment>
            {/* Desktop Pagination */}
            <nav className="items-center justify-between w-full px-8 py-4 border-t border-[#e4e7ec] hidden lg:flex">
                <button
                    className="flex items-center gap-2 text-sm text-[#475467]"
                    onClick={() => handlePaginatbuttonClick("prev")}
                    disabled={currentPage === 1}
                >
                    <ArrowLeft />
                    Previous
                </button>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => {
                                const newOffset = (page - 1) * rowsPerPage;
                                setOffsetStart(newOffset);
                                setCurrentPage(page);
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg ${page === currentPage
                                ? "bg-gray-50 text-[#18212f]"
                                : "text-[#475467] hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button
                    className="flex items-center gap-2 text-sm text-[#475467]"
                    onClick={() => handlePaginatbuttonClick("next")}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ArrowRight />
                </button>
            </nav>

            {/* Mobile Pagination */}
            <div className="flex items-center justify-between w-full border-t border-[#e4e7ec] py-4 pb-12 lg:hidden">
                <button
                    onClick={() => handlePaginatbuttonClick("prev")}
                    className="bg-white border border-[#d0d5dd] rounded-lg p-2 shadow-shadows-shadow-xs-skeuomorphic"
                    disabled={currentPage === 1}
                >
                    <ArrowLeft />
                </button>
                <span className="text-[#344054] text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePaginatbuttonClick("next")}
                    className="bg-white border border-[#d0d5dd] rounded-lg p-2 shadow-shadows-shadow-xs-skeuomorphic"
                    disabled={currentPage === totalPages}
                >
                    <ArrowRight />
                </button>
            </div>
        </React.Fragment>
    );
};

export default Pagination;
