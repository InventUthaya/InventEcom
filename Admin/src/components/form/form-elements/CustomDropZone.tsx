import { useDropzone } from "react-dropzone";

interface DropzoneComponentProps {
  label: string;
  onDropCallback: (file: File) => void;
  showTwice?: boolean;
  disabled?: boolean;
}

const CustomDropzoneComponent: React.FC<DropzoneComponentProps> = ({
  label,
  onDropCallback,
  showTwice = false,
  disabled = false,
}) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onDropCallback(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "application/pdf": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    disabled,
  });

  const getErrorMessage = () => {
    if (fileRejections.length === 0) return null;

    const isSizeError = fileRejections.some(
      ({ errors }) => errors.some(e => e.code === 'file-too-large')
    );

    if (isSizeError) {
      return "File is larger than 5MB";
    }

    return "Only one file is allowed";
  };

  const renderDropzone = (dropzoneLabel: string) => (
    <div
      className={`border border-gray-300 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 border-dashed rounded-lg transition ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div
        {...getRootProps()}
        className={`dropzone rounded-lg border-dashed border-gray-300 p-5
          ${isDragActive && !disabled
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }
          ${disabled ? 'pointer-events-none' : ''}`}
        id="demo-upload"
      >
        <input {...getInputProps()} disabled={disabled} />

        <div className="flex flex-row items-center m-0! dz-message">
          <div className="flex justify-center mr-4">
            <div className="flex justify-center items-center bg-gray-200 dark:bg-gray-800 rounded-full w-12 h-12 text-gray-700 dark:text-gray-400">
              <svg
                className="fill-current"
                width="24"
                height="20"
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

          <div className="flex flex-col">
            <h4 className="mb-2 font-normal text-gray-800 dark:text-white/90 text-base">
              {dropzoneLabel} <span className="text-red-500">*</span>
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {disabled ? "Select a document type to enable upload" : "Select only one file (max 5MB)"}
            </p>

            {fileRejections.length > 0 && !disabled && (
              <p className="mt-1 text-red-600 text-xs">
                {getErrorMessage()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (showTwice) {
    return (
      <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
        {renderDropzone("Drag and Drop Front side of the aadhar card")}
        {renderDropzone("Drag and Drop Back side of the aadhar card")}
      </div>
    );
  }

  return renderDropzone(label);
};

export default CustomDropzoneComponent;