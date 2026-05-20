import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { PaymentForm } from "../UserDetailCollection";
import { UserLoginDetails } from "../../../../../recoil/userAuth";
import { AddCheckoutAddress, ScheduleOrder, ShowAddressFormForMobile } from "../../../../../recoil/AddCheckout";
import { CheckOutPayment } from "../../../../../recoil/payment";
import { getLocalStorage } from "shared/src/components/helper/Helper";
import { availabilityState } from "shared/src/recoil/InputParamChange";

type CheckoutPaymentProps = {
  addressId: any,
  slotHandler?: (isOrderStatus: boolean) => void | undefined,
  selectedAddress: any
}

export default function CheckoutPaymentComponent({ addressId, selectedAddress, slotHandler }: CheckoutPaymentProps) {
  return (
    <>
      <DesktopViewCheckout addressId={addressId} selectedAddress={selectedAddress} slotHandler={slotHandler} />
      <MobileViewCheckout addressId={addressId} selectedAddress={selectedAddress} slotHandler={slotHandler} />
    </>
  );
}

const DesktopViewCheckout = ({ addressId, selectedAddress, slotHandler }: CheckoutPaymentProps) => {
  // const navigate = useNavigate();
  const IsUserLoggedIn = useRecoilValue(UserLoginDetails);
  const [IsAddressAdded, __] = useRecoilState(AddCheckoutAddress);
  const [selectedPayment, ___] = useRecoilState(CheckOutPayment);
  const personId = getLocalStorage()?.PersonId;
  const [handleOutlet, setHandleOutlet] = useRecoilState(ScheduleOrder);
  const [_, setShowAddressForms] = useRecoilState(ShowAddressFormForMobile);
  const availability = useRecoilValue(availabilityState);

  const selectedPickupAddress = selectedAddress.find((x: any) => x.EncryptedAddressId == addressId);

  return (
    <div className="hidden lg:block w-full lg:w-1/2 bg-white border-t lg:border border-[#EFEFEF] py-4 lg:py-8 lg:rounded-2xl">
      {/* 1 signin layer */}
      <div className="flex flex-col gap-2 px-7 pb-5 border-b border-[#EBEBEB]">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-baseline justify-start">
            <div className="flex justify-center items-center w-8 h-8 rounded-full border border-[#A9A9A9] text-[#050505] text-base">
              1
            </div>
            <div className="font-semibold text-lg capitalize">sign in</div>
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
              {getLocalStorage()?.name}
            </span>
            <span>|</span>
            <span>
              {getLocalStorage()?.Email}
            </span>
          </div>
        )}
      </div>

      {/* 2 Delivery Address layer */}
      <div className="flex flex-col gap-2 px-7 py-5 border-b border-[#EBEBEB]">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-baseline justify-start">
            <div className="flex justify-center items-center w-8 h-8 rounded-full border border-[#A9A9A9] text-[#050505] text-base">
              2
            </div>
            <div className="font-semibold text-lg capitalize">
              Delivery Address
            </div>
            {/* <div className="relative group">
              <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full border border-green-300 shadow-md cursor-pointer inline-flex items-center">
                {availability.message}
              </div>
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded shadow-lg z-10 w-max">
                Open Box Delivery
              </div>
            </div> */}
          </div>
          {addressId && (
            <div
              className="text-sm font-semibold text-[#EA002A] cursor-pointer"
              onClick={() => {
                setHandleOutlet({ handleSchedule: "selectaddress" });

                setShowAddressForms({
                  AddAddressForm: true,
                  AddressSelectionForm: false,
                  isEdit: false
                });
              }}

            >
              Add new address
            </div>
          )}
        </div>

        {addressId && (
          <div className="px-5 flex flex-col gap-2">
            <div className="flex justify-start gap-2 items-center px-2">
              <span>{selectedPickupAddress?.FullName}</span>
              <span>|</span>
              <span>{selectedPickupAddress?.PhoneNumber}</span>
            </div>
            <div className="px-2 text-sm">
              {selectedPickupAddress?.Address1 && <p>{selectedPickupAddress?.Address1},</p>}
              {selectedPickupAddress?.Address2 && <p>{selectedPickupAddress?.Address2},</p>}
              {selectedPickupAddress?.City ? <>{selectedPickupAddress?.City}&nbsp;</> : ""} {selectedPickupAddress?.ZipPostalCode && - (selectedPickupAddress?.ZipPostalCode)}
            </div>
          </div>
        )}
      </div>
      {/* payment layer */}
      <div className="flex flex-col gap-2 px-7 py-5 border-b border-[#756969]">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-baseline justify-start">
            <div className="flex justify-center items-center w-8 h-8 rounded-full border border-[#A9A9A9] text-[#050505] text-base">
              3
            </div>
            <div className="font-semibold text-lg capitalize">Payment</div>
          </div>
        </div>

        <div className="px-4 flex flex-col gap-4">
          <PaymentForm />
          <button
            // disabled={!selectedPayment.status}
            onClick={() => {
              slotHandler?.(false);
            }}
            className="w-60 py-2 disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC] text-center bg-[#EA002A] border-0 outline-0 text-white rounded-md capitalize text-lg font-semibold"
          >
            Proceed payment
          </button>
        </div>
      </div>
    </div>
  );
}

const MobileViewCheckout = ({ addressId, selectedAddress, slotHandler }: CheckoutPaymentProps) => {
  const IsUserLoggedIn = useRecoilValue(UserLoginDetails);
  const [IsAddressAdded, __] = useRecoilState(AddCheckoutAddress);
  const [selectedPayment, ___] = useRecoilState(CheckOutPayment);
  const personId = getLocalStorage()?.PersonId;
  const [handleOutlet, setHandleOutlet] = useRecoilState(ScheduleOrder);
  const [_, setShowAddressForms] = useRecoilState(ShowAddressFormForMobile);
  const availability = useRecoilValue(availabilityState);

  const selectedPickupAddress = selectedAddress.find((x: any) => x.EncryptedAddressId == addressId);

  return (
    <>
      <div className="flex flex-col gap-2 lg:hidden w-full h-fit lg:w-1/2 bg-white border-y lg:border border-[#EFEFEF] py-4 lg:py-8 lg:rounded-2xl">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold tracking-[1px]">DELIVER TO</div>
          <div className="text-sm font-semibold border border-[#EA002A] rounded-md py-1 px-2 text-[#EA002A]"
            onClick={() => {
              window.location.reload();
            }}>
            Change
          </div>
        </div>
        <div className="flex justify-start gap-2 items-center px-2">
          {addressId && (
            <div className="px-5 flex flex-col gap-2">
              <div className="flex justify-start gap-2 items-center px-2">
                <span>{selectedPickupAddress?.FullName}</span>
                <span>|</span>
                <span>{selectedPickupAddress?.PhoneNumber}</span>
              </div>
              <div className="px-2 text-sm">
                {selectedPickupAddress?.Address1 && <p>{selectedPickupAddress?.Address1},</p>}
                {selectedPickupAddress?.Address2 && <p>{selectedPickupAddress?.Address2},</p>}
                {selectedPickupAddress?.Title ? <>{selectedPickupAddress?.Title},<br /></> : ""}
                {selectedPickupAddress.City && <>{selectedPickupAddress.City}&nbsp;</>}
                {selectedPickupAddress?.ZipPostalCode && - (selectedPickupAddress?.ZipPostalCode)}.
              </div>
            </div>
          )}
        </div>
        {IsAddressAdded.status && (
          <div className="px-2 text-sm truncate">
            {IsAddressAdded.selectedAddress?.address}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 lg:hidden w-full h-fit lg:w-1/2 bg-white border-y lg:border border-[#EFEFEF] py-4 lg:py-8 lg:rounded-2xl">
        <div className="text-[#EA002A] uppercase px-2 text-sm font-semibold tracking-[1px]">
          Payment
        </div>
        <PaymentForm />
        <div className="block z-[100] lg:hidden w-60  fixed bottom-0 right-8 bg-white p-4 justify-center items-center">
          <button
            // disabled={!selectedPayment.status}
            onClick={() => {
              slotHandler?.(false);
            }}
            className="w-60 h-13 py-2 disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC] text-center bg-[#EA002A] border-0 outline-0 text-white rounded-md capitalize text-lg font-semibold"
          >
            Proceed payment
          </button>
        </div>
      </div>
    </>
  );
};
