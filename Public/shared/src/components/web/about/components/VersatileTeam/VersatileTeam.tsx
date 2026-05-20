import { getDatalocalization } from "shared/src/components/helper/Helper";
import Card from "./Card";
import { VersatileData, versatileDataContents } from "./VersatileData";
import Language from "shared/src/Languages/AboutLanguage.json";

const VersatileTeam = ({ language }: { language: "in_en" | "ae_en" | "ae_ar" }) => {
  let dataLocalization = Language["ae_en"];
  const content = versatileDataContents["ae_en" as keyof typeof versatileDataContents];

  return (
    <>
      {/* <div className=" font-medium text-2xl flex justify-center mt-20">
        {dataLocalization.Our_Versatile_Team}
      </div>
      <div className="flex justify-center items-center flex-col md:flex md:flex-row gap-4 mt-4 my-28">
        {content.map((data: { image: any; role: any; name: any; about: any; }) => {
          return (
            <Card
              image={data.image}
              role={data.role}
              name={data.name}
              about={data.about}
            />
          );
        })}
      </div> */}
    </>
  );
};

export default VersatileTeam;
