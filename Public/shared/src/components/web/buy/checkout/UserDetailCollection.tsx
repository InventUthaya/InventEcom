import { useRecoilState, useRecoilStateLoadable, useRecoilValue, useSetRecoilState } from "recoil";
import { radioOptions } from "./checkoutData";
import { useEffect, useState } from "react";
import { CloseIcon, DelectIcon, EditIcon } from "./assets";
import { AddCheckoutAddress, ScheduleOrder, ShowAddressFormForMobile, } from "../../../../recoil/AddCheckout";
import { containerZindex } from "../../../../recoil/styleState";
import { IAddressModel } from "shared/src/models/Address.Model";
import { getLocalStorage } from "shared/src/components/helper/Helper";
import { useForm } from "react-hook-form";
import AddressFormIN from "../../Profile/addressform";
import { AddressID, availabilityState } from "shared/src/recoil/InputParamChange";
import { CheckOutPayment } from "shared/src/recoil/payment";
import DofyGeoService from "shared/src/services/DofyGeo.Service";
import AddressFormAE from "../../Profile/addressform/addressuae";

type Props = {
  defaultValues: IAddressModel,
  isEdit: boolean,
  isAddress: boolean,
  pageFrom?: "ScheduleAddress" | "other"
  setDefaultShow?: any,
  setChangesInAddress?: any
  addressList: Array<IAddressModel>,
  stateList?: Array<any>,
  cityList?: Array<any>,
  addressType?: Array<any>

}

export const UserDeliveryAddressForm = ({ defaultValues, isEdit, isAddress, setChangesInAddress, addressList }: Props) => {

  return (
    <>
      <div className="fixed top-0 left-0 z-80 backdrop-blur-sm w-full h-full bg-[#05050550] lg:relative lg:bg-white lg:backdrop-blur-0">
        <AddressFormAE defaultValues={defaultValues} addressList={addressList} isAddress={isAddress} isEdit={isEdit} setChangesInAddress={setChangesInAddress} />
        {/* <AddressFormIN defaultValues={defaultValues} addressList={addressList} isAddress={isAddress} isEdit={isEdit} setChangesInAddress={setChangesInAddress} /> */}
      </div>
    </>
  );
};

type UserDeliveryAddressFormProps = {
  addressData?: Array<IAddressModel>;
  scheduledData?: any;
  selectSlot?: (value: any) => void | undefined
  defaultValues: IAddressModel,
  RemoveAddressHandler: (value: any) => void | undefined,
  filterAddressHandler: (id: any) => void,
  setDelete: any,
  stateList?: Array<any>,
  cityList?: Array<any>,
  addressType?: Array<any>,
  load?: boolean,
  addressHandler: (addressId: any, type: "view" | "edit") => void | undefined,
  setIsEdit: any
}

export const UserDeleveryAddresSelectionArea = ({ addressData, scheduledData, selectSlot, defaultValues, RemoveAddressHandler, filterAddressHandler, setDelete, stateList, cityList, addressType, load, addressHandler, setIsEdit }: UserDeliveryAddressFormProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const { reset } = useForm<IAddressModel>({
    defaultValues: (defaultValues?.EncryptedAddressId && defaultValues?.EncryptedAddressId.length > 0) ? { ...defaultValues } : {
      FullName: getLocalStorage()?.name,
      //MobilePhone: getLocalStorage()?.Mobile,
    }
  });

  const [handleOutlet, setHandleOutlet] = useRecoilState(ScheduleOrder);
  const [addressId, setAddressId] = useRecoilState(AddressID);
  const [__, setShowAddressForms] = useRecoilState(ShowAddressFormForMobile);
  const [_, setZindex] = useRecoilStateLoadable(containerZindex);
  const setAvailability = useSetRecoilState(availabilityState);
  const [addressHandlerState, setAddressHandlerState] = useRecoilState(AddCheckoutAddress);
  const [addressHandlerStateLoadable, setAddressHandlerStateLoadable] = useRecoilStateLoadable(AddCheckoutAddress);

  const [submit, setSubmit] = useState<boolean>(false);

  const handleAddressSubmit = () => {
    if (selectedAddressId) {
      selectSlot && selectSlot(selectedAddressId);
      const selectedAddress = addressData?.find(
        (item) => item.Id === selectedAddressId
      );
      if (selectedAddress) {
        // DofyGeoService.getPincodeAvailability(selectedAddress.ZipPostalCode).then(res => {
        //   if (res.status === 200) {
        //     if (Array.isArray(res.data) && res.data.length > 0) {
        //       setAvailability({
        //         message: "OBD applicable",
        //         color: "text-[#249B3E]",
        //       });
        //     } else {
        //       setAvailability({
        //         message: "OBD not applicable",
        //         color: "text-[#FF0000]",
        //       });
        //     }
        //   }
        // })
      }
      setAddressHandlerState({
        status: true,
        address: [],
        selectedStatus: false,
        selectedAddress: undefined,
      });
      setAddressHandlerStateLoadable({
        status: true,
        selectedStatus: true,
        address: [],
        selectedAddress: undefined,
      });
      setHandleOutlet({
        handleSchedule: "CheckOutPayment"
      });
      setSubmit(true);
    } else {
      alert("Please choose the address for delivery");
    }
  };

  const EditClickHandler = (id: any) => {
    addressHandler(id, "edit");
    setIsEdit(true);
    filterAddressHandler(id);
    setShowAddressForms({
      AddAddressForm: true,
      AddressSelectionForm: false,
      isEdit: true
    }); setAddressId({
      AddressId: id
    })
  }

  return (
    // <div className="fixed top-0 left-0 z-80 backdrop-blur-sm w-full h-100 bg-[#05050550] lg:relative lg:bg-white lg:backdrop-blur-0">
    <div className="fixed lg:relative bottom-0 left-0 w-full bg-white py-3 lg:py-0 rounded-t-2xl lg:rounded-none flex flex-col gap-2 lg:gap-3 mt-2 px-2">        {/* this close button only shown on mobile not for desktop */}
      <div
        className="absolute bg-white -top-16 left-1/2 rounded-full -translate-x-1/2 w-10 h-10 flex lg:hidden justify-center items-center"
        onClick={() => {
          setShowAddressForms((e) => ({
            ...e,
            AddressSelectionForm: false,
            AddAddressForm: false,
          }));
          setZindex("z-10");
        }}
      >
        <CloseIcon />
      </div>
      <div className="flex lg:hidden justify-between p-2">
        <div>Delivery Addres</div>
        <div
          className="text-sm font-semibold text-[#EA002A] cursor-pointer"
          onClick={() => {
            setShowAddressForms((e) => ({
              ...e,
              AddressSelectionForm: false,
              AddAddressForm: true,
              isEdit: false
            }));
            setIsEdit(false);
          }}
        >
          Add new Address
        </div>
      </div>
      <div className="h-72 overflow-y-scroll scroll-smooth p-1">
        {(
          addressData?.sort((a, b) =>
            Number(b.EncryptedAddressId) - Number(a.EncryptedAddressId)
          )?.map((item, index) => {
            return (
              <label
                className="flex justify-between items-start w-full cursor-pointer border-b border-[#EBEBEB] pt-3 pb-5"
                key={index}
              >
                <div
                  className="flex flex-col gap-1"
                  onClick={() => { setSelectedAddressId(Number(item.EncryptedAddressId)); }}

                >
                  <div className="flex justify-start items-center">
                    <span
                      className={`w-4 h-4 rounded-full border flex justify-center items-center  ${Number(selectedAddressId) === Number(item.EncryptedAddressId) ? "border-[#EA002A]" : "border-[#ADADAD] "
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full block ${Number(selectedAddressId) === Number(item.EncryptedAddressId) && "bg-[#EA002A]"
                          }`}
                      ></span>
                    </span>
                    <div className="flex justify-start gap-2 items-center px-2 font-semibold text-sm 2xl:text-md">
                      <span>{item.FullName}</span>
                      <span>|</span>
                      <span>{item.PhoneNumber}</span>
                    </div>
                  </div>
                  <div className="pl-6 pr-1 text-sm 2xl:text-md">
                    <span>{item.AddressLine1 && <>{item.AddressLine2},</>}</span>
                    {/* {item.Address2 && <>{item.Address2},</>}</span><br /> */}
                    {/* {item.Title ? <>{item.Title},<br /></> : ""} */}
                    {item.City && <>{item.City}&nbsp;</>}
                    {item.Pincode && - (item.Pincode)}.
                    {item?.State}
                  </div>
                </div>
                <div className="flex justify-start gap-2 items-center px-2">
                  <div className="cursor-pointer" onClick={() => { EditClickHandler(item.EncryptedAddressId) }}>
                    <EditIcon />
                  </div>
                  <span className="text-[#D9D9D9]">|</span>
                  <div className="cursor-pointer" onClick={() => {
                    RemoveAddressHandler(item.EncryptedAddressId);
                    setAddressId({ AddressId: Number(item.EncryptedAddressId) })
                  }}>                    <DelectIcon />
                  </div>
                </div>
              </label>
            );
          })
        )}
      </div>
      {/* ------------------------------------------------------------------ */}

      <div className="flex lg:justify-end">
        <button
          className="w-full lg:w-40 py-2 disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC] text-center bg-[#EA002A] border-0 outline-0 text-white rounded-md capitalize text-md 2xl:text-lg font-semibold"
          disabled={selectedAddressId ? false : true}
          onClick={() => handleAddressSubmit()}
        >
          Submit
        </button>
      </div>
      {/* </div> */}
    </div>
  );
};

export const PaymentForm = () => {
  const [selectedPayment, setselectedPayment] = useRecoilState(CheckOutPayment);

  return (
    <div className="flex flex-col gap-2 lg:gap-3 mt-2 px-2">
      {radioOptions.map((option, index) => (
        <label
          key={index}
          className="inline-flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="radio"
            name="customRadio"
            className="form-radio hidden"
            value={option.value}
            checked={selectedPayment.method === option.value}
            onChange={() =>
              setselectedPayment((e) => ({
                ...e,
                status: true,
                method: option.value,
              }))
            }
          />
          <span
            className={`w-4 h-4 rounded-full border flex justify-center items-center  ${selectedPayment.method === option.value
              ? "border-[#EA002A]"
              : "border-[#ADADAD] "
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full block ${selectedPayment.method === option.value && "bg-[#EA002A]"
                }`}
            ></span>
          </span>
          <span className="text-sm lg:text-base font-semibold">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};
