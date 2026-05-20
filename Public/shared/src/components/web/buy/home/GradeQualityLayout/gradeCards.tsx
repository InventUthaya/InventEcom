const GradeQualityTemplate = (props: any) => {
  return (
    <div className="flex flex-col bg-white border border-[#EFEFEF] rounded-2xl overflow-hidden shadow-sm w-full">
      {/* Image Section - Full width, no spaces */}
      <div className="w-full">
        <img
          className="w-full h-[120px] md:h-[160px] object-cover"
          src={props.imagepath}
          alt={props.title}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-2 py-4 px-5 md:py-5 md:px-6 w-full">
        <div className="text-[16px] md:text-[20px] font-semibold leading-snug">
          {props.title}
        </div>
        <div className="text-[#22222266] text-[12px] md:text-[16px] leading-relaxed">
          {props.description}
        </div>
      </div>
    </div>
  );
};

export default GradeQualityTemplate;