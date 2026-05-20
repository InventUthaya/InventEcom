import Image from "next/image";
const Card = (props: any) => {

  function markup(descVal: any) {
    return { __html: descVal };
  }

  return (
    <>
      <div className="gap-6 mt-[24px]  bg-[#FFFFFF] rounded-[16px] border-[#EDEDED] border-[1px]   justify-center align-middle  ">
        <div className=" py-[27px] px-[16px] flex flex-col lg:flex lg:flex-row md:flex-row">
          <Image className=" rounded-[12px] object-contain" key={props.id} src={props.image} width={1000} height={1000} alt={`founders_${props.id}`} />
          <div className=" flex flex-col ml-[0px] md:ml-[36px] mr-[0px] md:mr-[50px]">
            <h2 className=" font-medium text-[22px] 2xl:text-[30px] md:text-[24px] leading-[28px] mt-[16px] ">
              {props.name}
            </h2>
            <h2 className="font-medium text-[12px] md:text-[18px] text-[#EA002A] mt-[6px] md:mt-[14px] leading-[14.4px] md:leading-[28px]">
              {props.role}
            </h2>
            <div className=" text-[#050505] text-[12px] md:text-[14px] 2xl:text-[16px] font-normal md:font-light leading-[24px] md:leading-[28px] mt-[10px] md:mt-[14px] text-justify" dangerouslySetInnerHTML={markup(props.about)}>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
