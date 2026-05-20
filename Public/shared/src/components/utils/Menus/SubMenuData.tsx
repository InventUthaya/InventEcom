import {
  BuyIcon,
  MenuCloseIcon,
  MenuIcon,
  ProfileIcon,
  SearchIcon,
  SellIcon,
  ShoppingIcon,
} from "./assets";

import chennai from "./assets/chennai.png";
import kerala from "./assets/kerala.png";
import pondy from "./assets/pondy.png";
import telungana from "./assets/telungana.png";
import karnataka from "./assets/karnataka.png";
import { getLocalStorage } from "../../helper/Helper";

export const getMenuDataSell = (PersonId: any) => [
  { id: 1, value: "Buy", icon: BuyIcon, link: "/buy/home" },
  { id: 2, value: "Search", icon: SearchIcon, link: "#search-bar" },
  { id: 3, value: "Profile", icon: ProfileIcon, link: `/profile/${PersonId}` },
  {
    id: 4,
    value: "More",
    icon: MenuIcon,
    active: MenuCloseIcon,
    link: "#more",
  },
];

export const getMenuDataBuy = (PersonId: any) => [
  { id: 1, value: "Buy", icon: BuyIcon, link: "/" },
  { id: 2, value: "Search", icon: SearchIcon, link: "#search-bar" },
  { id: 3, value: "Profile", icon: ProfileIcon, link: `/profile/${PersonId}` },
  { id: 4, value: "Cart", icon: ShoppingIcon, link: "/cart" },
];

export const subMenudata = [
  {
    title: "Order",
    link: "/myorder",
  },
  {
    title: "Track Order",
    link: "/trackorder",
  },
  {
    title: "Blogs",
    link: "/blog",
  },
  {
    title: "Bulk Order",
    link: "/corporate",
  },
  {
    title: "Cart",
    link: "/cart",
  },
  {
    title: "More",
    items: {
      title: "",
      list: [
        {
          title: "About Us",
          link: "/about-us",
        },
        {
          title: "FAQ",
          link: "/faq",
        },
        {
          title: "Contact Us",
          link: "/contact-us",
        },
        {
          title: "Terms & Conditions",
          link: "/terms-of-use",
        },
      ],
    },
  },
];

export const StateList = [
  "tamil Nadu",
  "kerala",
  "karnataka",
  "telangana",
  "pondicherry",
  "kerala",
  "karnataka",
  "telangana",
  "pondicherry",
  "",
];




export const StateLists = [
  {
    title: "Chennai",
    image: chennai,
  },
  {
    title: "kerala",
    image: kerala,
  },
  {
    title: "pondy",
    image: pondy,
  },
  {
    title: "telungana",
    image: telungana,
  },
  {
    title: "Karnataka",
    image: karnataka,
  },
];
// sell menu data -------------------------END
export const ShopDetails = [
  [
    {
      title: "Shop by Price",
      list: [
        "Under ₹10,000",
        "Under ₹15,000",
        "Under ₹20,000",
        "Under ₹30,000",
        "Under ₹50,000",
        "Above ₹50,000",
      ],
    },
    {
      title: "Shop by Quality",
      list: ["Just_unbox", "Like_New", "Superb", "Good"],
    },
  ],
];

export const BuyMenuDropDown = [
  { title: "Mobiles", list: ShopDetails[0] },
  { title: "Computer", list: ShopDetails[1] },
  { title: "Smartwatch", list: ShopDetails[2] },
];
