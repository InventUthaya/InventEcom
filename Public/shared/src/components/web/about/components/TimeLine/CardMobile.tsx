import { DotIcon, LineIcon } from "../../assets/TimeLine/TimeLineAssets";

const CardMobile = ({
  year,
  title,
  content,
  color,
  last,
}: {
  year: any;
  title: any;
  content: any;
  color: any;
  last: boolean;
}) => {
  return (
    <div className={`flex ${last?"h-[40vh]":"h-[80vh]"} gap-[20px] md:flex-col-reverse`}>
      <div className="flex flex-col md:flex-row md:justify-start items-center  min-h-[300px] md:min-h-max md:min-w-[100px]">
        <div className="">
          <DotIcon color={color} />
        </div>
        {color === "#000" ? "" : <LineIcon />}
      </div>
      <div>
        <h2
          className={`text-2xl font-semibold leading-[28px] text-[${color}] mb-[10px]`}
        >
          {year}
        </h2>
        <h3
          className={`text-xl font-semibold leading-[21px] text-[${color}] mb-[6px]`}
        >
          {title}
        </h3>
        <p className="text-sm font-normal leading-[20px]">{content}</p>
      </div>
    </div>
  );
};

export default CardMobile;
