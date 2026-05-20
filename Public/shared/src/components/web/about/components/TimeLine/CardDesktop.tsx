import { DotIcon, LineIcon } from "../../assets/TimeLine/TimeLineAssets";

const CardDesktop = ({
  year,
  title,
  content,
  color,
}: {
  id: any;
  year: any;
  title: any;
  content: any;
  color: any;
}) => {
  return (
    <div
      className={`h-[100vh] w-[100vw] flex flex-col justify-center items-center`}
    >
      <div className="text-center">
        <h3
          className={`text-[18px] md:text-[28px] 2xl:text-[34px] md:leading-[40px] font-semibold leading-[21px] min-w-max text-[${color}] md:mb-[10px] mb-[6px]`}
        >
          {title}
        </h3>
        <p className="text-[12px] w-[400px] mx-auto md:text-[14px] 2xl:text-[16px] md:leading-[22px] md:mb-[26px] font-normal leading-[20px]">
          {content}
        </p>
        <h2
          className={`text-[24px] md:text-[28px] 2xl:text-[34px] md:leading-[40px] font-semibold leading-[28px] text-[${color}] mb-[10px]`}
        >
          {year}
        </h2>
      </div>
      <div className="relative border-red-400 flex items-center w-full left-[50%] justify-normal">
        <DotIcon color={color} />
        {color === "#000" ? "" : <LineIcon />}
      </div>
    </div>
  );
};

export default CardDesktop;
