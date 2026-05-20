import { useEffect, useState } from "react";
import { ProductCard } from "../../../../utils/Cards/productCard/productCard";
import CardSlider from "../../../../utils/cardsSlider/Slider";
import CommonService from "shared/src/services/CommonService";
import { IProductModel } from "shared/src/models/Product.Model";
import { useRouter } from "next/router";
import { IDealsProductModel } from "shared/src/models/DealsProduct.Model";
import ProductService from "shared/src/services/Product.Service";
import Link from "next/link";


export const BuyCardSlider = ({ title, price }: { title?: string, price?: any }) => {
  const [cardsPerView, setCardsPerView] = useState(1.3);
  const [product, setProduct] = useState<Array<IDealsProductModel>>([])
  const navigate = useRouter();

  useEffect(() => {
    const updateCardsPerView = () => {
      setCardsPerView(window.innerWidth >= 1124
        ? 4.2
        : window.innerWidth >= 900
          ? 3
          : window.innerWidth >= 840
            ? 2.8
            : window.innerWidth >= 480
              ? 2
              : 1.3);
    };

    updateCardsPerView();

    window.addEventListener("resize", updateCardsPerView);

    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  const getFilteredProducts = (filterParams: Record<string, string[]>) => {
    ProductService.getCategoryBrandByFilter(filterParams)
      .then((res: any) => {
        if (res.status === 200) {
          setProduct(res.data.Items);
        }
      })
      .catch((e: string) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (price) {
      getFilteredProducts({ Price: [`Above ${price}`] });
    } else {
    }
  }, [price]);

  const productDetails = () => {
    navigate.push('/buy/explore-more');
  }

  return (
    <div className="flex flex-col gap-10 mt-8 lg:mt-20 ">
      {product && (<CardSlider cardsPerView={cardsPerView} title={'Similar Deals'}>
        {product.filter((a: any) => a.Price != 0).map((card, index) => (
          <Link href={`/buy/topDeals/${card.EncryptedProductId}`} key={index}>
            <ProductCard
              EncryptedProductId={card.EncryptedProductId}
              key={index}
              title={card.ProductName}
              price={card.Price}
              discount={card.DiscountPercentage}
              needTag={true}
              cardswidth={100 / cardsPerView}
              OrginalPrice={card.OldPrice}
              DiscountName={card.DiscountPricePercentage}
              Image={card.FormattedMediaFileName} DealName={""}
            />
          </Link>
        ))}
      </CardSlider>
      )}
      <div className="mx-auto">
        <button className="border-0 outline-0 bg-[#EA002A] text-white text-sm sm:text-base p-3 px-10 rounded-md" onClick={productDetails}>
          Explore More
        </button>
      </div>
    </div>
  );
};
