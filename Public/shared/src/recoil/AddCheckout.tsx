import { atom } from "recoil";

export type Address = {
  id: string;
  username: string;
  number: string;
  alternateNumber: string;
  pincode: string;
  landmark: string;
  city: string;
  address: string;
};

type CheckoutAddressState = {
  status: boolean;
  address: Address[];
  selectedStatus: boolean;
  selectedAddress: Address | undefined;
};

type ScheduleOrder = {
  handleSchedule: "selectaddress" | "CheckOutPayment" | "orderstatus" | "deviceDetails" | "";
}

export const ScheduleOrder = atom<ScheduleOrder>({
  key: 'ScheduleOrder',
  default: {
    handleSchedule: "selectaddress"
  }
})

export const AddCheckoutAddress = atom<CheckoutAddressState>({
  key: "AddCheckoutAddress",
  default: {
    status: false,
    address: [],
    selectedStatus: false,
    selectedAddress: undefined,
  },
});

export const ShowAddressFormForMobile = atom({
  key: "ShowAddressFormForMobile",
  default: {
    AddAddressForm: false,
    AddressSelectionForm: false,
    isEdit: false
  },
});

export const checkoutloadingState = atom<boolean>({
  key: "checkoutloadingState",
  default: false,
});

export const AssignedMediaState = atom<string | null>({
  key: "AssignedMediaState",
  default: null,
});