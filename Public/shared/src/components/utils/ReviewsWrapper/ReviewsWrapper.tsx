import { useEffect, useState } from "react";
import CardSlider from "../cardsSlider/Slider";

const ReviewsWrapper = ({ title, cards }: { title: string; cards: any }) => {
  // for display how many need to show
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardsPerView(3);
      } else if (width >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();

    window.addEventListener("resize", updateCardsPerView);

    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  return (
    <CardSlider title={title} cardsPerView={cardsPerView}>
      {cards.map((card: any, index: any) => (
        <ReviewCards card={card} cardsPerView={cardsPerView} key={index} />
      ))}
    </CardSlider>
  );
};

export default ReviewsWrapper;

const ReviewCards = ({
  cardsPerView,
  card,
}: {
  cardsPerView: any;
  card: any;
}) => {
  return (
    <div
      className={`p-4 snap-center`}
      style={{ minWidth: `${100 / cardsPerView}%` }}
    >
      {/* Replace with card content */}
      <div className="max-w-sm mx-auto">
        <div className="flex flex-col gap-2">
          <div className="w-full rounded-xl overflow-hidden">
            <iframe
              className="w-full h-[160px] lg:h-[200px]"
              src="https://www.youtube.com/embed/mwpkHueAnuU"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-[#222222] p-2 text-sm sm:text-base lg:text-lg">
            {card.content}
          </p>
        </div>
      </div>
    </div>
  );
};
