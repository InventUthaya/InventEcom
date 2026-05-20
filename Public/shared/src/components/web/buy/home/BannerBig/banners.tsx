import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import Banner from "./assets/banner.png";
const BannerBig = () => {
  const Banner = `${HelperConstant.imageAPI}/uae/banner/banner.png`

  return (
    <div className="w-full max-h-[120px] md:max-h-[400px] overflow-hidden rounded-[14px] mt-5 lg:mt-10 border border-[#EFEFEF88]">
      <img src={Banner} alt="banner" className="w-full h-full object-contain" />
    </div>
  );
};

export default BannerBig;
