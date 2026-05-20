import { ReactNode, useEffect, useRef, useState } from "react";

const CardSlider = ({
  title,
  cardsPerView,
  children,
}: {
  title: string;
  cardsPerView: number;
  children: ReactNode;
}) => {
  const sliderRef: any = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0); // 0: start, 1: moving, 2: end

  useEffect(() => {
    // Check initial scroll position on mount
    checkScrollPosition();
    // Optional: handle resize to adjust for changing the number of visible cards
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, []);

  const checkScrollPosition = () => {
    const slider: any = sliderRef.current;
    if (slider) {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft === 0) {
        setScrollPosition(0); // Start
      } else if (slider.scrollLeft + 10 >= maxScrollLeft) {
        setScrollPosition(2); // End
      } else {
        setScrollPosition(1); // Moving
      }
    }
  };

  const goToPrevious = () => {
    const cardWidth: any = sliderRef.current
      ? sliderRef.current.offsetWidth / cardsPerView
      : 0;
    sliderRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    setTimeout(checkScrollPosition, 500);
  };

  const goToNext = () => {
    const cardWidth = sliderRef.current
      ? sliderRef.current.offsetWidth / cardsPerView
      : 0;
    sliderRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    setTimeout(checkScrollPosition, 500);
  };

  return (
    <div className="relative">
      <div className="relative flex justify-between">
        <div className="ml-4 lg:ml-0 text-left w-full font-semibold text-lg sm:text-xl md:text-4xl">
          {title}
        </div>
        <div className="hidden lg:flex gap-4">
          <button
            onClick={goToPrevious}
            className="rotate-180"
            disabled={scrollPosition == 0}
          >
            <Arrow
              className="w-10 h-10"
              color={scrollPosition == 0 ? "D9D9D9" : "EA002A"}
            />
          </button>
          <button onClick={goToNext} disabled={scrollPosition == 2}>
            <Arrow
              className="w-10 h-10"
              color={scrollPosition == 2 ? "D9D9D9" : "EA002A"}
            />
          </button>
        </div>
      </div>

      <div className="overflow-hidden mt-5 lg:mt-10 ">
        <div
          ref={sliderRef}
          className="transition-transform flex gap-6 overflow-x-auto lg:scrollbar-hide snap-mandatory snap-x"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardSlider;

const Arrow = ({ color = "EA002A", className = "w-[24px] h-[24px]" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.0013 25.6654C7.55798 25.6654 2.33464 20.442 2.33464 13.9987C2.33464 7.55538 7.55798 2.33203 14.0013 2.33203C20.4446 2.33203 25.668 7.55538 25.668 13.9987C25.668 20.442 20.4446 25.6654 14.0013 25.6654Z"
        stroke={`#${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0013 9.33203L18.668 13.9987L14.0013 18.6654"
        stroke={`#${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33464 14H18.668"
        stroke={`#${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
