import { BoxCurve, GradeIcon } from "./assets";
import Box from "./assets/box.png";
import React, { useState } from "react";


function BoxandGrades() {
  return (
    <div className="flex flex-col gap-5">
      {/* <InsideBox /> */}
      {/* <GradeComponent /> */}
    </div>
  );
}

export default BoxandGrades;

const InsideBox = () => (
  <div className="bg-white border border-[#EBEBEB] flex justify-between flex-col-reverse md:flex-row rounded-xl overflow-hidden">
    <div className="p-6 flex flex-col gap-3">
      <h1 className="text-xl font-semibold text-[#000]">{box.title}</h1>
      <div className="flex flex-col gap-2">
        {box.values.map((e, i) => (
          <div className="flex justify-start items-center gap-4" key={i}>
            <div className="bg-[#EA002A22] shrink-0 text-sm text-[#EA002A] font-semibold border border-[#EA002A] w-8 h-8 flex justify-center items-center rounded-[50%]">
              {i + 1}
            </div>
            <div className="text-sm md:text-base font-semibold">{e}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="w-full md:w-fit h-48 relative">
      <div className="absolute top-0 right-0 md:-right-8">
        <BoxCurve />
      </div>
      <img
        src={Box.src}
        alt="box"
        className="w-full h-full object-contain rotate-[10deg] md:translate-x-8 md:translate-y-12 md:scale-125"
      />
    </div>
  </div>
);
const box = {
  title: "What you get inside the box",
  values: [
    "A new box with surprises including bill",
    "Compatible Charger with USB Charger",
    "6 Warranty Card for protection",
  ],
};

const GradeComponent = () => {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const toggleShowMore = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 md:p-8">
      <h2 className="text-xl md:text-3xl font-semibold">{grade.title}</h2>
      <div className="flex flex-col gap-5 mt-5">
        {grade.values.map((e, index) => (
          <div
            className="flex justify-start items-start gap-6 md:gap-8"
            key={index}
          >
            <div className="mt-2">
              <e.icon />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{e.title}</h2>

              {/* First point as intro, rest as show more */}
              <p className="text-sm sm:text-base mt-2 mb-2">
                {e.points[0]}
              </p>

              {expanded[index] && (
                <ul className="list-disc text-sm sm:text-base ml-4">
                  {e.points.slice(1).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {e.points.length > 1 && (
                <button
                  onClick={() => toggleShowMore(index)}
                  className="text-[#EA002A] text-sm font-semibold"
                >
                  {expanded[index] ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const grade = {
  title: "Grades Title goes here",
  values: [
    {
      title: "Just Unbox",
      icon: GradeIcon,
      points: [
        "Looks and feels brand new with zero signs of use. Flawless display, 100% functional, and rigorously tested for top performance. A premium device at a fraction of the price!"
      ],
    },
    {
      title: "Like New",
      icon: GradeIcon,
      points: [
        "Product that almost looks like a new one. Original product which has been opened and may have been barely used. The product is graded by DofyStore Experts.",
        "Battery Health above 95%",
        "100% Original Product.",
        "12 months exclusive warranty by DofyStore.",
        "Shipped in DofyStore Box."
      ],
    },
    {
      title: "Excellent",
      icon: GradeIcon,
      points: [
        "Product comes in Excellent condition at the most affordable price. Product may have minor signs of usage.Product passed through 42+ quality checks done by DofyStore Expert technicians and is 100% fucntional.Comes with no dents and may have few scratches.",
        "Minor sign of usage on product",
        "6 months warranty by DofyStore",
        "Shipped in DofyStore Customized Box.",
      ],
    },
    {
      title: "Good",
      icon: GradeIcon,
      points: [
        "Product may have moderate signs of usage.Product passed through 42+ quality checks done by DofyStore expert technicians and is 100% fucntional.May have few scratches/dents",
        "Most ecomnomical product with moderate signs of usage",
        "6 months warranty by DofyStore",
        "Shipped in DofyStore Customized Box.",
      ],
    },
  ],
};

