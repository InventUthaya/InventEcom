export const CardTag = ({ text = "" }: { text?: any }) => {
  return (
    <div className="bg-[linear-gradient(40deg,_#00A7E7_30%,_#1E54C9)] text-xs sm:text-base capitalize rounded-r-[4px] absolute top-2 sm:top-4 left-0 text-white py-1 px-5">
      {text}
    </div>
  );
};
