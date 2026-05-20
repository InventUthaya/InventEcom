import { ProductCardSelection } from "../../../utils/Cards/add-ons/ProductSelection";
import { useEffect, useState } from "react";
import ProductService from "shared/src/services/Product.Service";

class Props {
  productname?: string;
  productId?: any;
  onProductSelect?: (product: { id: number; price: number, encryptedId: any } | null) => void;
}

const Addons = ({ productId, onProductSelect }: Props) => {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{ id: number; price: number, encryptedId: any } | null>(null);
  const id = productId

  const getrelatedProduct = () => {
    ProductService.getRelatedProductById(id).then((res: any) => {
      if (res.status === 200) {
        setRelatedProducts(res.data.Items);
      }
    }).catch((e: string) => {
      console.log(e);
    })
  }

  useEffect(() => {
    if (id) {
      getrelatedProduct();
    }
  }, [id]);

  const handleProductSelect = (id: number, price: number, encryptedId: any) => {
    const product = { id, price, encryptedId };
    setSelectedProduct(product);
    onProductSelect?.(product);
  };

  return (
    <>
      <div className="flex flex-col gap-5 mt-5 w-full">
        <h1 className="text-3xl font-semibold">Add-ons</h1>
        <div className="grid md:grid-cols-2 justify-center gap-8 w-full">
          {relatedProducts.filter((a: any) => a.Price != 0).map((product, i) => (
            <ProductCardSelection
              encryptedId={product.EncryptedProductId}
              id={product.Id}
              title={product.ProductName || "Unnamed Product"}
              price={product.Price}
              oldPrice={product.OldPrice}
              discount={0}
              Image={product.FormattedMediaFileName}
              key={i}
              onSelect={handleProductSelect}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Addons;
