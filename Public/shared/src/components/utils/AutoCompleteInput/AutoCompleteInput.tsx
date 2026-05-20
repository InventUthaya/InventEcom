import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Country {
    name: string;
}

const CountryComboBox: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [query, setQuery] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('Argentina');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    // useEffect(() => {
    //     const fetchCountries = async () => {
    //         try {
    //             const response = await axios.get('https://freetestapi.com/api/v1/countries', {
    //                 params: { limit: 100 }
    //             });
    //             setCountries(response.data);
    //         } catch (error) {
    //             console.error('Error fetching countries:', error);
    //         }
    //     };

    //     fetchCountries();
    // }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        setIsDropdownOpen(true);
    };

    const handleCountrySelect = (country: string) => {
        setSelectedCountry(country);
        setQuery('');
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative">
            <div className="relative">
                <input
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    type="text"
                    value={query || selectedCountry}
                    onChange={handleInputChange}
                    onFocus={() => setIsDropdownOpen(true)}
                />
                <div
                    className="absolute top-1/2 end-3 -translate-y-1/2 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <svg
                        className="flex-shrink-0 size-3.5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m7 15 5 5 5-5"></path>
                        <path d="m7 9 5-5 5 5"></path>
                    </svg>
                </div>
            </div>
            {isDropdownOpen && (
                <div
                    className="absolute z-50 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto"
                >
                    {countries
                        .filter(country => country.name.toLowerCase().includes(query.toLowerCase()))
                        .map(country => (
                            <div
                                key={country.name}
                                className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100"
                                onClick={() => handleCountrySelect(country.name)}
                            >
                                <div className="flex justify-between items-center w-full">
                                    <div>{country.name}</div>
                                    {selectedCountry === country.name && (
                                        <svg
                                            className="flex-shrink-0 size-3.5 text-blue-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default CountryComboBox;
