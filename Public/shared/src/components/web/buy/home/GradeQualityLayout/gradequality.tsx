import GradeQualityTemplate from "./gradeCards";
const GradeQualityLayout = () => {
  return (
    <>
      <h2 className="text-xl md:text-4xl font-semibold flex justify-center mt-10 lg:mt-20 ">
        Product Quality Standards
      </h2>
      <div className="flex justify-between gap-5 flex-col md:flex-row mt-5 md:mt-10">
        {GradeQuantity.map((gradeQuantity) => {
          return (
            <GradeQualityTemplate key={gradeQuantity.id} {...gradeQuantity} />
          );
        })}
      </div>
    </>
  );
};

export default GradeQualityLayout;
export const GradeQuantity = [
  {
    id: "1",
    title: "Brand New",
    description:
      "Unused and unused components straight from the manufacturer. Perfect condition with original packaging and full warranty intact.",
    imagepath: "/assets/GradeQuality/image1.jpg",
  },
  {
    id: "2",
    title: "Premium Grade",
    description:
      "Sourced from leading global brands with certified manufacturing standards. Tested for precision, durability, and long service life.",
    imagepath: "/assets/GradeQuality/image2.jpg",
  },
  {
    id: "3",
    title: "OEM Certified",
    description:
      "Original Equipment Manufacturer approved parts. Carefully inspected to ensure compatibility, performance, and reliability are uncompromised.",
    imagepath: "/assets/GradeQuality/image4.jpg",
  },
  {
    id: "4",
    title: "Best Value",
    description:
      "High-quality industrial components at competitive prices. Fully verified for performance and durability — perfect for every application and budget.",
    imagepath: "/assets/GradeQuality/image5.jpg",
  },
];

