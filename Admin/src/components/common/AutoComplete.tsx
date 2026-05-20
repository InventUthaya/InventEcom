import React, { useState, useEffect, useRef } from 'react';
import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface Option {
    value: string | number;
    label: string;
}

interface CustomAutocompleteProps {
    id: string;
    label: string;
    options: any[];
    value?: any;
    onChange: (value: any | number) => void;
    register?: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    clearErrors?: UseFormClearErrors<any>;
    errors?: FieldErrors<any>;
    placeholder?: string;
    isRequired?: boolean;
    className?: string;
    isDisabled?: boolean;
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
    id,
    label,
    options,
    value,
    onChange,
    register,
    setValue,
    clearErrors,
    errors,
    placeholder = 'Search...',
    isRequired = false,
    className = '',
    isDisabled = false
}) => {
    const [inputValue, setInputValue] = useState(value ?? "");
    const [filteredOptions, setFilteredOptions] = useState<Array<any>>(options);
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: any) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsOpen(true);
        setFocusedIndex(-1);
        const filteredOptions = options.filter((option) =>
            option.label.toLowerCase().includes(newValue.toLowerCase())
        );
        setFilteredOptions(filteredOptions);
    };

    const handleSelect = (option: Option) => {
        setInputValue(option.label);
        setValue(id, option.label);
        onChange(option.value);
        if (clearErrors) clearErrors(id);
        setIsOpen(false);
        setFocusedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen && e.key === 'ArrowDown') {
            setIsOpen(true);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex((prev) => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
            if (focusedIndex >= 0 && filteredOptions.length > 0) {
                e.preventDefault();
                handleSelect(filteredOptions[focusedIndex]);
            } else if (filteredOptions.length === 1) {
                handleSelect(filteredOptions[0]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    };

    useEffect(() => {
        const currentOption = options.find(opt => opt.value === value);
        const currentInputValue = currentOption ? currentOption.label : inputValue;

        setInputValue(currentInputValue);

        const filtered = options.filter((option) =>
            option.label.toLowerCase().includes(currentInputValue.toLowerCase())
        );

        setFilteredOptions(filtered);
    }, [options, value]);

    useEffect(() => {
        if (value === undefined || value === null) {
            setInputValue("");
            setFilteredOptions(options);
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    }, [value, options]);

    return (
        <div className={`relative ${className}`}>
            <label htmlFor={id} className="block mb-1 font-medium text-gray-700 text-sm">
                {label}
                {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                type="search"
                ref={inputRef}
                value={inputValue ?? ""}
                onKeyDown={handleKeyDown}
                onFocus={() => { setIsOpen(true); }}
                placeholder={placeholder}
                autoComplete='off'
                className="bg-transparent disabled:bg-gray-50 dark:bg-gray-900 shadow-sm px-3 py-2 border border-gray-300 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-800 rounded-lg focus:ring-3 focus:ring-blue-500/10 w-full h-10 dark:placeholder:text-white/30 dark:text-white/90 placeholder:text-gray-400 text-sm disabled:cursor-not-allowed"
                {...(register && register(id, { required: isRequired ? `${label} is required` : false, onChange: (e) => handleInputChange(e) }))}
                disabled={isDisabled}
            />
            {isOpen && (
                <ul
                    ref={dropdownRef}
                    className="z-10 absolute bg-white dark:bg-gray-900 shadow-lg mt-1 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-h-60 overflow-auto"
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                onMouseEnter={() => setFocusedIndex(index)}
                                className={`px-3 py-2 text-sm cursor-pointer ${focusedIndex === index
                                    ? 'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white'
                                    : 'text-gray-700 dark:text-gray-200'
                                    } hover:bg-blue-50 dark:hover:bg-blue-700`}
                            >
                                {option.label}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm cursor-default">
                            No records found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomAutocomplete;