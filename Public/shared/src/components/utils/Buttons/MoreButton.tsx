function MoreButton(props: any) {
  return (
    <div
      className={`px-10 lg:px-16 py-2 lg:py-3 bg-[#EA002A] w-max rounded-md cursor-pointer grid place-items-center`}
    >
      <p className="text-white font-medium text-[16px] leading-[26px]">
        {props.text || props.children}
      </p>
    </div>
  );
}

export default MoreButton;
