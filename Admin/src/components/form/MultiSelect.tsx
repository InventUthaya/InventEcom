import type React from "react";
import { useState, useEffect, useRef } from "react";

interface Option {
  [key: string]: string;
}

interface MultiSelectProps {
  label: any;
  options: Option[];
  valueField: string;
  displayField: string;
  defaultSelected?: any[];
  onChange?: (selected: any[]) => void;
  disabled?: boolean;
  isAllOptionIncluded?: boolean;
  isRequired?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  valueField,
  displayField,
  defaultSelected = [],
  onChange,
  disabled = false,
  isAllOptionIncluded = false,
  isRequired = false
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOptions(defaultSelected);
  }, [defaultSelected]);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((value) => value !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const removeOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const clearAllOptions = () => {
    setSelectedOptions([]);
    onChange?.([]);
  };

  const selectedValuesText = selectedOptions.map(
    (value) =>
      options.find((option) => option[valueField] === value)?.[displayField] ||
      ""
  );

  const availableOptions =
    isAllOptionIncluded
      ? (defaultSelected.includes(0)
        ? []
        : options.filter((option) => !selectedOptions.includes(option[valueField])))
      : (defaultSelected.includes(0)
        ? []
        : options.filter((option) => !selectedOptions.includes(option[valueField])));

  return (
    <div className="w-full">
      <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-400 text-sm">
        {label}{isRequired && <span className="text-red-500"> *</span>}
      </label>

      <div className="inline-block relative w-full" ref={dropdownRef}>
        <div className="relative flex flex-col items-center">
          <div className="w-full">
            <div
              className={`
                flex items-start gap-2 w-full min-h-[2.75rem] max-h-[6rem] 
                px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                rounded-lg shadow-theme-xs focus:ring-1 focus:border-blue-300 
                dark:focus:border-blue-300 outline-none transition-all duration-200
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-600'}
                ${isOpen ? 'border-blue-300 dark:border-blue-300' : ''}
              `}
              onClick={toggleDropdown}
            >
              {/* Selected Items Container */}
              <div className="flex-1 flex flex-wrap gap-1.5 min-w-0 overflow-y-auto max-h-[4rem]">
                {selectedValuesText.length > 0 ? (
                  selectedValuesText.map((text, index) => (
                    <div
                      key={index}
                      className="
                        inline-flex items-center gap-1.5 px-2.5 py-1 
                        bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                        rounded-full text-xs sm:text-sm text-gray-700 dark:text-gray-300
                        hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors
                        max-w-full
                      "
                    >
                      <span className="truncate max-w-[120px] sm:max-w-[200px]" title={text}>
                        {text}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(selectedOptions[index]);
                        }}
                        className="
                          flex-shrink-0 w-4 h-4 rounded-full 
                          hover:bg-gray-300 dark:hover:bg-gray-600 
                          focus:outline-none focus:ring-2 focus:ring-gray-400
                          transition-colors
                        "
                        title="Remove"
                      >
                        <svg
                          className="w-3 h-3 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 py-1 text-gray-500 dark:text-gray-400 text-sm pointer-events-none">
                    Select {label}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                {selectedOptions.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllOptions();
                    }}
                    className="
                      p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 
                      text-gray-500 dark:text-gray-400 focus:outline-none 
                      focus:ring-2 focus:ring-gray-400 transition-colors
                    "
                    title="Clear All"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(e);
                  }}
                  className="
                    p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 
                    text-gray-500 dark:text-gray-400 focus:outline-none 
                    focus:ring-2 focus:ring-gray-400 transition-all duration-200
                  "
                  title={isOpen ? "Close" : "Open"}
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className="
                absolute top-full left-0 right-0 z-50 mt-1 
                bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                rounded-lg shadow-lg max-h-[200px] overflow-y-auto
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                {availableOptions.length > 0 ? (
                  availableOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`
                        px-3 py-2 cursor-pointer text-sm
                        hover:bg-gray-100 dark:hover:bg-gray-800 
                        text-gray-700 dark:text-gray-300
                        ${selectedOptions.includes(option[valueField]) 
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                          : ""
                        }
                        ${index === availableOptions.length - 1 ? "" : "border-b border-gray-100 dark:border-gray-800"}
                      `}
                      onClick={() => handleSelect(option[valueField])}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{option[displayField]}</span>
                        {selectedOptions.includes(option[valueField]) && (
                          <svg
                            className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No options available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;