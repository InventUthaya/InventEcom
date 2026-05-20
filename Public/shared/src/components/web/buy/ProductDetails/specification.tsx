import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IProductModel } from "shared/src/models/Product.Model";
import ProductService from "shared/src/services/Product.Service";

interface SpecificationItem {
  title: string;
  value: string;
}

interface SpecificationCategory {
  title: string;
  items: SpecificationItem[];
}
function Specification() {

  const [product, setProduct] = useState<IProductModel | null>(null);
  const [specs, setSpecs] = useState<SpecificationCategory[]>([]);
  const router = useRouter();
  const { productId, productdetailId } = router.query;

  const getProductById = () => {
    ProductService.GetProductDetailbyId(productdetailId).then((res: any) => {
      if (res.status === 200) {
        setProduct(res.data.Items[0]);
        parseSpecifications(res.data.Items[0]?.SpecificationAttributeOptionName);
      }
    }).catch((e: string) => {
      console.log(e);
    })
  }

  const parseSpecifications = (specStr: string) => {
    const specsArray = specStr
      .split("}, {") 
      .map(item => {
        const spec = item.replace(/{|}/g, ""); 
        const [title, value] = spec.split(": "); 
        return { title: title.trim(), value: value.trim() };
      });

    const groupedSpecs = groupSpecifications(specsArray);

    setSpecs(groupedSpecs); 
  };

  const groupSpecifications = (specsArray: SpecificationItem[]): SpecificationCategory[] => {
    const categories: SpecificationCategory[] = [
      { title: "General", items: [] },
    ];

    specsArray.forEach(spec => {

        categories[0].items.push(spec); 

    });

    return categories;
  };

  useEffect(() => {
    if (productdetailId) {
      getProductById();
    }
  }, [productdetailId]);

  return (
    <>
      <div className="flex flex-col pt-5 mt-5 w-full bg-white rounded-2xl border border-solid border-[#EFEFEF] border-opacity-50">
        <div className="flex flex-col px-3 md:px-9 gap-5">
          <div className="mt-1.5 text-3xl font-semibold text-zinc-950 max-md:max-w-full">
            Specifications
          </div>
          {specs.map((e, i) => (
            <div key={i}>
              <div className="mt-1.5 text-lg font-medium text-zinc-950 max-md:max-w-full">
                {e.title}
              </div>
              <table className="w-full">
                <tbody>
                  {e.items.map((a, i) => (
                    <tr key={i}>
                      <td className="text-[#939393] w-[40%] pt-3 pr-1 text-sm md:text-base align-top">
                        {a.title}
                      </td>
                      <td className="text-[#050505] pt-3 text-sm md:text-base align-top">
                        {a.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Specification;
