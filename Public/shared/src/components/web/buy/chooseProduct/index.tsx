import { useEffect, useState } from "react";
import FilterOption from "./FilterOption";
import { FilterCloseIcon, FilterIcon } from "./assets";
import { useRecoilState, useRecoilValue } from "recoil";
import { filterCountState, selectedFiltersState, useClearFilters } from "../../../../recoil/buyFilterState";
import { ProductCard } from "../../../utils/Cards/productCard/productCard";
import { containerZindex } from "../../../../recoil/styleState";
import { IProductModel } from "shared/src/models/Product.Model";
import Router, { useRouter } from "next/router";
import ProductService from "shared/src/services/Product.Service";
import { IDealsProductModel } from "shared/src/models/DealsProduct.Model";
import Breadcrumbs from "shared/src/components/utils/BreadCrumb/Breadcrumbs";

function ChooseProduct() {
  const filterData = useRecoilValue(selectedFiltersState);
  const [count] = useRecoilState(filterCountState);
  const [product, setProduct] = useState<Array<IProductModel>>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { query } = router;

  let selectedSubCategory = "";
  let selectedItemCategory = "";

  const asPath = router.asPath;

  if (asPath.includes("/buy/brand")) {
    const parts = asPath.split("?");

    selectedSubCategory = parts[0]?.split("/").pop() || "";
    selectedSubCategory = decodeURIComponent(selectedSubCategory);

    selectedItemCategory = parts[1] ? decodeURIComponent(parts[1]) : "";
  } 
  else {
    const parts = asPath.split("?").slice(1);

    selectedItemCategory = parts[0]?.split("/")[0] || "";
    selectedItemCategory = decodeURIComponent(selectedItemCategory);

    selectedSubCategory = parts[1] || "";
    selectedSubCategory = decodeURIComponent(selectedSubCategory);
  }


  const getFilteredProducts = (filterParams: Record<string, string[]>) => {
    ProductService.getCategoryBrandByFilter(filterParams)
      .then((res: any) => {
        if (res.status === 200) {
          setLoading(false);
          setProduct(res.data.Items);
        }
      })
      .catch((e: string) => {
        console.log(e);
        setLoading(false);
      });
  };


  const getAllProducts = () => {
    ProductService.getAllProductForFilter()
      .then((res: any) => {
        if (res.status === 200) {
          setLoading(false);
          setProduct(res.data.Items);
        }
      })
      .catch((e: string) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    const filterObject: Record<string, string[]> = { ...filterData };

    if (count > 0) {
      Object.entries(filterData).forEach(([key, values]) => {
        if (Array.isArray(values)) {
          const lowerKey = key.toLowerCase();
          if (lowerKey === 'display size') {
            filterObject['Display'] = values;
            delete filterObject[key];
          } else if (lowerKey === 'storage capacity') {
            filterObject['Storage'] = values;
            delete filterObject[key];
          } else {
            filterObject[key] = values;
          }
        }
      });
    }

    if (Object.keys(query).length > 0) {
      const { productId, ...filterParams } = query;

      if (productId) {
        switch (productId as string) {
          case 'brand':
            const brands = Object.keys(filterParams)
              .filter(key => filterParams[key] === '')
              .map(brand => brand.trim());

            if (brands.length > 0) {
              filterObject['Brand'] = brands;
            }
            break;

          case 'quality':
            const qualities = Object.keys(filterParams)
              .filter(key => filterParams[key] === '')
              .map(quality => quality.trim());

            if (qualities.length > 0) {
              filterObject['StorageSize'] = qualities;
            }
            break;

          case 'category':
            const categories = Object.keys(filterParams)
              .filter(key => filterParams[key] === '')
              .map(category => category.trim());

            if (categories.length > 0) {
              filterObject['Category'] = categories;
            }
            break;

          case 'itemCategory':
            const itemCategories = Object.keys(filterParams)
              .filter(key => filterParams[key] === '')
              .map(category => {
                return category.split('/')[0].trim();
              });

            if (itemCategories.length > 0) {
              filterObject['ItemCategory'] = itemCategories;
            }
            break;
          case 'price':
            const prices = Object.keys(filterParams)
              .filter(key => filterParams[key] === '')
              .map(price => price.replace(' AED', '').replace(/,/g, '').trim());

            if (prices.length > 0) {
              filterObject['Price'] = prices;
            }
            break;

          default:
            filterObject['Category'] = [productId as string];
        }
      }

      if (query.category && typeof query.category === 'string') {
        filterObject['Category'] = [query.category];
      }

      if (query.brand && typeof query.brand === 'string') {
        const brands = query.brand.split(',').map(b => b.trim());
        filterObject['Brand'] = brands;
      }

      if (query.quality && typeof query.quality === 'string') {
        filterObject['Condition'] = [query.quality];
      }

      if (query.price && typeof query.price === 'string') {
        const priceValue = query.price.replace(' AED', '').replace(/,/g, '').trim();
        filterObject['Price'] = [priceValue];
      }
    }

    console.log("Filter Object for API:", filterObject);

    if (Object.keys(filterObject).length > 0) {
      getFilteredProducts(filterObject);
    } else {
      getAllProducts();
    }
  }, [query, filterData, count]);

  const createFilterUrl = (filterType: string, value: string, additionalParams = {}) => {
    const params: Record<string, string> = {
      productId: filterType,
      [value]: ''
    };

    Object.entries(additionalParams).forEach(([key, val]) => {
      if (val) {
        params[key] = val as string;
      }
    });

    const queryString = new URLSearchParams(params).toString();
    return `/buy?${queryString}`;
  };

  return (
    <>
      <Breadcrumbs
        category={selectedSubCategory}
        subcategory={selectedItemCategory}
      />
      <div className=" flex flex-col gap-8">
        <div className="flex justify-between gap-5 relative">
          <div className="hidden lg:block lg:w-[25%]">
            <FilterOption />
          </div>
          <div className="block fixed z-40 lg:hidden">
            <MobileFilter />
          </div>
          <div className="w-full lg:w-[75%]">
            <div className="hidden lg:block h-full">
              <ProductList data={product} query={query} createFilterUrl={createFilterUrl} />
            </div>
            <div className="block lg:hidden h-full">
              <ProductList grid={true} data={product} query={query} createFilterUrl={createFilterUrl} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChooseProduct;

const ProductList = (props: any) => {
  const [product, setProduct] = useState<Array<IDealsProductModel>>([]);
  const { query } = useRouter();
  const getProduct = () => {
    ProductService.getDiscountAppliedProducts()
      .then(res => {
        if (res.status === 200) {
          setProduct(res.data.Items);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleNavigate = (ProductId: any) => {
    Router.push(`/buy/products/${ProductId}`);
  }

  const data = props.data || [];

  // Extract current filter type from query
  const filterType = query.productId as string || '';
  const filterValues = Object.keys(query)
    .filter(key => key !== 'productId' && query[key] === '')
    .map(key => key);

  return (
    <div
      className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      gap-4
      items-stretch
    "
    >

      {data.length > 0 ? (
        data
          ?.filter((a: any) => a.Price != 0)
          .map((a: any, i: number) => {

            return (
              <a

                onClick={() => handleNavigate(a.ProductId)}
                key={i}
              >
                <ProductCard
                  EncryptedProductId={a.EncryptedProductId}
                  key={a.ProductId + i}
                  title={a.ProductName}
                  price={a.Price}
                  discount={a.DiscountAmount}
                  needTag={true}
                  isGrid={props.grid}
                  OrginalPrice={a.OldPrice}
                  TotalPrice={a.TotalPrice}
                  DiscountName={a.DiscountPricePercentage}
                  Image={a.ImagePath}
                  FullDescription={a.FullDescription}
                  DealName={""}
                  PartnerCompanyName={a.PartnerCompanyName}
                />
              </a>
            );
          })
      ) : (
        <div className="text-sm md:text-lg text-[#939393]">
          No matching results for the applied filter
        </div>
      )}

      {/* Display current active filters */}
      {/* {filterValues.length > 0 && (
        <div className="w-full mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              Type: {filterType}
            </span>
            {filterValues.map((value, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                {value}
              </span>
            ))}
          </div>
        </div>
      )} */}
    </div>

  );
};



// MobileFilter component remains mostly the same, but with URL updates
const MobileFilter = () => {
  const count = useRecoilValue(filterCountState);
  const clearFilters = useClearFilters();
  const [openFilter, setOpenFilter] = useState(false);
  const [_, setZindex] = useRecoilState(containerZindex);
  const router = useRouter();

  const FilterHandler = () => {
    if (openFilter) {
      setZindex("z-10");
    } else {
      setZindex("z-50");
    }
    setOpenFilter((e) => !e);
  };

  const applyFiltersAndClose = () => {
    // You would need to convert Recoil state to URL params here
    // This is a placeholder - implement based on your filter structure
    FilterHandler();
  };

  const clearAllFilters = () => {
    clearFilters();
    // Clear URL filters too
    router.push('/buy');
  };

  return (
    <div className="z-[60]">
      <div className="fixed z-[40] w-full h-32 bottom-0 left-0 flex justify-center lg:hidden">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-neutral-500"></div>
        <div
          className="bg-white h-fit px-4 py-2 rounded-md z-10 mt-2 flex justify-center items-center gap-2"
          onClick={FilterHandler}
        >
          <FilterIcon />
          Filters
          {count != 0 && (
            <div className={`${count != 0 ? "text-[#EA002A]" : "text-[#050505]"}`}>
              ({count})
            </div>
          )}
        </div>
      </div>
      <div className={`fixed ${openFilter ? "h-dvh" : "h-0"} w-full transition-all duration-200 bottom-0 left-0 bg-[#05050533] backdrop-blur-md overflow-hidden z-50`}>
        <div className="h-fit absolute bottom-0 lg:relative w-full">
          <div className="max-h-[400px] lg:h-fit lg:max-h-fit overflow-auto rounded-t-2xl">
            <FilterOption />
          </div>
          <div className="lg:hidden">
            <div
              className="w-10 h-10 bg-white flex justify-center items-center rounded-full absolute -top-16 left-1/2 -translate-x-1/2"
              onClick={FilterHandler}
            >
              <div>
                <FilterCloseIcon color={"#050505"} />
              </div>
            </div>
            <div className="w-full bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.16)] flex justify-between gap-3 p-4">
              <button
                onClick={clearAllFilters}
                className="border border-[#050505] w-full py-2 rounded-md capitalize font-semibold text-[#050505] bg-white"
              >
                clear filters
              </button>
              <button
                className="border border-[#050505] w-full py-2 rounded-md capitalize font-semibold text-white bg-[#050505]"
                onClick={applyFiltersAndClose}
              >
                Apply Filters {`(${count})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};