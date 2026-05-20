import React, { useState, useEffect, useRef, useMemo } from 'react';

export interface DropdownItem {
    id: string;
    label: string;
    value: string;
    onClick?: () => void;
}

export interface CustomSearchDropdownProps {
    buttonText?: string;
    placeholder?: string;
    items: DropdownItem[];
    defaultOpen?: boolean;
    onItemSelect?: (item: DropdownItem) => void;
    buttonClassName?: string;
    menuClassName?: string;
    className?: string;
}

const CustomSearchDropdown: React.FC<CustomSearchDropdownProps> = ({
    buttonText = 'Open Dropdown',
    placeholder = 'Search items',
    items,
    defaultOpen = false,
    onItemSelect,
    buttonClassName = '',
    menuClassName = '',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // FIX: Use useMemo instead of useEffect + state to prevent re-render of input
    const filteredItems = useMemo(() => {
        if (searchTerm.trim() === '') {
            return items;
        }
        return items.filter(item =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isOpen) return;

            const target = event.target as Node;
            const isInsideDropdown = dropdownRef.current?.contains(target);
            const isInsideButton = buttonRef.current?.contains(target);

            if (!isInsideDropdown && !isInsideButton) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Focus the search input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setSearchTerm('');
    };

    const handleItemClick = (item: DropdownItem) => {
        item.onClick?.();
        onItemSelect?.(item);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
            buttonRef.current?.focus();
        }
    };

    return (
        <div className={`relative ${className}`}>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className={`w-full inline-flex justify-between items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:border-blue-500 ${buttonClassName}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                type="button"
            >
                <span className="truncate mr-2">{buttonText}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={`absolute left-0 right-0 mt-1 rounded-md shadow-lg bg-white border border-gray-300 overflow-hidden z-50 ${menuClassName}`}
                    style={{
                        maxHeight: '300px',
                        minWidth: '200px',
                    }}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdown-button"
                >
                    {/* Search input */}
                    <div className="p-2 border-b">
                        <input
                            ref={inputRef}
                            className="block w-full px-3 py-2 text-gray-800 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            type="text"
                            placeholder={placeholder}
                            autoComplete="off"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Search dropdown items"
                        />
                    </div>

                    <div className="overflow-y-auto max-h-64">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <button
                                    key={item.id}
                                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer text-sm transition-colors duration-150 truncate"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick(item);
                                    }}
                                    role="menuitem"
                                    type="button"
                                >
                                    {item.label}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-gray-500 text-center text-sm">
                                No items found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSearchDropdown;