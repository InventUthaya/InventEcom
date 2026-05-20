import sideleft from "./assets/sideleft.png";
import start from "./assets/star.png";
import { ContactIcon, SearchMenuIcon } from "../../utils/Menus/assets";
import Link from "next/link";

export default function MobileBuyMenuPhone({
  isBack = true,
}: {
  isBack: boolean;
}) {
  return (
    <div className="flex justify-center items-center px-5 py-4 z-30 bg-[#F9FAFA] border-b border-b-neutral-200 w-full">
      <div className="flex gap-2 justify-between items-center w-full">
        <div className="flex flex-1 gap-2 items-center text-base">
          {isBack && (
            <img src={sideleft.src} alt="" className="w-2 mr-1 mt-[1px]" />
          )}
          <Link href={"/"} className="cursor-pointer">
            <img src={start.src} alt="" className="w-7 mr-1 mt-[1px]" />
          </Link>

          <div className="flex flex-col flex-1 px-3 py-[6px] text-[#A9A9A9] rounded-md bg-white border border-[#F0F0F0]">
            <div className="flex gap-3 w-full justify-start items-center">
              <SearchMenuIcon />
              <input
                className="grow focus:border-0 focus:outline-0 w-full text-sm block"
                placeholder="Search mobile"
                id="search-bar"
              />
            </div>
          </div>
        </div>
        <Link href={"/contact-us"} className="cursor-pointer">
          <div className="rounded-lg px-3 py-2 border border-[#EFEFEF] bg-[#fff] block cursor-pointer">
            <ContactIcon />
          </div>
        </Link>
      </div>
    </div>
  );
}
