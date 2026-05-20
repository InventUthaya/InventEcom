// import { Payment, Quality, Trendy, Warranty } from "./assets";

function CheckList() {
  return (
    <>
      <div className="grid md:grid-cols-2 md:gap-5 p-3 md:p-0 bg-white md:bg-transparent rounded-md md:rounded-none">
        {checklistData.map((checklist, index) => (
          <div
            key={index}
            className={`flex justify-start md:items-center ${index != checklistData.length - 1 && "border-b border-[#E5E5E5]"
              } md:border-0 gap-4 p-4 md:p-6 bg-white md:rounded-lg`}
          >
            {/* <div>
              <checklist.icon />
            </div> */}
            <div>
              <h3 className="text-base md:text-xl font-bold">
                {checklist.title}
              </h3>
              <p className="text-sm md:text-base text-[#8A8A8A]">
                {checklist.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CheckList;

const checklistData = [
  {
    title: "Precision Engineered Quality",
    description: "Every bearing and component manufactured to exact tolerances and industry standards",
    // icon: Quality,
  },
  {
    title: "Wide Range of Brands",
    description: "Sourced from leading global brands like SKF, FAG, NSK, NTN and many more",
    // icon: Trendy,
  },
  {
    title: "Perfect Fit Guarantee",
    description: "Every part matched to exact specifications ensuring seamless installation and performance",
    // icon: Payment,
  },
  {
    title: "Durable & Long Lasting",
    description: "Built with high-grade materials to withstand heavy loads and extreme industrial conditions",
    // icon: Warranty,
  },
];
