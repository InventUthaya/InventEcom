import { atom, selector, useRecoilState } from "recoil";
import { FilterOptionData } from "../components/web/buy/chooseProduct/Filterdata";

export const filterDataState = atom({
  key: "filterDataState",
  default: {
    FilterOptionData: [],
    specifications: [],
  },
});


export const filterCountState = atom({
  key: "filterCountState",
  default: 0,
});

export const selectedFiltersState = selector({
  key: "selectedFiltersState",
  get: ({ get }) => {
    const filterData = get(filterDataState);
    const selectedFilters: Record<string, string[]> = {};

    filterData.specifications.forEach((spec: any) => {
      const checkedOptions = spec.filterOptions
        .filter((option: any) => option.checked)
        .map((option: any) => option.title);

      if (checkedOptions.length > 0) {
        selectedFilters[spec.title] = checkedOptions;
      }
    });

    return selectedFilters;
  },
});

export const useClearFilters = () => {
  const [filterData, setFilterData] = useRecoilState(filterDataState);
  const [, setCount] = useRecoilState(filterCountState);

  return () => {
    const resetFilterData: any = {
      ...filterData,
      specifications: filterData.specifications.map((spec: any) => ({
        ...spec,
        filterOptions: spec.filterOptions.map((option: any) => ({
          ...option,
          checked: false,
        })),
      })),
    };
    setFilterData(resetFilterData);
    setCount(0);
  };
};

