import { Quotes, StarFill, StarNoFill, UserProfile } from "../../web/buy/assets/testtimonials/testimonialIcons";

export const Testimonial = (props: any) => {
  const RatingList = () => {
    let Rating = [];
    for (let i = 1; i <= 5; i++) { // Fixed: Typically 5 stars, not 6
      if (i <= props.rating) {
        Rating.push(<StarFill key={props.id + i} />);
      } else {
        Rating.push(<StarNoFill key={props.id + i} />);
      }
    }
    return Rating;
  };

  return (
    <div
      className="bg-white border border-[#EFEFEF] rounded-xl p-6 h-full w-full relative"
    >
      {/* <div className="absolute -top-[14px] right-0">
        <Quotes />
      </div> */}

      <div className="text-sm md:text-base font-normal mb-4 md:mb-6 min-h-[80px]">
        {props.text}
      </div>
      <div className="flex gap-4 mt-auto">
        <div className="size-10 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden">
          <img src={UserProfile.src} alt={props.username} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-[14px] md:text-[16px]">{props.username}</h3>
          <div className="flex gap-1 mt-1">
            {<RatingList />}
          </div>
        </div>
      </div>
    </div>
  );
};