import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import CardDesktop from "./CardDesktop"; // Assuming these components exist and handle props properly
import { timeLineData } from "./TimeLineData"; // Assuming this is your data array
import CardMobile from "./CardMobile";

const TimeLine = ({ direction, language }: { direction:any, language: "in_en" | "ae_en" | "ae_ar" }) => {
  gsap.registerPlugin(ScrollTrigger);
  const sectionRef = useRef(null);
  const triggerRef: any = useRef(null);

  useEffect(() => {
    // Only proceed if both refs are current
    if (triggerRef.current && sectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(sectionRef.current, { x: 0 }, { x: "-300vw", ease: "none" });

      // ResizeObserver to ensure we refresh GSAP on size changes
      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      resizeObserver.observe(triggerRef.current);

      // Cleanup function to remove the ResizeObserver and GSAP instances
      return () => {
        if (triggerRef.current) {
          resizeObserver.unobserve(triggerRef.current);
        }
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        tl.kill();
      };
    }
  }, []); // Empty dependency array means this effect will only run once after the initial render

  return (
    <>
      <div className="block lg:hidden mt-20" dir={direction} lang={language}>
        <div className="flex flex-col gap-5 px-10">
          {timeLineData.map((data, index) => (
            <CardMobile
              key={data.id}
              {...data}
              last={index == timeLineData.length - 1}
            />
          ))}
        </div>
      </div>
      <div className="hidden lg:block overflow-hidden bg-white my-20">
        <div ref={triggerRef}>
          <div
            ref={sectionRef}
            className="h-screen flex flex-row relative w-[400vw]"
          >
            {timeLineData.map((data) => (
              <CardDesktop key={data.id} {...data} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeLine;