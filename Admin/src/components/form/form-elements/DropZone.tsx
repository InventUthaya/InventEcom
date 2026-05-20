import React, { useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import ComponentCard from "../../common/ComponentCard";

interface DropzoneComponentProps {
  handleFiles: (files: File[], fileRejections: any[]) => void;
  acceptedFileFormat?: Accept;
  maxFileSize?: number
}

// Function to format bytes into human-readable format
const formatFileSize = (bytes: number | undefined): string => {
  if (!bytes) return '';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i))) + ' ' + sizes[i];
};

// Function to get file icon based on type
const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8.94C19.9896 8.84813 19.9695 8.75763 19.94 8.67V8.58C19.8919 8.47718 19.8278 8.38267 19.75 8.3L13.75 2.3C13.6673 2.22222 13.5728 2.15808 13.47 2.11C13.4402 2.10576 13.4099 2.10576 13.38 2.11C13.2784 2.05174 13.1662 2.01434 13.05 2H7C6.20435 2 5.44129 2.31607 4.87868 2.87868C4.31607 3.44129 4 4.20435 4 5V19C4 19.7956 4.31607 20.5587 4.87868 21.1213C5.44129 21.6839 6.20435 22 7 22H17C17.7956 22 18.5587 21.6839 19.1213 21.1213C19.6839 20.5587 20 19.7956 20 19V9C20 9 20 9 20 8.94ZM14 5.41L16.59 8H15C14.7348 8 14.4804 7.89464 14.2929 7.70711C14.1054 7.51957 14 7.26522 14 7V5.41ZM18 19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H7C6.73478 20 6.48043 19.8946 6.29289 19.7071C6.10536 19.5196 6 19.2652 6 19V5C6 4.73478 6.10536 4.48043 6.29289 4.29289C6.48043 4.10536 6.73478 4 7 4H12V7C12 7.79565 12.3161 8.55871 12.8787 9.12132C13.4413 9.68393 14.2044 10 15 10H18V19ZM9 15C9 15.2652 8.89464 15.5196 8.70711 15.7071C8.51957 15.8946 8.26522 16 8 16C7.73478 16 7.48043 15.8946 7.29289 15.7071C7.10536 15.5196 7 15.2652 7 15C7 14.7348 7.10536 14.4804 7.29289 14.2929C7.48043 14.1054 7.73478 14 8 14C8.26522 14 8.51957 14.1054 8.70711 14.2929C8.89464 14.4804 9 14.7348 9 15ZM7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929C7.48043 11.1054 7.73478 11 8 11H10C10.2652 11 10.5196 11.1054 10.7071 11.2929C10.8946 11.4804 11 11.7348 11 12C11 12.2652 10.8946 12.5196 10.7071 12.7071C10.5196 12.8946 10.2652 13 10 13H8C7.73478 13 7.48043 12.8946 7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12ZM17 13C17 13.2652 16.8946 13.5196 16.7071 13.7071C16.5196 13.8946 16.2652 14 16 14H12C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12H16C16.2652 12 16.5196 12.1054 16.7071 12.2929C16.8946 12.4804 17 12.7348 17 13ZM17 17C17 17.2652 16.8946 17.5196 16.7071 17.7071C16.5196 17.8946 16.2652 18 16 18H12C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16H16C16.2652 16 16.5196 16.1054 16.7071 16.2929C16.8946 16.4804 17 16.7348 17 17Z" fill="currentColor"/>
      </svg>
    );
  } else if (fileType.includes('image')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14.14 11.86L11.14 15.73L9 13.14L6 17H18L14.14 11.86Z" fill="currentColor"/>
      </svg>
    );
  } else if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('xlsx')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM10 19L12 15L14 19H10ZM12 13L10 9H14L12 13Z" fill="currentColor"/>
      </svg>
    );
  } else {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM9 13V15H15V13H9ZM9 17V19H15V17H9Z" fill="currentColor"/>
      </svg>
    );
  }
};

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({ handleFiles, acceptedFileFormat, maxFileSize }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const onDrop = (acceptedFiles: File[], fileRejections: any[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    } else {
      // Clear the uploaded file when no files are accepted
      setUploadedFile(null);
    }
    
    // Call parent handler
    handleFiles(acceptedFiles, fileRejections);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptedFileFormat,
    maxSize: maxFileSize
  });

  const acceptedFormatsText = acceptedFileFormat
    ? Object.values(acceptedFileFormat)
      .flat() // Flatten the array
      .join(", ") // Join into a comma-separated string
    : "";

  // Format the max file size for display
  const formattedMaxFileSize = formatFileSize(maxFileSize);

  // Remove the file
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    // Call parent function to handle removal
    handleFiles([], []);
  };

  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
      <form
        {...getRootProps()}
        className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
        ${isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }
        `}
        id="demo-upload"
      >
        {/* Hidden Input */}
        <input {...getInputProps()} />

        {!uploadedFile ? (
          <div className="dz-message flex flex-col items-center !m-0">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>

            <span className="text-center mb-2 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your files here or browse
            </span>

            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
            
            {/* Always render these lines to maintain consistent spacing */}
            <span className="block text-xs text-gray-500 mt-2" style={{ minHeight: '1rem' }}>
              {acceptedFormatsText ? `Accepted formats: ${acceptedFormatsText}` : '\u00A0'}
            </span>
            <span className="block text-xs text-gray-500 mt-2" style={{ minHeight: '1rem' }}>
              {formattedMaxFileSize ? `Maximum file size: ${formattedMaxFileSize}` : '\u00A0'}
            </span>
          </div>
        ) : (
          // File Preview UI
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-blue-300">
                    {getFileIcon(uploadedFile.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {uploadedFile.name.length > 15 ? `${uploadedFile.name.slice(0, 15)}...` : uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(uploadedFile.size)} • {uploadedFile.type || "Unknown type"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  type="button"
                  className="flex-shrink-0 ml-2 bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress bar - could be dynamic in a real implementation */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 dark:bg-gray-700">
                <div className="bg-emerald-600 h-1.5 rounded-full w-full"></div>
              </div>
            </div>
            
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              File uploaded successfully
            </span>
            
            <span className="text-xs text-gray-500 mt-2">
              Click or drag to replace with another file
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default DropzoneComponent;