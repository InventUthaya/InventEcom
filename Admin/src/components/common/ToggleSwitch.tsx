import Label from "../form/Label";

// Toggle Switch component
 const ToggleSwitch: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => {
    return (
        <div className="flex items-center">
            <div className="mr-3">
                <Label htmlFor={id} className="text-sm font-medium text-gray-700">
                    {label}
                </Label>
            </div>
            <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id={id}
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform transform ${checked ? 'translate-x-5' : 'translate-x-1'} absolute top-0.5`}></div>
                </div>
            </label>
        </div>
    );
};

export default ToggleSwitch;