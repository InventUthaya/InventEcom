import { Check, Minus, X } from "lucide-react";

export default function TripleToggle({
  value,
  onChange,
  label,
  className = ""
}: any) {
  const handleToggle = (event:any) => {
    const toggleRect = event.currentTarget.querySelector('div[class*="rounded-full"]').getBoundingClientRect();
    const clickX = event.clientX;

    const toggleWidth = toggleRect.width;
    const clickPosition = clickX - toggleRect.left;

    if (clickPosition < toggleWidth / 3) {
      onChange(false);
    }
    else if (clickPosition > (toggleWidth * 2) / 3) {
      onChange(true);
    }
    else {
      onChange(null);
    }
  };


  const getToggleStyles = () => {
    if (value === null || value === undefined) {
      return {
        background: "bg-gray-300",
        borderColor: "border-gray-400",
        icon: <Minus size={14} className="text-gray-700" />,
        knobPosition: "left-1/2 -translate-x-1/2" // Center position
      };
    } else if (value === true) {
      return {
        background: "bg-green-500",
        borderColor: "border-green-600",
        icon: <Check size={14} className="text-white" />,
        knobPosition: "right-2" // Right position
      };
    } else {
      return {
        background: "bg-red-500",
        borderColor: "border-red-600",
        icon: <X size={14} className="text-white" />,
        knobPosition: "left-2" // Left position
      };
    }
  };

  const styles = getToggleStyles();

  return (
    <div
      className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200 h-12 ${className || ""}`}
      onClick={handleToggle}
    >
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div
        className={`relative w-14 h-6 rounded-full transition-colors duration-300 ${styles.background} border ${styles.borderColor}`}
      >
        <div className={`absolute top-1/2 -translate-y-1/2 ${styles.knobPosition} h-4 w-4 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300`}>
          {styles.icon}
        </div>
      </div>
    </div>
  );
}