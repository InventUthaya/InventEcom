import React from "react";

interface ProgressBarProps {
  progress: number; // Accepts a number between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Ensure that the progress doesn't exceed 0 to 100 range
  const validProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-[100%] bg-[#EFEFEF] h-1 rounded-full overflow-hidden">
      <div
        className="bg-red-500 h-1 rounded-full transition-all"
        style={{ width: `${validProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
