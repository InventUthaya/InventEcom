import React, { useState, useEffect, useRef } from 'react';

interface LocationSearchProps {
    value: any;
    onChange: (value: string) => void;
    onSelectItem?: (item: any) => void;
    globalData: any[];
    checkPincodeAvailability: (value: string) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
    value,
    onChange,
    onSelectItem,
    globalData,
    checkPincodeAvailability
}) => {
    const [query, setQuery] = useState(value);
    const [selected, setSelected] = useState<any>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setQuery(newValue);
        setSelected(null);
        setIsOpen(newValue.length > 0);
    };

    const handleSelect = (item: any) => {
        setQuery(item.DisplayGeoName);
        setSelected(item.Name);
        onChange(item.Name);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (value && value !== query) {
            const selectedItem = globalData.find(item => item.Name === value);
            if (selectedItem) {
                setQuery(selectedItem.DisplayGeoName);
                setSelected(selectedItem.Name);
            } else {
                setQuery(value);
                setSelected(null);
            }
        }
    }, [value, globalData, query]);

    const isPincode = /^\d{6}$/.test(query);
    const matchingItem = globalData.find(item => item.DisplayGeoName.toLowerCase() === query.toLowerCase());
    const isValidSelection = !!matchingItem || isPincode;

    useEffect(() => {
        if (matchingItem && !selected) {
            setSelected(matchingItem.Name);
        }
    }, [matchingItem, selected]);

    const toTitleCase = (str: string) => {
        if (!str) return '';
        if (str === str.toLowerCase()) return str;
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="relative w-full mt-2" ref={dropdownRef}>
            <input
                className="w-full text-sm pl-4 pr-24 py-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 outline-none"
                placeholder="Enter Pincode to check availability"
                value={toTitleCase(query)}
                onChange={handleInputChange}
                onFocus={() => value && setIsOpen(true)}
            />
            <button
                disabled={!isValidSelection}
                className="absolute right-1 top-1 bottom-1 bg-[#249B3E] text-white px-6 text-sm font-semibold rounded-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                onClick={() => checkPincodeAvailability(selected || query)}
            >
                Check
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {globalData.length === 0 && value !== "" ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            No results found for "{value}"
                        </div>
                    ) : (
                        globalData.map((item) => (
                            <div
                                key={item.Id}
                                className="relative cursor-pointer select-none py-2 pl-4 pr-4 text-gray-900 hover:bg-red-100"
                                onClick={() => handleSelect(item)}
                            >
                                <div className="flex items-center">
                                    <span className="block truncate">
                                        {toTitleCase(item.DisplayGeoName)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationSearch;