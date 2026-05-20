import { Fragment, useState } from "react";
import { Combobox, ComboboxInput, Transition } from "@headlessui/react";
import { SearchMenuIcon } from "./assets";
import { findDocument, onKeyDownForSearch } from "../../helper/Helper";
import { useRouter } from "next/router";
import { ISeriesModel } from "shared/src/models/SeriesModel.Model";
import ProductService from "shared/src/services/Product.Service";

interface productData {
    ProductName: string,
    Id: string
}

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [globalData, setGlobalData] = useState<Array<productData>>([]);
    const router = useRouter();
    let isSearchBarEnable = router.asPath.includes("search-bar");

    const getGlobalDataSearch = (searchText: any) => {
        if (searchText != "") {
            setQuery(searchText);
            ProductService.GetAllProductBySearch(searchText).then(res => {
                if (res.status === 200) {
                    setGlobalData(res.data);
                }
            }).catch(e => {
                console.log(e);
            });
        }
        else {
            setGlobalData([]);
            setQuery('');
        }
    }

    const routerHandler = async (value: productData) => {
        if (value && value.Id) {
            router.push(`/buy/search/${value.Id}`);
        }
    }

    const FocusHandler = () => {
        isSearchBarEnable && findDocument() && document.getElementById('searchbox')?.focus();
    }
    FocusHandler();

    return (
        <Combobox onChange={(item: productData | null) => {
            if (item) {
                routerHandler(item);
            }
        }}>
            <div className="flex flex-col flex-1 max-w-[440px] 2xl:max-w-[520px] px-3 lg:px-5 py-2 lg:py-2 2xl:py-3 text-[#A9A9A9] rounded-lg bg-white border-solid border border-[#F0F0F0]">
                <div className="flex gap-3 w-full justify-center items-center">
                    <SearchMenuIcon />
                    <ComboboxInput
                        id="searchbox"
                        autoComplete="off"
                        className="grow focus:border-0 focus:outline-0 w-full text-sm lg:text-md 2xl:lg:text-base text-gray-900"
                        displayValue={(item: any) => item?.name}
                        onChange={(event: any) => getGlobalDataSearch(event.target.value)}
                        placeholder="Search by products…"
                        onKeyDown={(e: any) => onKeyDownForSearch(e, query.length)}
                    />
                </div>
                {(query !== "") &&
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options className="absolute mt-9 left-0 sm:left-[unset] lg:ml-[-20px] md:ml-[-13px] max-h-60 max-w-[520px] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {globalData.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    No Gadget Found for {query}
                                </div>
                            ) : (
                                globalData.map((item, key) => (
                                    <Combobox.Option
                                        key={key}
                                        className={({ active }) =>
                                            `relative select-none py-2 pl-2 pr-4 ${active ? "bg-[#EA002A] cursor-pointer text-white" : "cursor-default text-gray-900"
                                            }`
                                        }
                                        value={item}
                                    >
                                        {({ selected, active }) => (
                                            <div className="flex">
                                                <span
                                                    className={`block truncate ${selected ? "font-medium" : "font-normal"
                                                        }`}
                                                >
                                                    {item.ProductName}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-teal-600"
                                                            }`}
                                                    >
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                }
            </div>
        </Combobox>
    );
}