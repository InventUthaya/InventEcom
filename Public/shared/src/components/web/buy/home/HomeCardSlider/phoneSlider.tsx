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

export const PhoneSlider = ({ title }: { title: string }) => {
    const [cardsPerView, setCardsPerView] = useState(1.3);
    const [product, setProduct] = useState<Array<IDealsProductModel>>([]);
    const [phoneId, setPhoneId] = useState<number | null>(null);
    const navigate = useRouter();

    const getCategory = () => {
        CategoryService.getCategoryList()
            .then((res: any) => {
                if (res.status === 200 && res.data) {
                    const phoneCategory = res.data.find(
                        (category: { Name?: string }) => category.Name?.toLowerCase() === "phone"
                    );
                    if (phoneCategory) {
                        setPhoneId(phoneCategory.EncryptedId);
                    }
                }
            })
            .catch((e: string) => {
                console.error("Error fetching categories:", e);
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
        return () => window.removeEventListener("resize", updateCardsPerView);
    }, []);

    const getProduct = () => {
    if (phoneId != null) {
        // Get client's local time in ISO format
        const now = new Date();
        const clientLocalTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        ProductService.getHomePageCategoryByFilter(clientLocalTime)
            .then((res) => {
                if (res.status === 200) {
                    setProduct(res.data.Items);
                }
            })
            .catch((e) => console.error("Error fetching products:", e));
    }
};
    useEffect(() => {
        getProduct();
    }, [phoneId]);

    const productDetails = () => {
        navigate.push("/buy/explore-more");
    };

    // Group products by DealName
    const groupedProducts = product
        .filter((item) => item.Price !== 0) // Filter out products with Price = 0
        .reduce((acc: Record<string, IDealsProductModel[]>, item) => {
            if (!acc[item.DealName]) {
                acc[item.DealName] = [];
            }
            acc[item.DealName].push(item);
            return acc;
        }, {});

    return (
        <div className="flex flex-col gap-10 mt-8 lg:mt-0">
            {Object.entries(groupedProducts).map(([dealName, dealProducts]) => (
                <div key={dealName}>
                    <CardSlider cardsPerView={cardsPerView} title={dealName}>
                        {dealProducts.map((card) => (
                            <Link href={`/buy/topDeals/${card.EncryptedProductId}`} key={card.ProductId}>
                                <ProductCard
                                    EncryptedProductId={card.EncryptedProductId}
                                    title={card.ProductName}
                                    price={card.Price}
                                    discount={card.DiscountPercentage}
                                    needTag={true}
                                    cardswidth={100 / cardsPerView}
                                    OrginalPrice={card.OldPrice}
                                    DiscountName={card.DiscountPricePercentage}
                                    Image={card.FormattedMediaFileName}
                                    DealName={card.DealName}
                                />
                            </Link>
                        ))}
                    </CardSlider>

                    {/* Explore More button below each CardSlider */}
                    {dealProducts.length > 0 && (
                        <div className="mx-auto mt-4 text-center">
                            <button
                                className="border-0 outline-0 bg-[#EA002A] text-white text-sm sm:text-base p-3 px-10 rounded-md"
                                onClick={productDetails}
                            >
                                Explore More
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

};
