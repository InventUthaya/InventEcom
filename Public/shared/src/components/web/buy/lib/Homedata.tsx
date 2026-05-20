import {
  MobileIcon,
  deskTopIcon,
  gamingConsoleIcon,
  laptopIcon,
  televisionIcon,
  watchIcon,
} from "../assets/Devices";
import { apple, nothing, oneplus, oppo, realme, redmi, samsung, vivo } from "../home/BrandScroll/scroll";

// import apple from "/images/brands/apple.png";
// import samsung from "/images/brands/samsung.png";
// import oneplus from "/images/brands/oneplus.png";
// import redmi from "/images/brands/mi.png";
// import nothing from "/images/brands/nothing.png";
// import vivo from "/images/brands/vivo.png";
// import oppo from "/images/brands/oppo.png";
// import realme from "/images/brands/realme.png";

export const cardsDevices = [
  { id: "Mobile Phones", img: MobileIcon, text: "Mobile Phones" },
  { id: "Laptops", img: laptopIcon, text: "Laptops" },
  { id: "Desktop", img: deskTopIcon, text: "Desktop" },
  { id: "Watches", img: watchIcon, text: "Watches" },
  { id: "Television", img: televisionIcon, text: "Television" },
  { id: "Gaming Console", img: gamingConsoleIcon, text: "Gaming Console" },
];

export const cardsBrands = [
  { id: "1", img: apple, text: null, title: "apple" },
  { id: "2", img: samsung, text: null, title: "samsung" },
  { id: "3", img: oneplus, text: null, title: "oneplus" },
  { id: "4", img: redmi, text: null, title: "redmi" },
  { id: "5", img: nothing, text: null, title: "nothing" },
  { id: "6", img: vivo, text: null, title: "vivo" },
  { id: "7", img: oppo, text: null, title: "oppo" },
  { id: "8", img: realme, text: null, title: "realme" },
];
