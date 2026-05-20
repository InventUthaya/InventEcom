import { useEffect, useState } from "react";
import Image from "next/image";
import CardSlider from "shared/src/components/utils/cardsSlider/Slider";


const PressRelease = ({ title, cards, direction, lanugage }: { title: string; cards: any, direction: any, lanugage: "in_en" | "ae_ar" | "ae_en" }) => {
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // for display how many need to show
  const cardsPerView =
    viewportWidth >= 1024 ? 2 : viewportWidth >= 768 ? 2 : 1

  return (
    <CardSlider title={title} cardsPerView={cardsPerView}>
      {cards.map((card: any, index: any) => (
        <Card card={card} cardsPerView={cardsPerView} key={index} />
      ))}
    </CardSlider>
  );
};

export default PressRelease;

const Card = ({ cardsPerView, card }: { cardsPerView: any; card: any }) => {
  return (
    <div
      className={`lg:p-2 snap-center`}
      style={{ minWidth: `${100 / cardsPerView}%` }}
    >
      {/* Replace with card content */}
      <div className="w-full  px-2 ">
        <div className="flex flex-col gap-2">
          <div className="w-full overflow-hidden rounded-xl">
            <Image height={1000} width={1000} src={''} className="w-full lg:h-[300px]" alt="press-thumbnail" />
          </div>
          <p className="text-[#222222] p-2 text-sm sm:text-base lg:text-md 2xl:text-lg">
            {card.content}
          </p>
        </div>
      </div>
    </div>
  );
};
