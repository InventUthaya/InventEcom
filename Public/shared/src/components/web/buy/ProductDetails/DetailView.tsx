import ProductImageSliders from "./ImageSlider";
import CheckList from "./checkList";
import Specification from "./specification";
import Addons from "./addons";
import BoxandGrades from "./boxandGrades";
import { DesktopCartView, MobileCartView } from "./SidePriceView";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IProductModel } from "shared/src/models/Product.Model";
import ProductService from "shared/src/services/Product.Service";
import Breadcrumbs from "shared/src/components/utils/BreadCrumb/Breadcrumbs";

interface DetailViewProps {
  language: any;
}

export const DetailView: React.FC<DetailViewProps> = ({ language }) => {
  const [product, setProduct] = useState<IProductModel | null>(null);

  // Lifted color state to parent for sync between cart view and image slider
  const [selectedColorName, setSelectedColorName] = useState<string>("");

  const [selectedVariantImage, setSelectedVariantImage] = useState<any>(null);
  const [selectedAddon, setSelectedAddon] = useState<{ id: number; price: number, encryptedId: any } | null>(null);

  const router = useRouter();
  const { productId, productdetailId } = router.query;

  const getProductById = () => {
    const isPreviewFromAdmin = window.location.pathname.includes("previewFromAdmin");

    const serviceCall = isPreviewFromAdmin
      ? ProductService.GetProductDetailbyIdForAdmin(productdetailId)
      : ProductService.GetProductDetailbyId(productdetailId);

    serviceCall
      .then((res: any) => {
        if (res.status === 200) {
          setProduct(res.data.Items[0]);
        }
      })
      .catch((e: string) => {
        console.log(e);
      });
  };

  const handleAddonSelect = (addon: { id: number; price: number; encryptedId: any } | null) => {
    setSelectedAddon(addon);
  };

  useEffect(() => {
    if (productdetailId) {
      getProductById();
    }
  }, [productdetailId]);

  useEffect(() => {
    if (product?.ColorImages && selectedColorName === "") {
      const uniqueColors = Array.from(
        new Set(product.ColorImages.map((img: any) => img.ColorName))
      );
      if (uniqueColors.length > 0) {
        setSelectedColorName(uniqueColors[0]);
      }
    }
  }, [product, selectedColorName]);

  return (
    <><Breadcrumbs
      category={"Product"}
      subcategory={product?.ProductName} />
      <div className="md:flex md:gap-5">
        <div className="flex flex-col gap-7 lg:w-[60%]">
          <ProductImageSliders
            selectedColor={selectedColorName} // Controlled from cart view
            product={product} />

          <div className="block md:hidden w-full">
            <MobileCartView
              selectedColor={{ Color: selectedColorName, Id: "" }}
              selectedProduct={selectedAddon}
              language={language}
              onColorSelect={setSelectedColorName} // Sync color to parent
              setSelectedVariantImage={setSelectedVariantImage} />
          </div>

          <CheckList />
          <BoxandGrades />
        </div>

        <div className="hidden md:block w-[65%] lg:w-[40%]">
          <DesktopCartView
            selectedColor={{ Color: selectedColorName, Id: "" }}
            selectedProduct={selectedAddon}
            language={language}
            onColorSelect={setSelectedColorName} // Sync color to parent
            setSelectedVariantImage={setSelectedVariantImage} />
        </div>
      </div></>
  );
};

export default DetailView;