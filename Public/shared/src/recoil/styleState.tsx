import { atom } from "recoil";

// this is for container zindex weather we need to pop some component globaly
// need to increase the z index to show to component all the above
export const containerZindex = atom({
  key: "containerZindex",
  default: "z-10",
});


export const MenuContentZindex = atom({
  key: "MenuContentZindex",
  default: {
    Z_Index: "z-50"
  },
})

export const HeaderZIndex = atom({
  key: "headerZIndex",
  default: {
    Z_Index: "z-[51]"
  },
})