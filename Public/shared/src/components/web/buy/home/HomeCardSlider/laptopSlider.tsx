import { useEffect, useState } from "react";
import { ProductCard } from "../../../../utils/Cards/productCard/productCard";
import CardSlider from "../../../../utils/cardsSlider/Slider";
import CommonService from "shared/src/services/CommonService";
import { IProductModel } from "shared/src/models/Product.Model";
import { useRouter } from "next/router";
import { IDealsProductModel } from "shared/src/models/DealsProduct.Model";
import ProductService from "shared/src/services/Product.Service";
import Link from "next/link";
import CategoryService from "shared/src/services/CategoryService";

export const LaptopSlider = ({ title }: { title: string, }) => {
    const [cardsPerView, setCardsPerView] = useState(1.3);
    const [product, setProduct] = useState<Array<IDealsProductModel>>([])
    const [laptopId, setLaptopId] = useState<number | null>(null);
    const navigate = useRouter();

    const getCategory = () => {
        CategoryService.getCategoryList()
            .then((res: any) => {
                if (res.status === 200 && res.data) {
                    const allCategories = res.data;
                    const laptopCategory = allCategories.find(
                        (category: { Name?: string }) => category.Name?.toLowerCase() === "laptop"
                    );
                    if (laptopCategory) {
                        setLaptopId(laptopCategory.EncryptedId);
                    }
                }
            })
            .catch((e: string) => {
                console.log("Error fetching categories:", e);
            });
    };

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
        getCategory();
        window.addEventListener("resize", updateCardsPerView);
        return () => {
            window.removeEventListener("resize", updateCardsPerView);
        };
    }, []);

    const getProduct = () => {
        (laptopId != null &&
            ProductService.getHomePageCategoryByFilter().then(res => {
                if (res.status === 200) {
                    setProduct(res.data.Items);
                }
            }).catch(e => {
                console.log(e)
            }))
    }

    useEffect(() => {
        getProduct();
    }, [laptopId]);

    const productDetails = () => {
        navigate.push('/buy/explore-more');
    }

    return (
        <div className="flex flex-col gap-10 mt-8 lg:mt-20 ">
            {product.length > 0 ? (
                <>
                    {product.filter((a: any) => a.Price != 0).map((card, index) => (
                        <>
                            <CardSlider cardsPerView={cardsPerView} title={card.DealName}>
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
                                        Image={card.FormattedMediaFileName} 
                                        DealName={card.DealName}                                    />
                                </Link>
                            </CardSlider>
                        </>
                    ))}
                    <div className="mx-auto">
                        <button className="border-0 outline-0 bg-[#EA002A] text-white text-sm sm:text-base p-3 px-10 rounded-md" onClick={productDetails}>
                            Explore More
                        </button>
                    </div>
                </>
            ) : ('')}
        </div>
    );
};
