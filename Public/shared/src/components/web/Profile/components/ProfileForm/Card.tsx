import { useState } from "react";

const Card = (data: any) => {
  let [editInputBoolean, setEditInputBoolean] = useState(false);
  let focusHandler = () => {
    setEditInputBoolean(() => !editInputBoolean);
  };
  return (
    <div className="flex flex-col gap-1 w-full z-auto">
      <div className="title font-normal text-[16px]">{data.title}</div>
      <div className="bg-[#FFFFFF] border-[1px] border-[#DFDFDF] rounded-md">
        <div className=" flex justify-between  py-5 px-[14px] ">
          {editInputBoolean ? (
            <input
              className=" w-full font-normal text-[14px] leading-[16.8px] outline-none"
              type="text"
              placeholder={data.content}
            />
          ) : (
            <p className=" w-full font-normal text-[14px] leading-[16.8px] outline-none">
              {data.content}
            </p>
          )}
          <img
            src={data.image.src}
            alt=""
            className="cursor-pointer"
            onClick={focusHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
