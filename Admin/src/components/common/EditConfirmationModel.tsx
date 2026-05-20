import { X } from 'lucide-react';
import React from 'react';

const EditConfirmationModal = ({
    handleDeleteConfirm,
    handleDeleteCancel,
    title,
    isDeleteDisabled,
    message
}: {
    handleDeleteConfirm: any;
    handleDeleteCancel: any;
    title?: any;
    isDeleteDisabled?: boolean;
    message?: string
}) => {
    return (
        <div x-show="isModalOpen" className="z-99999 fixed inset-0 flex justify-center items-center p-5 overflow-y-auto modal">
            <div className="fixed inset-0 bg-gray-400/50 backdrop-blur-[4px] w-full h-full modal-close-btn"></div>
            <div className="flex flex-col px-4 py-4 overflow-y-auto no-scrollbar">
                <div className="relative bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-3xl w-full max-w-[507px]">
                    <div className="z-1 relative flex justify-center items-center mb-2">
                        <svg className="fill-error-50 dark:fill-error-500/15" width="60" height="80" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z" fill="" fill-opacity="">

                            </path>
                        </svg>
                        <span className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2">
                            <X className='text-red-600' />
                        </span>
                    </div>
                    <div className="text-center">
                        <h4 className="mb-2 font-semibold text-gray-800 sm:text-title-sm dark:text-white/90 text-2xl">
                            Are you sure?
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-6">
                            {message}
                        </p>

                        <div className="flex justify-center items-center gap-3 mt-8 w-full">
                            <button onClick={handleDeleteCancel} type="button" className="flex justify-center bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-white/[0.03] shadow-theme-xs px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-400 text-sm">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} type="button" className="flex justify-center bg-red-500 hover:bg-red-600 shadow-theme-xs px-4 py-3 rounded-lg font-medium text-white text-sm">
                                Yes, Continue-Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default EditConfirmationModal;