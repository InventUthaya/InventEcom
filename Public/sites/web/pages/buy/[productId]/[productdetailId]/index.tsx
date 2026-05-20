import { GetServerSideProps } from "next";
import { Direction, SSRDetection, getUserLanguage } from "shared/src/components/helper/Helper";
import ProductDetails from "shared/src/pages/buy/chooseProduct/ProductDetails";

type ProductDetailProps = {
    direction: string,
    language: "in_en" | "ae_en" | "ae_ar",
}
const fetchData = async (context: any): Promise<ProductDetailProps> => {
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();
  return { direction, language }
}
export default function index({ direction, language }: ProductDetailProps) {

    return (
        <ProductDetails direction={direction} language={language} isSSR={true} />
    );
}

export const getServerSideProps: GetServerSideProps<ProductDetailProps> = async (context) => {
    const { direction, language } = await fetchData(context);
    return { props: { direction, language } }
}