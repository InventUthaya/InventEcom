import React from "react";

// Tab Toggle Switch component
const TabToggle: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    label2?: string;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}> = ({ id, label, checked, label2, onChange, disabled = false }) => {
    return (
<div className="flex flex-col">
    <div className="inline-flex  bg-gray-200 p-0.5 w-fit">
        <button
            type="button"
            disabled={disabled}
            className={`px-4 py-1.5 w-22 text-xs font-medium transition-all duration-200 ${
                !checked 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-black hover:text-gray-800'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !disabled && onChange(false)}
        >
            {label}
        </button>
        {label2 && (
            <button
                type="button"
                disabled={disabled}
                className={`px-4 py-1.5 w-22 text-xs font-medium transition-all duration-200 ${
                    checked 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'text-black hover:text-gray-800'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !disabled && onChange(true)}
            >
                {label2}
            </button>
        )}
    </div>
    
    {/* Hidden input for form compatibility */}
    <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
    />
</div>
    );
};

export default TabToggle;