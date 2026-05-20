import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IMostVisitedProductsModel } from 'shared/src/models/MostVisitedProducts.Model';
import MostVisitedProductsServices from 'shared/src/services/MostVisitedProducts.Services';
import { MostVisitedProductCard } from './MostVisitedProductCard';

function MostVisitedProducts() {
    const [productsToShow, setProductsToShow] = useState<Array<IMostVisitedProductsModel>>([]);

    const fetchMostVisitedProducts = async () => {
        MostVisitedProductsServices.GetMostVisitedProducts()
            .then((res: any) => {
                if (res.status === 200) {
                    setProductsToShow(res.data);
                }
            }).catch((e: string) => {
                console.error(e);
            })
    }

    useEffect(() => {
        fetchMostVisitedProducts();
    }, [])

    return (
        <React.Fragment>
            <h2 className="text-xl md:text-4xl font-semibold">
                Most Visited Products
            </h2>
            <div className="flex flex-nowrap justify-start items-center gap-3 md:gap-6 w-full md:w-auto overflow-x-auto pl-4 snap-x snap-mandatory">
                {productsToShow
                    .filter((product) => product.Price !== 0)
                    .map((product, index) => (
                        <Link href={`/buy/mostvisitedproducts/${product.EncryptedProductId}`} key={index}>
                            <MostVisitedProductCard
                                EncryptedProductId={product.EncryptedProductId}
                                title={product.ProductName}
                                price={product.Price}
                                discount={product.DiscountPricePercentage}
                                originalPrice={product.OldPrice}
                                discountName={product.DiscountPricePercentage}
                                needTag={true}
                                isGrid={true}
                                image={product.FormattedMediaFileName} dealName={""} />
                        </Link>
                    ))
                }
            </div>
        </React.Fragment>
    )
}

export default MostVisitedProducts