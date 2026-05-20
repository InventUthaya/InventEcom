import Image from "next/image";
import { HeroData } from "./HeroData";

const AboutHero = ({ direction, language }: { direction: any, language: any }) => {

  const categoryImageMap: Record<string, string> = {
    WAREHOUSE: "/assets/About/warhouse.jpg",
    COMPUTER: "/assets/About/computer.jpg",
    WORKPLACE: "/assets/About/workplace.jpg",
    PACKAGE: "/assets/About/package.jpg",
    LAPTOP: "/assets/About/laptop.jpg",
  };
  const categoryImages = Object.values(categoryImageMap);

  const getImageUrl = (index: number) => {
    return categoryImages[index % categoryImages.length];
  };


  return (
    <>
      <style>
        {`
          @keyframes scrollHorizontal {
            from {
              transform: translateX(0%);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}
      </style>

      <div className="relative w-full overflow-hidden h-[200px] lg:h-[400px] mt-8 lg:mt-20" lang={language}>
        <div
          className="absolute inset-0 flex whitespace-nowrap"
          style={{
            animation: `scrollHorizontal 30s linear infinite`,
            width: "200%",
          }}
        >
          {HeroData.concat(HeroData).map((data, index) => (
            <Image
              loader={({ src }) => src}
              src={getImageUrl(index)}
              height={1000}
              width={1000}
              key={index}
              alt={`hero_image_${data.id}`}
              className={`inline-block mr-10 ${index % 2 ? "mt-10" : "mb-10"
                } rounded-lg w-[200px] h-[160px] lg:w-[340px] lg:h-[280px] object-cover`}
            />


          ))}
        </div>
      </div>
    </>
  );
};

export default AboutHero;
