export const DotIcon = ({ color = "#EA002A" }) => {
    return (
        <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="13"
                cy="13"
                r="11"
                fill={color}
                stroke="white"
                stroke-width="4"
            />
        </svg>
    );
};

export const LineIcon = () => {
    return (
        <div
            className={`w-[6px] md:w-full h-full md:h-[6px] bg-gradient-to-t md:bg-gradient-to-l from-[#fff] to-[#EA002A]`}
        >
            &nbsp;
        </div>
    );
};
