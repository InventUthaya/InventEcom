import { SetStateAction, useState, useRef, useEffect, useLayoutEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { findDocument, findWindow, getDatalocalization, getUserLanguage, getUserLocation, getUserLocationForParam, isIn } from "../../helper/Helper";
import { HelperConstant } from "../../helper/HelperConstant";
import { LocationIcon, SearchMenuIcon } from "../Menus/assets";
import Image from "next/image";
import { useRouter } from "next/router";
import { unique } from "underscore";
import { HeaderZIndex } from "shared/src/recoil/styleState";
import Language from "shared/src/Languages/MenusLanguage.json"
import { IDOFYGeoModel } from "shared/src/models/DofyGeo.Model";
import { UserLocation } from "shared/src/recoil/sell/UserLocation";
import DofyGeoService from "shared/src/services/DofyGeo.Service";

type Props = {
    isValid: any,
    LocationEnable: any
    setLocationEnable: (value: any) => void,
    PickupEnable?: any,
    setPickupEnable?: any,
    show?: boolean
}

export const LocationModal = ({ isValid, LocationEnable, setLocationEnable, PickupEnable, setPickupEnable, show }: Props) => {
    const [state, setState] = useState<Array<any>>([]);
    const [filterLocation, setFilterLocationList] = useState<Array<any>>([]);
    const [groupedLocation, setGroupedLocationList] = useState<Array<any>>([]);
    const [selectedCity, setSelectedCity] = useState(0);
    const [locationlist, setLocationList] = useState<Array<any>>([]);
    const [selectedCityId, setSelectedCityId] = useState(0);
    const [District, setDistrict] = useState<Array<any>>([]);
    const [locationErr, setlocationErr] = useState("");
    const isLocation = useRecoilValue(UserLocation);
    const [viewportWidth, setViewportWidth] = useState(0);
    const [headerZIndex, setHeaderZIndex] = useRecoilState(HeaderZIndex);
    let language = getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
    const selectedStateId = findWindow() && localStorage.getItem("stateId") as any;
    const selectedUserLocation: IDOFYGeoModel = findWindow() && JSON.parse(localStorage.getItem("userLocationData") as any) as any;
    const stateName = findWindow() && JSON.parse(localStorage.getItem("StateName") as any) as any;

    const selectLocationHandler = (value: any) => {
        setlocationErr(value);

        if (value?.Id > 0) {
            localStorage.setItem("userLocation", JSON.stringify(value.Name?.toLowerCase().replace(' ', '-')));
            localStorage.setItem("userLocationData", JSON.stringify(value));
            localStorage.setItem("userLocation_ar", JSON.stringify(value.SecondLanguage));
            localStorage.setItem("userLocationId", JSON.stringify(value.Id));
            setLocationEnable(false);
            isValid(true)
        }
    };

    const selectedCityHandler = (value: any, id: any) => {
        setSelectedCity(value);
        localStorage.setItem("stateId", JSON.stringify(value));
        GetAllDofyGeoBysearch(value, "", header.LanguageCode, header.CountryCode, true);
    }

    const capitalizeFirstLetter = (string: string) => {
        return string.replace(/\b\w/g, char => char.toUpperCase());
    };

    const initialSelectedCityHandler = (res: Array<any>) => {
        const lowercaseRes = res.map(location => ({
            ...location,
            Name: capitalizeFirstLetter(location.Name.toLowerCase()),
        }));
        setGroupedLocationList(lowercaseRes);
        var uniqueOptions = unique(lowercaseRes, "Name");
        setFilterLocationList(uniqueOptions);
    }

    const getStateList = () => {
    DofyGeoService.GetStateList(HelperConstant.serviceTypeId.SELL, header.LanguageCode, header.CountryCode).then(res => {
        if (res.status === 200) {
            setState(res.data);

            // Set default state (Dubai) if no state is selected
            let initialStateId = res.data[0].EncryptedIdentifier;
            let initialStateName = res.data[0].Name;

            if (selectedStateId && selectedUserLocation?.Parent1) {
                initialStateId = selectedUserLocation?.EncryptedParent === parseInt(selectedStateId)
                    ? selectedStateId
                    : selectedUserLocation?.EncryptedParent;
                initialStateName = stateName || res.data[0].Name;
            }

            setSelectedCity(res.data[0].Id);
            setSelectedCityId(initialStateId);
            localStorage.setItem("stateId", JSON.stringify(initialStateId));
            StateName(initialStateName);
        }
    }).catch(e => {
        console.log(e);
    });
};
    const GetAllDofyGeoBysearch = (stateId: any, searchText: any, LanguageCode: any, CountryCode: any, initial: boolean) => {
        if (searchText != "" || initial) {
            DofyGeoService.GetDofyGeoListBysearch(stateId, searchText ? searchText : null, LanguageCode, CountryCode).then(res => {
                if (res.status === 200) {
                    console.log("REDSD", res.data)
                    setLocationList(res.data);
                    setDistrict(res.data);
                    initialSelectedCityHandler(res.data);
                }
            }).catch(e => {
                console.log(e);
            });
        }
        else {
            setLocationList([]);
            initialSelectedCityHandler([]);
        }
    };
    const StateName = (stateName: string) => {
        if (stateName) {
            localStorage.setItem("StateName", JSON.stringify(stateName));
        }
    }

    useEffect(() => {
        getStateList();
    }, []);

   useLayoutEffect(() => {
    if (selectedStateId && selectedUserLocation?.Parent1) {
        setSelectedCity(parseInt(selectedUserLocation?.Parent1));
    }
}, [selectedStateId, selectedUserLocation]);


    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isDesktop = viewportWidth > 768 ? true : false;

    useEffect(() => {
        if (LocationEnable) {
            document.body.style.overflow = "hidden";
            setHeaderZIndex({
                Z_Index: "z-0"
            })
        } else {
            document.body.style.overflow = "auto";
            setHeaderZIndex({
                Z_Index: "z-0"
            })
        }
        return () => {
            document.body.style.overflow = "auto";
            setHeaderZIndex({
                Z_Index: "z-[51]"
            })
        };
    }, [LocationEnable]);

    if (!LocationEnable) return null;

    useEffect(() => {
    if (selectedCityId) {
        GetAllDofyGeoBysearch(selectedCityId, "", header.LanguageCode, header.CountryCode, true);
    }
}, [selectedCityId, header.LanguageCode, header.CountryCode]);

    return (
        <>
            {LocationEnable && (
                <SelectLocation selectedCityId={selectedCityId}
                    StateName={StateName}
                    isDesktop={isDesktop}
                    setLocationEnable={setLocationEnable}
                    stateList={state}
                    selectedCityHandler={(value, id) => selectedCityHandler(value, id)}
                    setSelectedCityId={setSelectedCityId}
                    selectedCity={selectedCity} filterLocation={filterLocation} selectLocationHandler={selectLocationHandler} PickupEnable={PickupEnable} setPickupEnable={setPickupEnable} />
            )}
        </>
    );
};

type LocationCardProps = {
    setLocationEnable: (value: any) => void,
    stateList: Array<any>,
    selectedCityHandler: (val1: any, val2: any) => void
    selectedCityId: any,
    setSelectedCityId: SetStateAction<any>
    selectedCity: any
    filterLocation: Array<any>
    selectLocationHandler: (value: any) => void,
    PickupEnable: any,
    setPickupEnable: any,
    isDesktop: boolean,
    StateName: any;
};

const SelectLocation = ({ setLocationEnable, stateList, StateName, selectedCityHandler, setSelectedCityId, selectedCity, filterLocation, selectLocationHandler, PickupEnable, setPickupEnable, isDesktop, selectedCityId }: LocationCardProps) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const activeSuggestionRef = useRef<HTMLLIElement | null>(null);
    const [__, setUserLocation] = useRecoilState(UserLocation);

    const noDataFound = [{
        Name: "Sorry - Currently we are not servicing your area"
    }];

    let dataLocalization = Language[getDatalocalization(getUserLanguage())];
    const router = useRouter();

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value) {
            let filtered: any;
            filtered = filterLocation?.filter((suggestion: any) => suggestion.Name.toLowerCase().includes(value.toLowerCase()) || suggestion.Code.includes(value));
            setFilteredSuggestions(filtered.length > 0 ? filtered : noDataFound);
            setActiveSuggestionIndex(0);
            setShowSuggestions(true);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClicked = (suggestion: any, Id: any) => {
        if (suggestion.Name === "Sorry - Currently we are not servicing your area") {
            setInputValue('');
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setInputValue(suggestion.Name);
        let filteredSuggestionIndex = filteredSuggestions.findIndex(x => x.Id === Id);
        selectLocationHandler(filteredSuggestions[filteredSuggestionIndex])
        setUserLocation({
            UserLocation: suggestion.Name,
            UserLocationId: suggestion.Id
        });
        localStorage.setItem("CityId", JSON.stringify(Id));
        localStorage.setItem("CityName", JSON.stringify(suggestion.Name));
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setLocationEnable(false);
    };

    const handleFocus = () => {
        setFilteredSuggestions(filterLocation);
        setShowSuggestions(true);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            if (activeSuggestionIndex < filteredSuggestions.length - 1) {
                setActiveSuggestionIndex(activeSuggestionIndex + 1);
            }
        } else if (event.key === 'ArrowUp') {
            if (activeSuggestionIndex > 0) {
                setActiveSuggestionIndex(activeSuggestionIndex - 1);
            }
        } else if (event.key === 'Enter') {
            if (filteredSuggestions.length > 0) {
                const selectedSuggestion = filteredSuggestions[activeSuggestionIndex];
                if (selectedSuggestion.Name === "Sorry - Currently we are not servicing your area") {
                    setInputValue('');
                } else {
                    setInputValue(filteredSuggestions[activeSuggestionIndex].Name);
                    setFilteredSuggestions([]);
                    setShowSuggestions(false);
                    selectLocationHandler(filteredSuggestions[activeSuggestionIndex]);
                    setUserLocation({
                        UserLocation: filteredSuggestions[activeSuggestionIndex].Name,
                        UserLocationId: filteredSuggestions[activeSuggestionIndex].Id
                    })
                }

            }
        } else if (event.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleRequestPickupClick = () => {
        router.push(`/request-delivery`);
    }

    useEffect(() => {
        findDocument() && document.getElementById('locationinput')?.focus()
        if (activeSuggestionRef.current) {
            activeSuggestionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [activeSuggestionIndex]);

    return (
        <>
            {isDesktop ?
                <div onClick={() => setLocationEnable(false)} id='location' className={`overflow-y-auto lg:overflow-y-hidden w-full h-dvh fixed top-0 left-0 bg-[#05050580] pt-10 px-5 lg:px-16 backdrop-blur-sm z-[1000] opacity-0 animate-[opacity1_0.2s_forwards_ease-in-out] `} >
                    <div className="max-w-max h-full mt-[1.75rem] lg:ml-10 opacity-0 relative -top-3 animate-[opacity_0.5s_forwards_ease-in-out]">
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white p-5 rounded-2xl flex flex-col gap-3 justify-between"
                        >
                            <div className="flex gap-2 items-center">
                                <LocationIcon />
                                <div className="text-sm lg:text-base font-medium">
                                    {dataLocalization.Select_your_location}
                                </div>
                            </div>
                            <div className="px-2 py-1 my-1 flex-wrap flex gap-3 overflow-y-auto max-h-96">
                                {stateList.map((val, i) => (
                                    <div key={i} className={`border flex flex-col gap-1 p-2 ] rounded-lg w-[40%] sm:max-w-[130px] lg:max-w-[130px] cursor-pointer ${val.EncryptedIdentifier === (selectedCityId ? selectedCityId : selectedCity) ? "border-[#EA002A]" : "border-[#F0F0F0"}`}
                                        onClick={() => { StateName(val.Name); selectedCityHandler(val.EncryptedIdentifier, val.Id); setSelectedCityId(val.EncryptedIdentifier); setInputValue(''); setShowSuggestions(false) }}>
                                        <div className="bg-[#d0d0d04d] rounded-lg w-90">
                                            {/* <Image src={`${HelperConstant.imageAPI}/locationicons/uae/${val.EnumName}.png`} alt={""} width={1000} height={1000} /> */}
                                            <Image src={"/assets/images/banner/TamilNadu_IN_TN.png"} alt={""} width={1000} height={1000} />
                                        </div>
                                        <div className={`text-center capitalize py-2 font-semibold ${val.EncryptedIdentifier === (selectedCityId ? selectedCityId : selectedCity) ? "text-[#EA002A] " : "text-[#F0F0F0"}`}>{val.Name}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="lg:hidden block text-center">
                                <span className="text-[#050505] font-medium text-sm mx-2">
                                    {dataLocalization.Cant_Find_Your_Area}
                                </span>
                                <span
                                    onClick={handleRequestPickupClick}
                                    className="text-[#EA002A] font-medium text-sm"
                                >
                                    {dataLocalization.Request_a_delivery}
                                </span>
                            </div>
                            <div>
                                <div className="flex flex-col flex-1 w-full px-3 lg:px-5 py-2 sm:py-3 text-[#A9A9A9] rounded-[10px] bg-white border-solid border-[1.5px] border-[#F0F0F0]">
                                    <div className="gap-3 justify-center items-center">
                                        <div className="flex gap-3 font-medium">
                                            <SearchMenuIcon />
                                            <input
                                                id="locationinput"
                                                type="search"
                                                value={inputValue}
                                                onChange={handleValueChange}
                                                onKeyDown={handleKeyDown}
                                                onClick={() => handleFocus()}
                                                placeholder="Search your city or pincode"
                                                autoComplete="off"
                                                className="grow focus:border-0 focus:outline-0 w-60 text-sm lg:text-base py-0 text-gray-700"
                                            />
                                            <div className="lg:flex gap-2 hidden my-0">
                                                <span className="text-[#050505] font-medium text-nowrap">
                                                    {dataLocalization.Cant_Find_Your_Area}
                                                </span>
                                                <span
                                                    onClick={handleRequestPickupClick}
                                                    className="text-[#EA002A] font-medium cursor-pointer text-nowrap"
                                                >
                                                    {dataLocalization.Request_a_delivery}
                                                </span>
                                            </div>
                                        </div>
                                        {showSuggestions && filteredSuggestions.length > 0 && (
                                            <ul className="suggestions-list">
                                                {filteredSuggestions.map((suggestion: any, index: number) => (
                                                    <li
                                                        key={index}
                                                        ref={index === activeSuggestionIndex ? activeSuggestionRef : null}
                                                        className={index === activeSuggestionIndex ? 'active' : ''}
                                                        onClick={() => handleSuggestionClicked(suggestion, suggestion.Id)}
                                                    >
                                                        {suggestion.Name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> :
                <div id='keyboard-avoid' className="fixed bottom-0 inset-0 flex justify-center z-50">
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-t-lg absolute bottom-0 w-full animate-slide-up-mobile">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white drop-shadow-2xl w-8 h-8 rounded-full flex items-center justify-center">
                            <button
                                onClick={() => setLocationEnable(false)}
                                className="text-2xl text-[#000000] hover:text-gray-800"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="overflow-hidden relative lg:px-16 px-4 lg:py-4 py-3">
                            <div className="relative px-4 py-1">
                                <h2 className="text-xl font-semibold">
                                    {dataLocalization.Select_your_location}
                                </h2>
                                <h5 className="text-xs lg:text-base mt-1 lg:mt-2 color-[#050505]">
                                    {dataLocalization.Based_on_your_Location_We_will_service_for_you}
                                </h5>
                                <div className="absolute right-0 top-[-32px] left-[80%]">
                                    <svg
                                        width="100"
                                        height="146"
                                        viewBox="0 0 100 146"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            cx="134.566"
                                            cy="116.501"
                                            r="132.579"
                                            transform="rotate(72.8457 134.566 116.501)"
                                            stroke="url(#paint0_linear_109_77655)"
                                            strokeWidth="2"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_109_77655"
                                                x1="34.6533"
                                                y1="29.6197"
                                                x2="117.842"
                                                y2="258.334"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stopColor="#EA002A" />
                                                <stop offset="1" stopColor="#EA002A" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="w-[100px] lg:block hidden h-[100px] bg-[#1E54c9] rounded-[50%] absolute left-20 bottom-[60px] blur-[180px]"></div>
                            {/* <div className="w-[120px] h-[100px] bg-[#EA002A] rounded-[50%] absolute right-10 bottom-[40px] blur-[100px] overflow-hidden"></div> */}
                            <div className="px-2 py-1 my-1 flex gap-3 overflow-y-auto max-h-50 pb-4">
                                {stateList.map((val, i) => (
                                    <div key={i} className={`border flex flex-col gap-1 p-1.5 rounded-lg w-fit cursor-pointer ${val.EncryptedIdentifier === (selectedCityId ? selectedCityId : selectedCity) ? "border-[#EA002A]" : "border-[#F0F0F0"}`}
                                        onClick={() => { StateName(val.Name); selectedCityHandler(val.EncryptedIdentifier, val.Id); setSelectedCityId(val.EncryptedIdentifier); setInputValue(''); setShowSuggestions(false) }}>
                                        <div className="bg-[#d0d0d04d] rounded-lg w-24">
                                            <Image src={`${HelperConstant.imageAPI}/locationicons/uae/${val.EnumName}.png`} alt={""} width={1000} height={1000} />
                                        </div>
                                        <div className={`text-center capitalize py-1 font-semibold ${val.EncryptedIdentifier === (selectedCityId ? selectedCityId : selectedCity) ? "text-[#EA002A] " : "text-[#F0F0F0"}`}>{val.Name}</div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex flex-col flex-1 w-full px-3 lg:px-5 py-3 sm:py-3 text-[#A9A9A9] rounded-[10px] bg-white border-solid border-[1.5px] border-[#F0F0F0]">
                                    <div className="gap-3 justify-center items-center">
                                        <div className="flex gap-3 font-medium">
                                            <SearchMenuIcon />
                                            <input
                                                id="locationinput"
                                                autoComplete="off"
                                                type="search"
                                                value={inputValue}
                                                onChange={handleValueChange}
                                                onKeyDown={handleKeyDown}
                                                onClick={() => handleFocus()}
                                                placeholder="Search your city or pincode"
                                                className="grow focus:border-0 focus:outline-0 w-60 text-sm lg:text-base py-0 text-gray-700"
                                            />
                                        </div>
                                        {showSuggestions && filteredSuggestions.length > 0 && (
                                            <ul className="suggestions-list">
                                                {filteredSuggestions.map((suggestion: any, index: number) => (
                                                    <li
                                                        key={index}
                                                        ref={index === activeSuggestionIndex ? activeSuggestionRef : null}
                                                        className={index === activeSuggestionIndex ? 'active' : ''}
                                                        onClick={() => handleSuggestionClicked(suggestion, suggestion.Id)}
                                                    >
                                                        {suggestion.Name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    );
};

