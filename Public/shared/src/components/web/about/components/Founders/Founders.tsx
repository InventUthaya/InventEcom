import { getDatalocalization } from "shared/src/components/helper/Helper";
import Card from "./Card";
import Language from "shared/src/Languages/AboutLanguage.json";
import { foundersContents } from "./FoundersData";

const Founders = ({ language }: { language: "in_en" | "ae_en" | "ae_ar" }) => {
  let dataLocalization = Language["ae_en"];
  const content = foundersContents["ae_en" as keyof typeof foundersContents];

  return (
    // <>
    //   <div className=" font-medium text-2xl leading-[32px] flex justify-center items-center">
    //     <h1>{dataLocalization.Hear_it_from_the_founders}</h1>
    //   </div>
    //   {content.map((data: { image: any; role: any; name: any; about: any; }) => {
    //     return <Card image={data.image} role={data.role} name={data.name} about={data.about} />;
    //   })}
    // </>
    <></>
  );
};

export default Founders;
