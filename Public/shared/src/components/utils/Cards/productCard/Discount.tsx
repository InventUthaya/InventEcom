export const Discount = (props: any) => {
  return (
    <>
      <div
        className={`my-auto mr-auto px-[10px] md:px-[10px] py-[4px] border border-[#EA002A] rounded bg-[#FFDEE4]  ${
          props.hidden && props.isGrid
            ? "md:block hidden"
            : props.isGrid
            ? "md:hidden block mt-[14px]"
            : ""
        } `}
      >
        <p className="text-[10px] text-nowrap md:text-[12px] leading-[14.4px] font-semibold text-[#EA002A]">
          {props.discount}% OFF
        </p>
      </div>
    </>
  );
};

