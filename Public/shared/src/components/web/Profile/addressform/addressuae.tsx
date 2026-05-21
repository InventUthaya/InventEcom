import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'
import { getLocalStorage } from 'shared/src/components/helper/Helper'
import { HelperConstant } from 'shared/src/components/helper/HelperConstant'
import { checkoutloadingState, ShowAddressFormForMobile } from 'shared/src/recoil/AddCheckout'
import { MenuContentZindex, containerZindex } from 'shared/src/recoil/styleState'
import { IDOFYGeoModel } from 'shared/src/models/DofyGeo.Model'
import { CloseIcon } from '../../buy/checkout/assets'
import { Reloader } from 'shared/src/recoil/Reloader'
import { IAddressModel } from 'shared/src/models/Address.Model'
import UserAddressServices from 'shared/src/services/UserAddress.Services'
import DofyGeoService from 'shared/src/services/DofyGeo.Service'
import Loader from 'shared/src/components/utils/Loader/Loader'

type Props = {
    defaultValues: IAddressModel,
    isEdit: boolean,
    isAddress: boolean,
    pageFrom?: "ScheduleAddress" | "other"
    setDefaultShow?: any,
    setChangesInAddress?: any
    addressList: Array<IAddressModel>,
    setShowAddress?: any
}
function AddressFormAE({ defaultValues, isEdit, setShowAddress }: Props) {
    let URLParamSell = window.location.pathname.includes('checkout');
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue, getValues } = useForm<IAddressModel>({
        mode: 'onChange',
        defaultValues: (defaultValues?.EncryptedAddressId && defaultValues?.EncryptedAddressId != "" && isEdit) ? { ...defaultValues } : {
            FirstName: getLocalStorage()?.name,
            PhoneNumber: getLocalStorage()?.MobileNumber
        }
    });
    const [reloader, setReloader] = useRecoilState(Reloader);
    const [_, setZindex] = useRecoilState(containerZindex);
    const [__, setShowAddressForms] = useRecoilState(ShowAddressFormForMobile);
    const [checkoutloading, setCheckoutloading] = useRecoilState(checkoutloadingState);
    const [menuContentZindex, setMenuContentZindex] = useRecoilState(MenuContentZindex);

    const [saveButtonDisable, setSaveButtonDisable] = useState(false);
    const [filterGeoLocation, setFilterGeoLocation] = useState<Array<IDOFYGeoModel>>([]);
    const [filterLocation, setFilterLocationList] = useState<Array<any>>([]);
    const [state, setState] = useState<Array<any>>([]);
    const [dofyGeoList, setDofyGeoList] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const personId = getLocalStorage()?.PersonId;
    let defaultStateId = localStorage.getItem("stateId");

    const UserAddressHandler = () => {
        setZindex("z-10");
        setMenuContentZindex({
            Z_Index: "z-50"
        })
    };

    const handleFormClose = () => {
        if (URLParamSell) {
            setShowAddressForms((e) => ({
                ...e,
                AddressSelectionForm: false,
                AddAddressForm: false,
                isEdit: false
            }));
            setZindex("z-10");
        } else {
            setZindex("z-10");
            setShowAddress((e: boolean) => !e);
            setMenuContentZindex({
                Z_Index: "z-50"
            })
        }
    };

    const handleChooseExist = () => {
        if (URLParamSell) {
            setShowAddressForms((e) => ({
                ...e,
                AddressSelectionForm: true,
                AddAddressForm: false,
                isEdit: false
            }));
        } else {
            setZindex("z-10");
            setShowAddress((e: boolean) => !e);
            setMenuContentZindex({
                Z_Index: "z-50"
            })
        }
    };

    const HandleLocationSearch = (searchText: any) => {
        if (searchText !== "") {
            setQuery(searchText);
            let result = filterLocation.filter(x => { return (x.Name.toLowerCase().includes(searchText.toLowerCase()) || x.Code.includes(searchText)) });
            setFilterGeoLocation(result);
        } else {
            setFilterGeoLocation(filterLocation);
        }
    };

    const ScreenReloader = () => {
        setReloader(!reloader);
        setShowAddress(false);
        setMenuContentZindex({
            Z_Index: "z-50"
        })
    };

    const getStateList = () => {
        DofyGeoService.GetStateList(HelperConstant.serviceTypeId.SELL).then(res => {
            if (res.status === 200) {
                setState(res.data);
            }
        }).catch(e => {
            console.log(e);
        });
    };

    const cityHandler = (selectedCityId: any) => {
        setSelectedCity(selectedCityId);
        const selectedCity = state.find((city) => city.Id === Number(selectedCityId));
        if (selectedCity) {
            setValue("City", selectedCity.Name);
           
            GetAllDofyGeoBysearch(selectedCity.EncryptedId, '', '', '');
        }
    };

    const handleDofyGeoChange = (selectedGeoId: any) => {
        setSelectedArea(selectedGeoId);
        const selectedGeo = dofyGeoList.find((geo) => geo.Id === Number(selectedGeoId));
        if (selectedGeo) {
            // Store the area/district name in a field that exists in IAddressModel
            // Assuming 'State' or another appropriate field exists in IAddressModel
            setValue("State", selectedGeo.Name);
           
        }
    };

    const GetAllDofyGeoBysearch = (stateId?: any, searchText?: any, LanguageCode?: any, CountryCode?: any) => {
        DofyGeoService.GetDofyGeoListBysearch(stateId, searchText ? searchText : null, LanguageCode, CountryCode).then(res => {
            if (res.status === 200) {
                setDofyGeoList(res.data.Items);
            }
        }).catch(e => {
            console.log(e);
        });
    };

    const onCreateAddress: SubmitHandler<IAddressModel> = (data: any) => {
        const selectedCityObj = state.find(city => city.Id === Number(selectedCity));
        if (selectedCityObj) data.City = selectedCityObj.Name;

        const selectedGeoObj = dofyGeoList.find(geo => geo.Id === Number(selectedArea));
        if (selectedGeoObj) {
            // Use an existing field from IAddressModel, assuming 'State' is available
            data.State = selectedGeoObj.Name;
        }

        setSaveButtonDisable(true);
        setCheckoutloading(true);
        if (isEdit) {
            data.EncryptedId = defaultValues.EncryptedAddressId;
            UserAddressServices.UpdateAddressByCustomerId(personId, data).then(res => {
                if (res.status === 200) {
                    if (URLParamSell) {
                        setTimeout(() => {
                            setSaveButtonDisable(false);
                        }, 2000);
                        setShowAddressForms({
                            AddAddressForm: false,
                            AddressSelectionForm: true,
                            isEdit: false
                        })
                        setCheckoutloading(false);
                        setReloader(!reloader);
                        setMenuContentZindex({
                            Z_Index: "z-50"
                        })
                    }
                    else {
                        setCheckoutloading(false);
                        setReloader(!reloader);
                        setShowAddress(false);
                        setMenuContentZindex({
                            Z_Index: "z-50"
                        })
                    }
                }
            }).catch((e: string) => {
                console.log(e);
            })
        }
        else {
            data.EncryptedId = personId;
            UserAddressServices.create(data).then((res) => {
                if (res.status === 200) {
                    setTimeout(() => {
                        setSaveButtonDisable(false);
                    }, 2000);
                    setShowAddressForms({
                        AddAddressForm: false,
                        AddressSelectionForm: true,
                        isEdit: false
                    })
                    setCheckoutloading(false);
                    // setReloader(true);
                    setReloader(!reloader);
                    setShowAddress((e: boolean) => !e);
                } else {
                    setCheckoutloading(false);
                    ScreenReloader();
                }
            }).catch((e: string) => {
                console.log(e);
            });
        }
        setTimeout(() => {
            setSaveButtonDisable(false);
        }, 2000);
    };

    const convertToLowerCase = (text: string) => {
        if (text === text.toUpperCase()) {
            return text
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        return text;
    };

    useEffect(() => {
        getStateList();
    }, []);

    useEffect(() => {
        if (defaultValues?.City) {
            const city = state.find(c => c.Name === defaultValues.City);
            if (city) {
                setSelectedCity(city.Id);
                GetAllDofyGeoBysearch(city.EncryptedId);
            }
        }
    }, [isEdit, state]);

    useEffect(() => {
        if (defaultValues?.State) { // Changed from Title to State
            const area = dofyGeoList.find(a => a.Name === defaultValues.State);
            if (area) setSelectedArea(area.Id);
        }
    }, [isEdit, dofyGeoList]);

    return (
        <>
            {/* {loading && <Loader />} */}
            <style>
                {`
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }
    `}
            </style>
            <form onSubmit={handleSubmit(onCreateAddress)}>
                <div className="fixed lg:relative bottom-0 left-0 w-full bg-white p-3 lg:p-0 rounded-t-2xl lg:rounded-none flex flex-col cursor-no\">
                    <div className="absolute bg-white -top-[3.5rem] left-1/2 rounded-full -translate-x-1/2 w-10 h-10 flex lg:hidden justify-center items-center"
                        onClick={() => { handleFormClose() }}
                    >
                        <CloseIcon />
                    </div>
                    <div>
                        {URLParamSell ? <div className="flex lg:hidden justify-between p-2">
                            <div>Pickup Address</div>
                            <div
                                className="text-sm font-semibold text-[#EA002A] cursor-pointer"
                                onClick={() => {
                                    setShowAddressForms((e) => ({
                                        AddressSelectionForm: true,
                                        AddAddressForm: false,
                                        isEdit: false
                                    }));
                                }}
                            >
                                Choose existing Address
                            </div>
                        </div> : <h1 className="capitalize text-base lg:text-2xl font-semibold py-2">
                            {isEdit ? "Edit Address" : "Add New Address"}
                        </h1>}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="FirstName"
                                    className="text-sm lg:text-md 2xl:text-base font-semibold"
                                >
                                    Full Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="FirstName"
                                    type="text"
                                    placeholder="enter your name"
                                    className="placeholder:capitalize border text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                    {...register("FirstName", { required: true, onChange: (e: any) => { setValue("FirstName", e.target.value); } })}
                                />
                                {errors.FirstName && <p className="text-xs text-red-700 font-semibold">Please Enter Full Name</p>}
                            </div>
                            {/* <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="LastName"
                                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                >
                                    Last Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="LastName"
                                    type="text"
                                    placeholder="enter your name"
                                    className="placeholder:capitalize border text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                    {...register("LastName", { required: true, onChange: (e: any) => { setValue("LastName", e.target.value); } })}
                                />
                                {errors.LastName && <p className="text-xs text-red-700 font-semibold">Please Enter Last Name</p>}
                            </div> */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="PhoneNumber"
                                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                >
                                    Mobile number <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="PhoneNumber"
                                    inputMode="numeric"
                                    maxLength={10}
                                    placeholder="Enter Your Mobile number"
                                    className="placeholder:capitalize border text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                    {...register("PhoneNumber", { required: true, minLength: 9, maxLength: 9, onChange: (e: any) => { setValue("PhoneNumber", HelperConstant.numberOnlyRegex.regex.test(e.target.value) ? e.target.value : ""); } })}
                                />
                                {errors.PhoneNumber && errors.PhoneNumber.type === "required" && (<p className="text-xs font-semibold text-red-700">Please Enter Mobile Number</p>)}
                                {errors.PhoneNumber && (errors.PhoneNumber.type === "minLength" || errors.PhoneNumber.type === "maxLength") && (<p className="text-xs font-semibold text-red-700">Please enter valid Mobile Number</p>)}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="address1"
                                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                >
                                    Landmark
                                </label>
                                <input
                                    id="AddressLine2" // Changed from Address2 to AddressLine2
                                    placeholder="Enter Your Landmark"
                                    className="placeholder:capitalize border resize-none text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                    {...register("AddressLine2", { required: false, onChange: (e: any) => { setValue("AddressLine2", e.target.value); } })}
                                />
                                {errors.AddressLine2 && <p className="text-xs font-semibold text-red-700">Please Enter Your Landmark</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="City"
                                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                >
                                    City <span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="City"
                                    value={selectedCity}
                                    className="border text-xs 2xl:text-sm border-[#DFDFDF] bg-transparent rounded-md block w-full p-2.5"
                                    {...register("City", { required: true })}
                                    onChange={(e: any) => {
                                        setValue("City", e.target.value);
                                        cityHandler(e.target.value);
                                    }}
                                >
                                    <option value="" disabled selected>Select City</option>
                                    {state.map((el, i) => (
                                        <option key={i} value={el.Id}>{el.Name}</option>
                                    ))}
                                </select>
                                {errors.City && <p className="text-xs font-semibold text-red-700">Please select a City</p>}
                            </div>
                            <div className="flex flex-col  gap-2">
                                <label
                                    htmlFor="Title"
                                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                >
                                    Area/District<span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="State" // Changed from Title to State
                                    value={selectedArea}
                                    className="border text-xs 2xl:text-sm border-[#DFDFDF] bg-transparent rounded-md block w-full p-2.5"
                                    {...register("State", { required: true })}
                                    onChange={(e) => handleDofyGeoChange(e.target.value)}
                                >
                                    <option value="" disabled selected>Select Area/District</option>
                                    {dofyGeoList.map((geo) => (
                                        <option key={geo.Id} value={geo.Id}>{convertToLowerCase(geo.Name)}</option>
                                    ))}
                                </select>
                                {errors.State && <p className="text-xs text-red-700 font-semibold">Please Enter Area/District</p>}
                            </div>
                        </div>
                        <div className="flex flex-col pt-3">
                            <label
                                htmlFor="Address1"
                                className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                            >
                                Delivery Address <span className="text-red-600">*</span>
                            </label>
                            <textarea
                                id="AddressLine1" // Changed from Address1 to AddressLine1
                                placeholder="Enter Your Delivery Address"
                                className="placeholder:capitalize border resize-none text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                rows={4}
                                {...register("AddressLine1", { required: true, onChange: (e: any) => { setValue("AddressLine1", e.target.value); } })}
                            />
                            {errors.AddressLine1 && <p className="text-xs font-semibold text-red-700">Please Enter Address</p>}
                        </div>

                        <div className="flex lg:justify-end items-center gap-5 pt-2">
                            <button
                                className="hidden lg:block text-[#EA002A] font-semibold cursor-pointer border-0 outline-0 disabled:text-[#BCBCBC] disabled:cursor-not-allowed"
                                onClick={() => { handleChooseExist() }}
                            >
                                {URLParamSell ? "Choose existing address" : "Cancel"}
                            </button>
                            <button
                                disabled={saveButtonDisable}
                                className="w-full lg:w-40 py-2 disabled:cursor-not-allowed disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC] text-center bg-[#EA002A] border-0 outline-0 text-white rounded-md capitalize text-lg font-semibold"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddressFormAE
