import { useEffect, useState } from "react";
import first from "../../assets/Riders/first.png";
import second from "../../assets/Riders/second.png";
import third from "../../assets/Riders/third.png";
import four from "../../assets/Riders/four.png";
import sixth from "../../assets/Riders/sixth.png";
import circle from "../../assets/Riders/circle.png";

import Language from "shared/src/Languages/AboutLanguage.json";
import Image from "next/image";

const Riders = ({ direction, language }: { direction:any, language: "in_en" | "ae_en" | "ae_ar" }) => {
  // Create an array of 90 items to simulate your circles
  const [highlighted, setHighlighted] = useState(0);
  const circles = new Array(90).fill(circle);
  let dataLocalization = Language[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlighted((prev) => (prev + 1) % 6); // Rotate through 6 images
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-14 lg:mt-20" dir={direction} lang={language}>
      <div className="lg:px-16 px-5">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col gap-2 md:gap-6">
            <p className="font-medium text-lg lg:text-xl 2xl:text-2xl text-[#EA002A]">
              {dataLocalization.Our_vast_riders_around_the_corners}
            </p>
            <h2 className="font-semibold text-2xl lg:text-6xl 2xl:text-7xl">
              1200+ {dataLocalization.Active_Riders}
            </h2>
          </div>
        </div>
      </div>
      {/* Container for circles ensuring it can fit 15 * 80px + gaps */}
      <div className="mt-10 overflow-hidden">
        <div
          className="grid lg:grid-cols-15 grid-col-6"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(15, 80px)",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {circles.map((_, index) => (
            <div
              key={index}
              className={`lg:${(index === 4 && highlighted === 0) ||
                (index === 22 && highlighted === 2) ||
                (index === 35 && highlighted === 3) ||
                (index === 56 && highlighted === 4) ||
                (index === 70 && highlighted === 5)
                ? "opacity-100"
                : "opacity-50"
                }`}
              style={{
                width: "80px",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image height={1000} width={1000}
              src={(index === 6 ? first : index === 26 ? third : index === 31 ? four : index === 53 ? second : index === 65 ? sixth : circle).src}
              style={{ width: "80px", height: "80px" }} alt={""}              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Riders;
