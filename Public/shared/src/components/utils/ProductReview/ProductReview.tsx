import { useEffect, useRef, useState } from "react";
import ProductReviewServices from "shared/src/services/ProductReviewService";
import ProductReviewCard from "shared/src/components/utils/ProductReview/ProductReviewCard";
interface ProductReviewProps {
    productId: any;
}

const ProductReview = ({ productId }: ProductReviewProps) => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        if (!productId) return;

        ProductReviewServices.GetProductReviews(productId)
            .then((res: any) => {
                if (res?.status === 200) {
                    setReviews(res?.data || []);
                    setReviews(res.data || []);
                }
            })
            .catch(console.error);
    }, [productId]);

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
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!reviews.length) return null;

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

            <div className="flex flex-col w-full mt-14" ref={sectionRef}>
                <div className="flex md:flex-row flex-col-reverse gap-[8px] md:gap-0 justify-between items-center mb-[24px] md:mb-[40px]">
                    <h2 className="font-medium text-[22px] leading-[32px] md:text-[36px] md:leading-[66px]">
                        What our customers say
                    </h2>
                </div>
                <div className="testimonial-content mb-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {reviews.map((r, index) => (
                            <div
                                key={index}
                                className="flex justify-center"  
                            >
                                <div className="w-full max-w-sm">
                                    <ProductReviewCard
                                        userName={r.username}
                                        rating={r.Rating}
                                        title={r.ReviewText}
                                        description={r.ReviewDescription}
                                        productImage={r.ImageBase64}
                                        date={r.ReviewDate}
                                        location={r.location} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReview;
