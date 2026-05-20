import Menu from "shared/src/components/utils/Menus/TopMenu";
import { useState, useEffect } from "react";
import Container from "shared/src/components/animation/Container";
import { SSRDetection, Direction, getUserLanguage } from "shared/src/components/helper/Helper";
import useScrollToTop from "shared/src/components/utils/scroll/ScrollToTop";
import BuyCheckout from "shared/src/components/web/buy/checkout/checkout";
import { ILocateOurStoresModel } from "shared/src/models/LocateOurStores";

type ProductDetailProps = {
  direction: string,
  language: any,
  // metaTags: ISEOModel,
  isSSR?: boolean,
}

const fetchData = async (): Promise<ProductDetailProps> => {
  let direction = Direction();
  let language = getUserLanguage();

  return { direction, language}
}


function BuyCheckoutComponent({ direction, language, isSSR }: ProductDetailProps) {
  const [LocateOurStoresList, setLocateOurStoresList] = useState<ProductDetailProps>({ direction, language });
  
  useEffect(() => {
    if (!isSSR) {
      fetchData().then(res => {
        setLocateOurStoresList({
          direction: res.direction,
          language: res.language,
        });
      });
    }
  }, []);

  useScrollToTop();
  return (
    <>
      <Menu needSearch={false} zIndex={"z-0"} />
      <div className="lg:px-16 px-5">
        <div className="max-w-[1300px] mx-auto pb-10">
          <Container>
            <BuyCheckout />
          </Container>
        </div>
      </div>
    </>
  );
}

export default BuyCheckoutComponent;
