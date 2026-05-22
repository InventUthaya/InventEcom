import { useEffect, useState } from "react";
import { BackIcon, DropIcon, SelectionIcon } from "./assets";
import { useRecoilState } from "recoil";
import { filterCountState, filterDataState, useClearFilters } from "../../../../recoil/buyFilterState";
import { Opacity } from "../../../animation/opacity";
import ProductService from "shared/src/services/Product.Service";
import { useRouter } from "next/router";

interface Specification {
  title: string;
  filterOptions: { id: string; title: string; checked: boolean }[];
}

function FilterOption() {
  const [filterData, setFilterData] = useRecoilState(filterDataState);
  const [count, setCount] = useRecoilState(filterCountState);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { productId } = router.query as any;

  const getSpecification = async () => {
    try {
      const res = await ProductService.getSpecificaionDetails();
      if (res.status === 200) {
        const specification = res.data.Items.map((specifi: any) => {
          const specName = specifi.SpecificationAttributeName;
          if (specName) {
            const parts = specName.replace(/[{}]/g, "").split(":");
            const title = parts[0].trim();
            const options = parts[1]
              .split(",")
              .map((option: string) => option.trim());
            return {
              title,
              filterOptions: options.map((option: any) => ({
                id: option,
                title: option,
                checked: false,
              })),
            };
          }
          return { title: "Unknown", filterOptions: [] };
        });
        setFilterData((prevData: any) => ({
          ...prevData,
          specifications: specification,
        }));
        if (productId) {
          const { brandId, qualityId } = extractCategoryAndQualityIds(productId);
          if (brandId) {
            preCheckFilter("Brand", brandId);
          }
          if (qualityId) {
            preCheckFilter("Condition", qualityId);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSpecification();
  }, []);

  const extractCategoryAndQualityIds = (productId: string) => {
    const decodedProductId = decodeURIComponent(productId);
    const categoryMatch = decodedProductId.match(/(\d+)_Category/);
    const qualityMatch = decodedProductId.match(/-([a-zA-Z\s]+)_Quality/);
    const brandMatch = decodedProductId.match(/(?:-|^)([\w\s]+)_Brand/);

    const categoryId = categoryMatch ? categoryMatch[1] : null;
    const qualityId = qualityMatch ? qualityMatch[1].trim() : null;
    const brandId = brandMatch ? brandMatch[1].trim() : null;

    return { categoryId, qualityId, brandId };
  };

  const preCheckFilter = (title: string, value: string) => {
    setFilterData((prevFilterData: any) => {
      const updatedSpecifications = prevFilterData.specifications.map((spec: any) => {
        if (spec.title === title) {
          const updatedFilterOptions = spec.filterOptions.map((option: any) => {
            if (option.id === value) {
              return { ...option, checked: true };
            }
            return option;
          });
          return { ...spec, filterOptions: updatedFilterOptions };
        }
        return spec;
      });

      return { ...prevFilterData, specifications: updatedSpecifications };
    });
    const isAlreadyChecked = filterData.specifications
      .flatMap((spec: any) => spec.filterOptions)
      .some((option: any) => option.id === value && option.checked);
    if (!isAlreadyChecked) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const ChangeStateHandler = (id: string, name: string) => {
    setFilterData((prevFilterData: any) => {
      const updatedSpecifications = prevFilterData.specifications.map((spec: any) => {
        if (spec.title === name) {
          const updatedFilterOptions = spec.filterOptions.map((option: any) => {
            if (option.id === id) {
              return { ...option, checked: !option.checked };
            }
            return option;
          });
          return { ...spec, filterOptions: updatedFilterOptions };
        }
        return spec;
      });
      return { ...prevFilterData, specifications: updatedSpecifications };
    });
    setCount(() => {
      const checkedCount = filterData.specifications
        .flatMap((spec: any) => spec.filterOptions)
        .filter((option: any) => option.checked).length;
      return checkedCount;
    });
  };

  useEffect(() => {
    const checkedCount = filterData.specifications
      .flatMap((spec: any) => spec.filterOptions)
      .filter((option: any) => option.checked).length;
    setCount(checkedCount);
  }, [filterData]);

  const clearFilters = useClearFilters();

  // Check if the URL ends with "_Brand" or we are on a brand-specific page
  const hideBrandFilter = router.asPath.endsWith("_Brand") || router.asPath.includes("/brand/") ||
    router.asPath.includes("/buy/brand") || router.query.productId === "brand";

  // Filter specifications to exclude "Brand" if hideBrandFilter is true
  const filteredSpecifications = hideBrandFilter
    ? filterData.specifications.filter((spec: Specification) => spec.title !== "Brand")
    : filterData.specifications;



  return (
    <div className="bg-white sticky top-0">
      <div className="hidden lg:flex justify-between p-4 sticky top-0 bg-white z-50">
        <h2 className="font-semibold uppercase tracking-widest">
          Filters {`(${count})`}
        </h2>
        {count !== 0 && (
          <div
            className="uppercase cursor-pointer text-sm font-semibold tracking-wide flex justify-start items-center gap-1 text-[#EA002A]"
            onClick={clearFilters}
          >
            <BackIcon />
            CLEAR
          </div>
        )}
      </div>
      <h2 className="font-semibold uppercase tracking-widest block lg:hidden border-b pl-4 py-5 border-[#E6E6E6] sticky top-0 bg-white z-[50]">
        Filters
      </h2>

      {filteredSpecifications.map((spec: Specification, i: number) => (
        <FilterDropDown
          title={spec.title}
          titleList={spec.filterOptions}
          key={spec.title}
          ChangeStateHandler={ChangeStateHandler}
          border={i !== filteredSpecifications.length - 1}
        />
      ))}
    </div>
  );
}

export default FilterOption;

const FilterDropDown = (props: any) => {
  const [status, setStatus] = useState(false);

  const displayTitle =
    props.title === "Ram"
      ? "D External"
      : props.title === "Storage"
        ? "B Width"
        : props.title === "Color"
          ? "d Internal"
          : props.title;

  return (
    <div className={`${props.border ? "border-b border-[#D9D9D9]" : ""}`}>
      <div className="p-4">
        {/* Title */}
        <div
          className="font-semibold text-base flex justify-between items-center cursor-pointer capitalize"
          onClick={() => setStatus((e) => !e)}
        >
          {displayTitle}
          <div className={`rotate-${status ? 0 : 180} transition-transform`}>
            <DropIcon />
          </div>
        </div>

        {/* Dropdown */}
        <div
          className={`flex flex-wrap lg:flex-nowrap lg:flex-col gap-3 transition-all duration-500 ${status ? "mt-3" : "max-h-0"
            } overflow-hidden`}
        >
          {props.titleList.map((grade: any) => (
            <div
              key={`${props.title}-${grade.id}`}
              className={`border ${grade.checked ? "border-[#EA002A]" : "border-[#939393]"
                } 
              text-xs p-2 rounded-md w-fit sm:text-sm lg:text-base lg:border-0 lg:p-0 
              flex items-center gap-2 lg:gap-4 capitalize font-semibold cursor-pointer`}
              onClick={() => props.ChangeStateHandler(grade.id, props.title)}
            >
              <div
                className={`w-[16px] h-[16px] border ${grade.checked ? "border-[#EA002A]" : "border-[#939393]"
                  } 
                lg:w-[20px] lg:h-[20px] flex justify-center items-center rounded-[4px]`}
              >
                {grade.checked && (
                  <Opacity>
                    <SelectionIcon />
                  </Opacity>
                )}
              </div>

              <label
                className={`cursor-pointer ${grade.checked ? "text-[#EA002A]" : "text-[#050505]"
                  }`}
              >
                {grade.title}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
