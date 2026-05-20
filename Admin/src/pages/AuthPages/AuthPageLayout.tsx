// import React from "react";
// import GridShape from "../../components/common/GridShape";

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="z-1 relative bg-white dark:bg-gray-900 sm:p-0">
//       {/* Mobile Background - GridShape with brand background */}
//       <div className="absolute inset-0 bg-brand-950 dark:bg-gray-800 lg:hidden">
//         <div className="absolute inset-0 flex items-center justify-center">
//           <GridShape />
//         </div>
//       </div>

          

//       <div className="relative flex lg:flex-row flex-col justify-center dark:bg-gray-900 md:p-0 w-full h-screen p-2">
//          <div className="relative z-10 flex justify-center pt-4 pb-1 lg:hidden">
//       </div>
//         {/* Desktop Left Side */}
//         <div className="hidden items-center lg:grid bg-white dark:bg-white/5 w-full lg:w-1/2 h-full">
//           <div className="z-1 relative flex justify-center items-center">
//             <GridShape />
//             <div className="flex flex-col items-center max-w-xs">
//               <img
//                 width={230}
//                 height={100}
//                 src="/images/Logo (1).png"
//                 alt="Logo"
//               />
//             </div>
//           </div>
//         </div>
 
//         <div className="relative w-full lg:w-1/2 flex flex-col lg:items-center justify-start lg:justify-center pt-1 lg:pt-0">
//           <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg lg:rounded-none shadow-lg lg:shadow-none mx-auto p-6 mt-4 lg:mt-0 relative z-10 ">
//             {children}
//           </div>
//         </div>
 
//         <div className="hidden sm:block right-6 bottom-6 z-50 fixed">
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import GridShape from "../../components/common/GridShape";
import LeftSideAnimation from "../../components/common/LeftSideAnimation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="z-1 relative bg-white dark:bg-gray-900 sm:p-0 overflow-hidden">
      {/* Mobile Background - GridShape with brand background */}
      <div className="absolute inset-0 bg-brand-950 dark:bg-gray-800 lg:hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <GridShape />
        </div>
      </div>

      <div className="relative flex lg:flex-row flex-col justify-center dark:bg-gray-900 md:p-0 w-full h-screen p-2">
        <div className="relative z-10 flex justify-center pt-4 pb-1 lg:hidden">
        </div>
        
        {/* Desktop Left Side - Replace with Animation */}
        <LeftSideAnimation />
 
        <div className="relative w-full lg:w-1/2 flex flex-col lg:items-center justify-start lg:justify-center pt-1 lg:pt-0">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg lg:rounded-none shadow-lg lg:shadow-none mx-auto p-6 mt-4 lg:mt-0 relative z-10">
            {children}
          </div>
        </div>
 
        <div className="hidden sm:block right-6 bottom-6 z-50 fixed">
        </div>
      </div>
    </div>
  );
}