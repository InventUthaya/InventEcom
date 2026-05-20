import Image from "next/image";

export const OurAssuranceCardTemplate = (props: any) => {
  return (
    <div className="px-4 py-5 md:py-5 rounded-full md:rounded-2xl border border-gray-100 bg-white w-[150px] md:w-full flex flex-col flex-wrap items-center justify-center mx-auto shadow-sm">
      <div className="mb-3 md:mb-6">
        <Image
          src={props.image}
          className="w-[90px] h-[90px] md:w-[230px] md:h-[140px]"
          alt="assurance-img"
          height={200}
          width={200}
        />
      </div>

      {/* Title */}
      <div className="text-center font-semibold md:text-md text-black text-[14px] md:text-[18px]">
        {props.title}
      </div>
    </div>
  );
};