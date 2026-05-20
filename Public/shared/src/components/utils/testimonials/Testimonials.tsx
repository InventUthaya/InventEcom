import { useEffect, useRef } from "react";
import { Testimonial } from "./TestimonialCard";
import { testimonialDummyTexts } from "./TestimonialData";

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.getBoundingClientRect().top;
        const sectionHeight = sectionRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        if (sectionTop <= 0 && sectionTop > -sectionHeight + windowHeight) {
          sectionRef.current.classList.add("fixed-section");
        } else {
          sectionRef.current.classList.remove("fixed-section");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <style>{`
        .fixed-header {
          position: sticky;
          top: 0;
          background-color: white;
          z-index: 10;
          width: 100%;
          padding: 16px 0;
        }
        .testimonial-content {
          padding-top: 10px;
          width: 100%;
        }
      `}</style>
      <div 
        className="flex flex-col w-full mt-14" 
        ref={sectionRef}
      >
        <div className="flex md:flex-row flex-col-reverse gap-[8px] md:gap-0 justify-between items-center mb-[24px] md:mb-[40px]">
          <h2 className="font-medium text-[22px] leading-[32px] md:text-[46px] md:leading-[66px]">
            What our customers say
          </h2>
        </div>
        <div className="testimonial-content mb-5">
          {/* Single responsive grid container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {testimonialDummyTexts.map((data, index) => (
              <div
                key={data.id}
                className="testimonial-item"
              >
                <Testimonial {...data} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;