import { ICartModel } from "shared/src/models/Cart.Model";
import { ISEOModel } from "shared/src/models/SEO.Model";
import Cart from "shared/src/pages/Carts";

type CartProps = {
    cartList: [],
    direction: string,
    language: "in_en" | "ae_en" | "ae_ar",
    cart: ICartModel
}

export default function index({ direction, language, cart }: CartProps) {
    return (
        <Cart direction={direction} language={language} isSSR={true} cartList={[]} cart={cart} metaTags={{} as ISEOModel}/>
    );
}

