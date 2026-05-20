import { atom } from "recoil";

// this is for container zindex weather we need to pop some component globaly
// need to increase the z index to show to component all the above
export const CheckOutPayment = atom({
  key: "CheckOutPayment",
  default: {
    status: true,
    method: "COD",
  },
});
