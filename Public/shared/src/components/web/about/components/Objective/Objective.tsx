import { getDatalocalization } from "shared/src/components/helper/Helper";
import { Line } from "../../assets/Objective/ObjectiveAssets";
import Language from "shared/src/Languages/AboutLanguage.json";

const Objective = ({ language }: { language: "in_en" | "ae_en" | "ae_ar" }) => {
  let dataLocalization = Language[language];

  return (
    <div className="flex flex-col md:flex-row gap-[40px] w-full justify-center items-center">
      <div className="flex flex-col gap-3 md:max-w-[530px] md:w-[50%]">
        <h3 className="font-semibold text-[#EA002A] leading-[22px] text-[14px] 2x:text-[16px] tracking-[2px]">
          {dataLocalization.MISSION}
        </h3>
        <p className="text-justify">{dataLocalization.Empowering_individuals_to_transform_idle}</p>
      </div>
      <div className="hidden md:block">
        <Line />
      </div>
      <div className="flex flex-col gap-3 md:max-w-[530px] md:w-[50%]">
        <h3 className="font-semibold text-[#EA002A] leading-[22px] text-[14px] 2x:text-[16px] tracking-[2px]">
          {dataLocalization.VISION}
        </h3>
        <p className="text-justify">{dataLocalization.To_create_a_global_platform_that_connects_individuals}</p>
      </div>
    </div>
  );
};

export default Objective;
