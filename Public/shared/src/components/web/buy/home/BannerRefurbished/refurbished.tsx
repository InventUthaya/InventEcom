import { refurbished } from "./assets";

const imagepath = '/assets/images/whatscollection/image1.jpg';
const BannerRefurbished = () => {
  return (
    <div className="relative bg-white border border-[#EFEFEF88] mt-14 overflow-hidden rounded-[14px] flex flex-col md:flex-row gap-5">
      <div className="relative w-full md:w-1/3 mt-5 md:mt-0">
        <img
          className="w-[200px] h-[200px] object-contain mx-auto md:m-0 md:scale-150 md:-rotate-[20deg] md:absolute md:top-0 md:-left-8"
          alt=""
          src={imagepath}
        />
        {/* <img
          className="block md:hidden w-[170px] h-[170px] object-contain mx-auto mb-[12px] mt-[16px]"
          alt=""
          src={refurbished}
        /> */}
      </div>
      <div className="relative flex flex-col items-start justify-start gap-3 p-10">
        <div className="relative text-lg tracking-[2px] leading-[22px] uppercase font-semibold text-[#EA002A]">
          WHAT IS OUR PRODUCT COLLECTION?
        </div>
        <div className="mb-[20px] font-normal md:mb-0 relative text-lg leading-[30px] text-black text-wrap">
          Our collection features a wide range of industrial components carefully
          sourced from leading global brands to meet the demands of modern machinery.
          <div>
            Each product is precision-engineered to the highest standard from
            bearings and seals to belts, couplings, and drive chains. Every item is
            built for reliable performance, long service life, and affordability
            across all industrial applications.
          </div>
        </div>
      </div>

    </div>
  );
};

export default BannerRefurbished;
