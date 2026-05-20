import { useRecoilState, useRecoilValue } from "recoil";
import { UserLoginDetails } from "../../../../../recoil/userAuth";
import {
  AddCheckoutAddress,
  ShowAddressFormForMobile,
} from "../../../../../recoil/AddCheckout";
import {
  UserDeleveryAddresSelectionArea,
  UserDeliveryAddressForm,
} from "../../../buy/checkout/UserDetailCollection";
import { containerZindex } from "../../../../../recoil/styleState";
import { useEffect, useState } from "react";
import { IAddressModel } from "shared/src/models/Address.Model";
import { getLocalStorage } from "shared/src/components/helper/Helper";
import { useForm } from "react-hook-form";

type Props = {
  defaultValues: IAddressModel,
  isEdit: boolean,
  isAddress: boolean,
  pageFrom?: "ScheduleAddress" | "other"
  setDefaultShow?: any,
  setChangesInAddress?: any,
  addressData?: Array<IAddressModel> | undefined,
  scheduledData: any,
  selectSlot?: (value: any) => void
  RemoveAddressHandler: (value: any) => void,
  filterAddressHandler: (id: any) => void,
  setDelete: any,
  stateList: Array<any>,
  cityList: Array<any>,
  addressType: Array<any>,
  load?: boolean,
  addressHandler: (addressId: any, type: "view" | "edit") => void | undefined,
  setIsEdit: any
  Phone?:string;
}

export default function SellSelectAddress({ defaultValues, isEdit, isAddress, pageFrom, setDefaultShow, setChangesInAddress, addressData, scheduledData, selectSlot, RemoveAddressHandler, filterAddressHandler, setDelete, stateList, cityList, addressType, load, addressHandler, setIsEdit }: Props) {
  return (
    <>
      <DesktopSelectAdderss defaultValues={defaultValues} isEdit={isEdit} isAddress={isAddress} pageFrom={pageFrom} setDefaultShow={setDefaultShow} setChangesInAddress={setChangesInAddress} addressData={addressData} scheduledData={scheduledData} selectSlot={selectSlot} RemoveAddressHandler={RemoveAddressHandler} filterAddressHandler={filterAddressHandler} setDelete={setDelete} stateList={stateList} cityList={cityList} addressType={addressType} load={load} addressHandler={addressHandler} setIsEdit={setIsEdit} />
      <MobileSelectAdderss defaultValues={defaultValues} isEdit={isEdit} isAddress={isAddress} pageFrom={pageFrom} setDefaultShow={setDefaultShow} setChangesInAddress={setChangesInAddress} addressData={addressData} scheduledData={scheduledData} selectSlot={selectSlot} RemoveAddressHandler={RemoveAddressHandler} filterAddressHandler={filterAddressHandler} setDelete={setDelete} stateList={stateList} cityList={cityList} addressType={addressType} load={load} addressHandler={addressHandler} setIsEdit={setIsEdit} />
    </>
  );
}

const DesktopSelectAdderss = ({ defaultValues, isEdit, isAddress, pageFrom, setDefaultShow, setChangesInAddress, addressData, scheduledData, selectSlot, RemoveAddressHandler, filterAddressHandler, setDelete, stateList, cityList, addressType, addressHandler, setIsEdit }: Props) => {
  const [viewportWidth, setViewportWidth] = useState(0);
  const personId = getLocalStorage()?.PersonId;

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

  const [IsAddressAdded, _] = useRecoilState(AddCheckoutAddress);
  const [ShowAddressForms, setShowAddressForms] = useRecoilState(
    ShowAddressFormForMobile
  );

  const [isDesktop, setIsDesktop] = useState(viewportWidth >= 1024);
  
  // Get localStorage data once
  const localStorageData = getLocalStorage();
  
  const { reset } = useForm<IAddressModel>({
    defaultValues: (defaultValues?.Id && defaultValues?.Id > 0) ? { 
      ...defaultValues,
      // Use correct property names from IAddressModel
      FullName: defaultValues.FullName || localStorageData?.name || '',
      Email: defaultValues.Email || localStorageData?.Email || '',
      // PhoneNumber: defaultValues.PhoneNumber || localStorageData?.Mobile || '',
      // Use Pincode (not PinCode) if it exists in IAddressModel
      // Check if Pincode exists in the model
      ...(defaultValues.Pincode && { Pincode: defaultValues.Pincode }),
    } : {
      FullName: localStorageData?.name || '',
      Email: localStorageData?.Email || '',
      // PhoneNumber: localStorageData?.Mobile || '',
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(viewportWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!IsAddressAdded.status) {
      setShowAddressForms({
        AddAddressForm: false,
        AddressSelectionForm: true,
        isEdit: false
      });
    }
  }, [isDesktop]);

  // Format address data to handle both old and new API formats
  const formatAddressData = () => {
    if (!addressData) return [];
    
    return addressData.map((address: any) => {
      // Handle new API format
      if (address.UserId) {
        return {
          ...address,
          // Map new API fields to existing component expected fields
          Id: address.Id,
          EncryptedAddressId: address.Id?.toString(), // Use Id as EncryptedAddressId if not available
          AddressLine1: address.AddressLine1,
          AddressLine2: address.AddressLine2,
          City: address.City,
          State: address.State,
          Country: address.Country,
          Pincode: address.Pincode || address.PinCode, // Use correct property name
          isDefault: address.isDefault,
          DisplayInList: address.DisplayInList,
          IsActive: address.IsActive,
          IsValid: address.IsValid,
          // For form fields
          FullName: localStorageData?.name || '',
          PhoneNumber: address.PhoneNumber,
          Email: localStorageData?.Email || '',
        };
      }
      // Return as-is for old format
      return address;
    });
  };

  const formattedAddressData = formatAddressData();

  return (
    <>
      {/* left side section of the desktop*/}
      <div className="hidden lg:block w-full lg:w-[60%] bg-white border-t lg:border border-[#EFEFEF] py-4 lg:py-5 2xl:py-8 lg:rounded-2xl">
        {/* 1 signin layer */}
        <div className="flex flex-col gap-2 px-7 pb-5 border-b border-[#EBEBEB]">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-baseline justify-start">
              <div className="flex justify-center items-center w-8 h-8 rounded-full border border-[#A9A9A9] text-[#050505] text-base">
                1
              </div>
              <div className="font-semibold text-md 2xl:text-lg capitalize">sign in</div>
            </div>
            {!personId && (
              <div className="text-sm font-semibold cursor-pointer rounded-md py-1 px-2 text-[#EA002A]">
                Change
              </div>
            )}
          </div>
          {personId && (
            <div className="flex justify-start gap-5 items-center px-2">
              <span>
                {localStorageData?.name}
              </span>
              <span>|</span>
              <span>
                {localStorageData?.Email}
              </span>
            </div>
          )}
        </div>

        {/* 2 Delivery Address layer */}
        <div className="flex flex-col gap-2 px-7 py-5 border-b border-[#EBEBEB]">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-baseline justify-start">
              <div className="flex justify-center items-center w-8 h-8 rounded-full border border-[#A9A9A9] text-[#050505] text-md 2xl:text-base">
                2
              </div>
              <div className="font-semibold text-md 2xl:text-lg capitalize">
                Delivery Address
              </div>
            </div>
            {personId && ShowAddressForms.AddressSelectionForm && (
              <div
                className="text-sm font-semibold text-[#EA002A] cursor-pointer"
                onClick={() => {
                  setShowAddressForms({
                    AddAddressForm: true,
                    AddressSelectionForm: false,
                    isEdit: false
                  });
                  setIsEdit(false)
                }}
              >
                Add new address
              </div>
            )}
          </div>
          {/* after signin users can add the details in this form */}
          {personId && ShowAddressForms.AddAddressForm && (
            <UserDeliveryAddressForm 
              defaultValues={defaultValues} 
              isEdit={isEdit} 
              isAddress={isAddress} 
              pageFrom={pageFrom} 
              setDefaultShow={setDefaultShow} 
              setChangesInAddress={setChangesInAddress} 
              addressList={formattedAddressData} 
              stateList={stateList} 
              cityList={cityList} 
              addressType={addressType} 
            />
          )}

          {personId && ShowAddressForms.AddressSelectionForm && (
            <UserDeleveryAddresSelectionArea 
              addressData={formattedAddressData} 
              selectSlot={selectSlot} 
              defaultValues={defaultValues} 
              RemoveAddressHandler={RemoveAddressHandler} 
              filterAddressHandler={filterAddressHandler} 
              setDelete={setDelete} 
              addressHandler={addressHandler} 
              setIsEdit={setIsEdit} 
            />
          )}

        </div>

        {/* payment layer */}
        <div className="flex flex-col gap-2 px-7 pt-5">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-baseline justify-start">
              <div className="flex justify-center items-center w-8 h-8 rounded-full border border-[#A9A9A9] text-[#050505] text-md 2xl:text-base">
                3
              </div>
              <div className="font-semibold text-md 2xl:text-lg capitalize">
                Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const MobileSelectAdderss = ({ defaultValues, isEdit, isAddress, pageFrom, setDefaultShow, setChangesInAddress, addressData, RemoveAddressHandler, selectSlot, filterAddressHandler, setDelete, stateList, cityList, addressType, load, addressHandler, setIsEdit }: Props) => {
  const IsUserLoggedIn = useRecoilValue(UserLoginDetails);
  const [IsAddressAdded, __] = useRecoilState(AddCheckoutAddress);
  const [ShowAddressForms, setShowAddressForms] = useRecoilState(
    ShowAddressFormForMobile
  );
  const [_, setZindex] = useRecoilState(containerZindex);
  const personId = getLocalStorage()?.PersonId;
  
  // Get localStorage data once
  const localStorageData = getLocalStorage();

  // Format address data for mobile view
  const formatAddressData = () => {
    if (!addressData) return [];
    
    return addressData.map((address: any) => {
      // Handle new API format
      if (address.UserId) {
        return {
          ...address,
          // Map new API fields to existing component expected fields
          Id: address.Id,
          EncryptedAddressId: address.Id?.toString(),
          AddressLine1: address.AddressLine1,
          AddressLine2: address.AddressLine2,
          City: address.City,
          State: address.State,
          Country: address.Country,
          Pincode: address.Pincode || address.PinCode, // Use correct property name
          isDefault: address.isDefault,
          DisplayInList: address.DisplayInList,
          IsActive: address.IsActive,
          IsValid: address.IsValid,
          // For display
          FullName: localStorageData?.name || '',
          PhoneNumber: address.PhoneNumber,
          Email: localStorageData?.Email || '',
        };
      }
      // Return as-is for old format
      return address;
    });
  };

  const formattedAddressData = formatAddressData();

  // Get selected address for display
  const getSelectedAddress = () => {
    if (IsAddressAdded.selectedAddress) {
      return IsAddressAdded.selectedAddress.address;
    }
    
    // Try to get address from formatted data
    if (defaultValues && defaultValues.Id) {
      const selected = formattedAddressData.find((addr: any) => addr.Id === defaultValues.Id);
      if (selected) {
        return `${selected.AddressLine1}, ${selected.AddressLine2}, ${selected.City}, ${selected.State}, ${selected.Country} - ${selected.Pincode}`;
      }
    }
    
    return '';
  };

  const selectedAddress = getSelectedAddress();

  return (
    <>
      {/* this user logged in screen will only display in mobile */}
      <div className="flex flex-col gap-2 lg:hidden w-full h-fit lg:w-1/2 bg-white border-y lg:border border-[#EFEFEF] py-4 lg:py-8 lg:rounded-2xl">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold tracking-[1px]">Sign In</div>
          {(formattedAddressData && formattedAddressData.length > 1) && (
            <div className="text-sm font-semibold border border-[#EA002A] rounded-md py-1 px-2 text-[#EA002A]"
              onClick={() => {
                setZindex("z-50");
                setShowAddressForms((e) => ({
                  ...e,
                  AddAddressForm: false,
                  AddressSelectionForm: true,
                }))
              }}>
              Change
            </div>
          )}
        </div>
        <div className="flex justify-start gap-2 items-center px-2">
          {personId && (
            <div className="flex justify-start gap-5 items-center px-2">
              <span className="font-semibold">
                {localStorageData?.name}
              </span>
              <span>|</span>
              <span className="font-semibold">
                {localStorageData?.Email}
              </span>
            </div>
          )}
        </div>
        {IsAddressAdded.status && selectedAddress && (
          <div className="px-2 text-sm truncate">
            {selectedAddress}
          </div>
        )}
        {personId && ShowAddressForms.AddAddressForm && (
          <div className="fixed top-0 left-0 z-[100] backdrop-blur-sm w-full h-full bg-[#05050550] lg:relative lg:bg-white lg:backdrop-blur-0">
            <UserDeliveryAddressForm 
              defaultValues={defaultValues} 
              isEdit={isEdit} 
              isAddress={isAddress} 
              pageFrom={pageFrom} 
              setDefaultShow={setDefaultShow} 
              setChangesInAddress={setChangesInAddress} 
              addressList={formattedAddressData} 
              stateList={stateList} 
              cityList={cityList} 
              addressType={addressType} 
            />
          </div>
        )}

        {personId && ShowAddressForms.AddressSelectionForm && (
          <div className="fixed top-0 left-0 z-[100] backdrop-blur-sm w-full h-full bg-[#05050550] lg:relative lg:bg-white lg:backdrop-blur-0">
            <UserDeleveryAddresSelectionArea 
              addressData={formattedAddressData} 
              selectSlot={selectSlot} 
              defaultValues={defaultValues} 
              RemoveAddressHandler={RemoveAddressHandler} 
              filterAddressHandler={filterAddressHandler} 
              setDelete={setDelete} 
              stateList={stateList} 
              cityList={cityList} 
              addressType={addressType} 
              load={load} 
              addressHandler={addressHandler} 
              setIsEdit={setIsEdit} 
            />
          </div>
        )}
        {/* this sell button will show for mobile screen */}
        {(!IsAddressAdded.status || formattedAddressData.length === 0) && (
          <div
            className="flex justify-center items-center fixed bottom-0 left-0 w-full bg-white p-3 lg:hidden"
            onClick={() => {
              setZindex("z-50");
              setShowAddressForms((e) => ({
                ...e,
                AddAddressForm: true,
                AddressSelectionForm: true,
              }));
            }}
          >
            <button className="w-full bg-[#EA002A] capitalize py-4 text-white rounded-md">
              Add Address
            </button>
          </div>
        )}
      </div>
    </>
  );
};