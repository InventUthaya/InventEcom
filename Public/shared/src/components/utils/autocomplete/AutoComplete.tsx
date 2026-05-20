import { error } from 'console';
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IAddressModel } from 'shared/src/models/Address.Model';

type Suggestion = {
    Code: string;
    Description: string;
};

class AutoCompleteProps {
    suggestions?: Array<Suggestion>;
    label: string | undefined;
    onChange: ((val: any) => void) | undefined;
    valueField: any;
    disable: boolean | undefined
    error?: any
    errorText?: string
    formHook?: any
}

const AutoCompleteSearch = (props: AutoCompleteProps) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { register, handleSubmit, formState: { errors }, clearErrors, setValue, reset, control, watch } = useForm<IAddressModel>({
    });

    const activeSuggestionRef = useRef<HTMLLIElement | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value) {
            let filtered: any;
            filtered = props?.suggestions?.filter((suggestion: any) => suggestion[props.valueField].toLowerCase().includes(value.toLowerCase()));
            setFilteredSuggestions(filtered);
            setActiveSuggestionIndex(0);
            setShowSuggestions(true);

        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        setInputValue(suggestion[props.valueField]);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            if (activeSuggestionIndex < filteredSuggestions.length - 1) {
                setActiveSuggestionIndex(activeSuggestionIndex + 1);
            }
        } else if (event.key === 'ArrowUp') {
            if (activeSuggestionIndex > 0) {
                setActiveSuggestionIndex(activeSuggestionIndex - 1);
            }
        } else if (event.key === 'Enter') {
            if (filteredSuggestions.length > 0) {
                setInputValue(filteredSuggestions[activeSuggestionIndex][props.valueField]);
                setFilteredSuggestions([]);
                setShowSuggestions(false);
                if (props?.onChange) {
                    props?.onChange(filteredSuggestions[activeSuggestionIndex].Id)
                }
            }
        } else if (event.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        if (activeSuggestionRef.current) {
            activeSuggestionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [activeSuggestionIndex]);

    return (
        <div>
            <label htmlFor="pincode" className="text-sm lg:text-base font-normal capitalize">
                {props.label}
            </label>
            {/* <input
                disabled={props.disable}
                type="text"
                value={inputValue}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="lg:w-[310px] lg:h-[35px] placeholder:capitalize border text-sm border-[#DFDFDF] p-2 rounded-md"
                // {...props.formHook}
                {...register("LocationId", { required: true, onChange: handleInputChange })}

            /> */}
            {inputValue.length >= 1 && <>
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {filteredSuggestions.map((suggestion: any, index: number) => (
                            <li
                                key={index}
                                ref={index === activeSuggestionIndex ? activeSuggestionRef : null}
                                className={index === activeSuggestionIndex ? 'active' : ''}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion[props.valueField]}
                            </li>
                        ))}
                    </ul>
                )}
            </>}
            {props.error && <p className="text-xs font-semibold text-red-700">{props.errorText}</p>}
        </div>
    );
}

export default AutoCompleteSearch;
