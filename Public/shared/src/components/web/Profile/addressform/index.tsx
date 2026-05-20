import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'
import { getLocalStorage } from 'shared/src/components/helper/Helper'
import { HelperConstant } from 'shared/src/components/helper/HelperConstant'
import { checkoutloadingState, ShowAddressFormForMobile } from 'shared/src/recoil/AddCheckout'
import { MenuContentZindex, containerZindex } from 'shared/src/recoil/styleState'
import { IDOFYGeoModel } from 'shared/src/models/DofyGeo.Model'
import { CloseIcon } from '../../buy/checkout/assets'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import { Reloader } from 'shared/src/recoil/Reloader'
import { IAddressModel } from 'shared/src/models/Address.Model'
import UserAddressServices from 'shared/src/services/UserAddress.Services'
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
function AddressFormIN({ defaultValues, isEdit, setShowAddress }: Props) {
    let URLParamSell = window.location.pathname.includes('checkout');
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue} = useForm<IAddressModel>({
        defaultValues: (defaultValues?.EncryptedAddressId && isEdit) ? { ...defaultValues } : {
            FirstName: getLocalStorage()?.name,
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
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const personId = getLocalStorage()?.PersonId;

    const UserAddressHandler = () => {
        setZindex("z-10");
        setMenuContentZindex({
            Z_Index: "z-50"
        })
    }
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
    }

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
    }

    const HandleLocationSearch = (searchText: any) => {
        if (searchText !== "") {
            setQuery(searchText);
            let result = filterLocation.filter(x => { return (x.Name.toLowerCase().includes(searchText.toLowerCase()) || x.Code.includes(searchText)) });
            setFilterGeoLocation(result);
        } else {
            setFilterGeoLocation(filterLocation);
        }
    }

    const ScreenReloader = () => {
        setReloader(!reloader);
        setShowAddress(false);
        setMenuContentZindex({
            Z_Index: "z-50"
        })
    }

    const onCreateAddress: SubmitHandler<IAddressModel> = (data: any) => {
        setSaveButtonDisable(true);
        setCheckoutloading(true);
        if (isEdit) {
            data.Id = defaultValues.EncryptedAddressId;
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
            data.Id = personId;
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
    }

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
                                    First Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="FirstName"
                                    type="text"
                                    placeholder="enter your name"
                                    className="placeholder:capitalize border text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                    {...register("FirstName", { required: true, onChange: (e: any) => { setValue("FirstName", e.target.value); clearErrors("FirstName"); } })}
                                />
                                {errors.FirstName && <p className="text-xs text-red-700 font-semibold">Please Enter First Name</p>}
                            </div>
                            <div className="flex flex-col gap-2">
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
                                />
                            </div>
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
                                    minLength={9}
                                    maxLength={10}
                                    placeholder="Enter Your Mobile number"
                                    className="placeholder:capitalize border text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                    {...register("PhoneNumber", { required: true, minLength: 9, maxLength: 9, onChange: (e: any) => { setValue("PhoneNumber", HelperConstant.numberOnlyRegex.regex.test(e.target.value) ? e.target.value : ""); clearErrors("PhoneNumber"); } })}
                                />
                                {errors.PhoneNumber && errors.PhoneNumber.type === "required" && (<p className="text-xs font-semibold text-red-700">Please Enter Mobile Number</p>)}
                                {errors.PhoneNumber && (errors.PhoneNumber.type === "minLength" || errors.PhoneNumber.type === "maxLength") && (<p className="text-xs font-semibold text-red-700">Please enter valid Mobile Number</p>)}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="Pincode"
                                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                >
                                    Pincode <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="Pincode"
                                    inputMode="numeric"
                                    placeholder="Enter Your Pincode"
                                    className="placeholder:capitalize border text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                    {...register("Pincode", {
                                        required: true,
                                        minLength: 6,
                                        maxLength: 6,
                                        pattern: /^[0-9]+$/,
                                        onChange: (e: any) => {
                                            const value = e.target.value;
                                            if (/^[0-9]*$/.test(value)) { 
                                                setValue("Pincode", value);
                                                clearErrors("Pincode");
                                            }
                                        },
                                    })}
                                />
                                {errors.Pincode && errors.Pincode.type === "required" && (
                                    <p className="text-xs font-semibold text-red-700">Please Enter Zip Code</p>
                                )}
                                {errors.Pincode && (
                                    (errors.Pincode.type === "minLength" ||
                                        errors.Pincode.type === "maxLength") && (
                                        <p className="text-xs font-semibold text-red-700">Zip Code must be 6 digits</p>
                                    )
                                )}
                                {errors.Pincode && errors.Pincode.type === "pattern" && (
                                    <p className="text-xs font-semibold text-red-700">Zip Code must be numeric</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="AddressLine2"
                                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                >
                                    Landmark
                                </label>
                                <input
                                    id="AddressLine2"
                                    placeholder="Enter Your Landmark"
                                    className="placeholder:capitalize border resize-none text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                    {...register("AddressLine2", { required: false, onChange: (e: any) => { setValue("AddressLine2", e.target.value); clearErrors("AddressLine2"); } })}
                                />
                                {errors.AddressLine2 && <p className="text-xs font-semibold text-red-700">Please Enter Your Landmark</p>}
                            </div>


                            <div className="flex flex-col  gap-2">
                                <label
                                    htmlFor="City"
                                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                >
                                    City / Town<span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="City"
                                    type="text"
                                    placeholder="Enter Your City"
                                    className="placeholder:capitalize border text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                    {...register("City", { required: true, onChange: (e: any) => { setValue("City", e.target.value); clearErrors("City"); } })}
                                />
                                {errors.City && <p className="text-xs text-red-700 font-semibold">Please Enter City</p>}
                            </div>


                        </div>
                        <div className="flex flex-col pt-3">
                            <label
                                htmlFor="AddressLine1"
                                className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                            >
                                Delivery Address <span className="text-red-600">*</span>
                            </label>
                            <textarea
                                id="AddressLine1"
                                placeholder="Enter Your Delivery Address"
                                className="placeholder:capitalize border resize-none text-xs 2xl:text-sm border-[#DFDFDF] p-2 rounded-md"
                                rows={4}
                                {...register("AddressLine1", { required: true, onChange: (e: any) => { setValue("AddressLine1", e.target.value); clearErrors("AddressLine1"); } })}
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

export default AddressFormIN