import { HelperConstant } from "../../helper/HelperConstant";
import { QRappstore, QRplaystore, AppStoreIcon, PlaystoreIcon } from "./assets";
import dofyimg from "./assets/dofyimg.png"
const DownloadSection = () => {
  const AppStoreIcon = `${HelperConstant.imageAPI}/uae/download/AppStoreIcon.svg`
  const QRappstore = `${HelperConstant.imageAPI}/uae/download/QRappstore.svg`
  const QRplaystore = `${HelperConstant.imageAPI}/uae/download/QRplaystore.svg`
  const PlaystoreIcon = `${HelperConstant.imageAPI}/uae/download/PlaystoreIcon.svg`
  const dofyimg = `${HelperConstant.imageAPI}/uae/download/dofyimg.png`

  return (
    <>
      <div className="flex flex-col relative pt-10 sm:pt-16 px-5 lg:px-10 mt-10 lg:mt-20 gap-10 lg:flex-row overflow-hidden justify-center lg:justify-around bg-[#fff] rounded-2xl border border-[#EDEDED]">
        <div className="absolute size-[220px] bg-[#EA002A] rounded-full blur-[175px] bottom-[-100px] right-0"></div>
        <div className="absolute size-[88px] bg-[#00A7E7] rounded-full blur-[100px] top-[124px] -right-[15px]"></div>
        <div className="absolute size-[140px] bg-[#00A7E7] rounded-full blur-[195px] bottom-0 -left-[50px]"></div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center lg:items-start gap-4  ">
            <p className="text-xl md:text-3xl lg:text-4xl font-semibold text-center">
              Download Our Exclusive App
            </p>
            <p className="text-base sm:text-lg lg:text-2xl text-center">
              And Don’t miss any New deals on your device
            </p>
          </div>
          {/* <div className="flex gap-4 sm:gap-8 justify-center lg:justify-start">
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#EDEDED] p-4 flex flex-col gap-4 ">
              <img className="" src={QRappstore} alt="" />
              <img className="" src={AppStoreIcon} alt="" />
            </div>
            <div className=" bg-[#FFFFFF] rounded-2xl border border-[#EDEDED]  p-4 flex flex-col gap-4 ">
              <img className="" src={QRplaystore} alt="" />
              <img className="" src={PlaystoreIcon} alt="" />
            </div>
          </div> */}
        </div>
        <div className="z-[5] m-auto lg:m-0">
          <img className="w-[400px] h-[500px] " src={dofyimg} alt="" />
        </div>
      </div>
    </>
  );
};

export default DownloadSection;
