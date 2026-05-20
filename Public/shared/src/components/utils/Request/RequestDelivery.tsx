import { useEffect, useRef, useState } from "react";
import man from "./assets/man.png";
import { ISEOModel } from "shared/src/models/SEO.Model";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { SubmitHandler, useForm } from "react-hook-form";
import { getDatalocalization, isIn, onKeyDown, restrictInput } from "shared/src/components/helper/Helper";
import { IFindLocation } from "shared/src/models/PublicRequest.Model";
import Image from "next/image";
import Language from "shared/src/Languages/RequestLanguage.json";
import router from "next/router";
import arrow from "/public/assets/images/test/arrow.png";
import CantFindServices from "shared/src/services/CantFind.Services";
import CategoryService from "shared/src/services/CategoryService";

class RequestPickup {
  address?: { Address: string, Email: string, Phone: string, Timing: string, PromotionLinks: { faceBook: string, instagram: string, linkedIn: string, tikTok: string, youTube: string, Twitter: string } } =
    {
      Address: "", Email: "", Phone: "", Timing: "",
      PromotionLinks: {
        faceBook: "",
        instagram: "",
        linkedIn: "",
        youTube: "",
        tikTok: "",
        Twitter: ""
      }
    };
  direction?: string = "";
  language?: "in_en" | "ae_en" | "ae_ar" = "in_en";
  metaTags?: ISEOModel = {} as ISEOModel;
  isSSR?: boolean
}

const RequestDelivery = ({ address, direction, language, metaTags, isSSR }: RequestPickup) => {
  const { register, handleSubmit, formState: { errors }, clearErrors, setValue, reset, resetField } = useForm<IFindLocation>({});
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Array<any>>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brand, setBrand] = useState<Array<any>>([]);
  const pattern = HelperConstant.emailPattern.pattern;
  const formRef: any = useRef(null);

  let dataLocalization = Language[getDatalocalization(language)];
  const [partnerdata, setPartnerData] = useState<RequestPickup>({
    address, direction, language, metaTags,
  });

  const onPickupSubmit: SubmitHandler<IFindLocation> = (data: any) => {
    setDisabled(true);
    data.published = true;
    data.CityId = '';
    data.ModelVariant = '';
    data.BrandSeriesName = '';

    CantFindServices.createLocationRequest(data).then((res: any) => {
      if (res.status === 200) {
        setShowConfirmationPopup(true);
      }
      setDisabled(false);
    }).catch((e: string) => {
      console.log(e);
    });
  }

  const handleClosePopup = () => {
    setShowConfirmationPopup(false);
    router.push('/');
    reset();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setValue("ProductTypeId", categoryId);
    setSelectedBrand("");
    getBrand(categoryId);
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    setValue("BrandName", brandId);
  };

  const getBrand = (categoryId: any) => {
    CategoryService.getParentCategory(categoryId).then((res: any) => {
      if (res.status === 200) {
        setBrand(res.data);
      }
    }).catch((e: string) => {
      console.log(e);
    })
  };

  const getCategory = () => {
    CategoryService.getCategoryList().then((res: any) => {
      if (res.status === 200) {
        const allCategories = res.data;
        setFilteredCategories(allCategories);
      }
    }).catch((e: string) => {
      console.log(e);
    })
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
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

        .backdrop-blur-sm {
            backdrop-filter: blur(5px);
        }

        @keyframes slide-down {
            from {
            transform: translateY(-100%);
            opacity: 0;
            }
            to {
            transform: translateY(0);
            opacity: 1;
            }
        }

        .animate-slide-down {
            animation: slide-down 0.5s ease-out forwards;
        }
        `}
      </style>

      <div dir={direction}
        className={`flex flex-col lg:flex-row  rounded-[12px] border border-[#EFEFEF]  bg-white ${showConfirmationPopup ? "blur-sm" : ""
          }`}
        ref={formRef}
      >
        <div className="relative w-full lg:w-1/2 px-8 py-10 overflow-hidden  bg-white">
          <h2 className="lg:text-2xl 2xl:text-3xl text-base font-semibold">
            {dataLocalization.Request_a_pick_up}
          </h2>
          <p className="font-light lg:text-md 2xl:text-base sm:text-base text-sm lg:mt-2">
            {dataLocalization.Fill_the_form_our_executiv_will_contact_you_and_pickup_your_device}
          </p>
          <div className="absolute lg:left-0 lg:top-[27%] left-[-50px] bottom-100">
            <svg
              className="lg:w-[267px] lg:h-[468px] w-[140px] h-[140px]"
              viewBox="0 0 267 458"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="-60.705"
                cy="327.298"
                r="325.851"
                transform="rotate(-170.882 -60.705 327.298)"
                stroke="url(#paint0_linear_109_146104)"
                strokeWidth="2"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_109_146104"
                  x1="-305.179"
                  y1="114.713"
                  x2="-101.628"
                  y2="674.345"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#EA002A" />
                  <stop offset="1" stopColor="#EA002A" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute lg:right-0 lg:top-[50%] top-[12px] right-[-40px]">
            <svg
              className="lg:w-[211px] lg:h-[289px] w-[140px] h-[140px] "
              viewBox="0 0 211 289"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="227.566"
                cy="227.501"
                r="226.404"
                transform="rotate(64.3948 227.566 227.501)"
                stroke="url(#paint0_linear_109_146100)"
                strokeWidth="2"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_109_146100"
                  x1="57.4754"
                  y1="79.5954"
                  x2="199.095"
                  y2="468.956"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#EA002A" />
                  <stop offset="1" stopColor="#EA002A" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="w-[200px] lg:block hidden h-[200px] bg-[#1E54c9] rounded-[50%] absolute left-0 bottom-[-150px] blur-[500px]"></div>
          <div className="w-[200px] h-[200px] bg-[#EA002A] rounded-[50%] absolute right-[-120px] bottom-[70px] blur-[221px]"></div>

          <div className="bg-[#ffffff] w-full lg:flex justify-between gap-4 border-2-green absolute right-0 lg:py-6 py-4 px-4 bottom-0">
            <div className={`w-full ${direction == "rtl" ? "mr-60" : "mr-40"}  flex flex-col `}>
              <h3 className="text-base lg:text-lg">{dataLocalization.We_ll_Cover_Your}</h3>
              <span className="text-base lg:text-md 2xl:text-lg">
                {dataLocalization.Location} <b className="text-[#EA002A]">{dataLocalization.Soon}</b>
              </span>
            </div>
          </div>
          <div className="lg:absolute lg:right-[-4px] lg:bottom-0 relative right-[-140px] bottom-[-40px]">
            <Image height={1000} width={1000} src={man.src} alt="" className="lg:w-[200px] w-[170px]" />
          </div>
        </div>

        <div className="lg:w-[50%] flex flex-col  px-2 lg:px-12 py-10">
          <form onSubmit={handleSubmit(onPickupSubmit)}>
            <div className="flex flex-col gap-2">
              <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.Name} <span className="text-red-600">*</span></label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                {...register("Name", { required: true })} onChange={() => { clearErrors("Name"); }}
              />
              {errors.Name?.type === "required" && <p className="text-xs text-red-700">{dataLocalization.Enter_Your_Name}</p>}
              <div className="flex flex-col">
                <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.Mobile_number} <span className="text-red-600">*</span></label>
                <div className="flex items-center justify-start mt-2  bg-white border border-[#DFDFDF] px-2 rounded-lg">
                  <div className="flex items-center">
                    <input
                      placeholder="+91"
                      className="w-[40px] py-3 bg-transparent outline-0 border-0 text-sm"
                      value={"+91"}
                    />
                    <Image
                      height={1000} width={1000}
                      src={arrow.src}
                      alt=""
                      className="w-[8px] h-[10px] object-contain"
                    />
                  </div>
                  <input
                    inputMode="numeric"
                    placeholder="Enter your mobile number"
                    className="flex-1 lg:w-[400px] 2xl:w-[460px] h-[40px] p-2 w-[300px] bg-transparent outline-0 border-0 rounded-lg px-5 py-6 outline-none border-[#DFDFDF] text-xs 2xl:text-smrounded-lg 2xl:text-sm"
                    {...register("MobileNumber", { required: true, minLength: 9, maxLength: 9, onChange: (e: any) => { restrictInput(e, 10); setValue("MobileNumber", HelperConstant.numberOnlyRegex.regex.test(e.target.value) ? e.target.value : ""); clearErrors("MobileNumber"); } })}
                    onKeyDown={onKeyDown} />
                </div>
                {errors.MobileNumber?.type === "required" && <p className="text-xs text-red-700 mt-2">{dataLocalization.Enter_Your_Mobile_Number}</p>}
                {(errors.MobileNumber?.type === "minLength" || errors.MobileNumber?.type === "maxLength") && <p className="text-xs text-red-700 mt-2">{dataLocalization.Enter_Your_valid_Mobile_Number}</p>}
              </div>
              <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.Email} <span className="text-red-600">*</span></label>
              <input
                type="email"
                placeholder="Enter your Email-id"
                className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                {...register("Email", { required: true, pattern: pattern })}
                onChange={() => { clearErrors("Email"); }}
              />
              {errors.Email?.type === "required" && <p className="text-xs text-red-700 mt-2">{dataLocalization.Enter_Your_Email_Address}</p>}
              {(errors.Email?.type === "pattern") && <p className="text-xs text-red-700 mt-2">{dataLocalization.Enter_Your_valid_Email_Address}</p>}

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col flex-grow">
                  <label
                    htmlFor="Category"
                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize mb-2"
                  >
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="Category"
                    value={selectedCategory}
                    className="border text-xs 2xl:text-sm border-[#DFDFDF] bg-transparent rounded-md block w-full p-2.5"
                    {...register("ProductTypeId", { required: true })}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="" disabled>Select Category</option>
                    {filteredCategories.map((category) => (
                      <option key={category.Id} value={category.Id}>{category.Name}</option>
                    ))}
                  </select>
                  {errors.ProductTypeId && (
                    <p className="text-xs text-red-700 font-semibold">Please select a category</p>
                  )}
                </div>
                <div className="flex flex-col flex-grow">
                  <label
                    htmlFor="Brand"
                    className="text-sm lg:text-md 2xl:text-base font-semibold capitalize mb-2"
                  >
                    Brand <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="Brand"
                    value={selectedBrand}
                    disabled={!selectedCategory}
                    className="border text-xs 2xl:text-sm border-[#DFDFDF] bg-transparent rounded-md block w-full p-2.5"
                    {...register("BrandName", { required: true })}
                    onChange={(e) => handleBrandChange(e.target.value)}
                  >
                    <option value="" disabled>Select Brand</option>
                    {brand.map((b) => (
                      <option key={b.Id} value={b.Id}>{b.Name}</option>
                    ))}
                  </select>
                  {errors.BrandName && (
                    <p className="text-xs text-red-700 font-semibold">Please select a brand</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold capitalize text-sm 2xl:text-md mb-2">BrandModel <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  placeholder="Enter Brand Model Name"
                  className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                  {...register("BrandModelName", { required: true })}
                  onChange={() => clearErrors("BrandModelName")}
                />
                {errors.BrandModelName && (
                  <p className="text-xs text-red-700 mt-2">Please enter the brand model name</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col flex-grow w-full lg:w-1/3">
                  <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.State_Name} <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    placeholder={dataLocalization.Enter_Your_City}
                    className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                    {...register("StateName", { required: true })}
                    onChange={() => { clearErrors("StateName"); }}
                  />
                  {errors.StateName?.type === "required" && <p className="text-xs text-red-700 mt-2">{dataLocalization.Enter_Your_City}</p>}
                </div>

                <div className="flex flex-col flex-grow w-full lg:w-1/3">
                  <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.City_Name} <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    placeholder={dataLocalization.Enter_Your_Area_District}
                    className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                    {...register("CityName", { required: true })}
                    onChange={() => { clearErrors("CityName"); }}
                  />
                  {errors.CityName?.type === "required" && <p className="text-xs text-red-700 mt-2">{dataLocalization.Enter_Your_Area_District}</p>}
                </div>
              </div>

              <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.Area} <span className="text-red-600">*</span></label>
              <input
                type="text"
                placeholder="Write Your Area.."
                className="w-[100%] h-[50px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                multiple {...register("Area", { required: true, maxLength: 200 })} onChange={() => { clearErrors("Area"); }}
              />
              {errors.Area?.type === "required" && <p className="text-xs text-red-700">{dataLocalization.Enter_Your_Area}</p>}
              {(errors.Area?.type === "maxLength") && <p className="text-xs text-red-700">{dataLocalization.Your_Area_Must_Be_Within_200_words}</p>}

            </div>
            <button
              type="submit"
              disabled={disabled}
              className=" w-full p-[8px] 2xl:p-[10px] bg-[#EA002A] text-white rounded-[8px] mt-4"
            >
              {dataLocalization.Submit}
            </button>
          </form>
        </div >
      </div >
      {showConfirmationPopup && (
        <div className="fixed inset-0 flex items-center mt-10 justify-center z-[51]">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm "></div>
          <div className="bg-white p-10 rounded-lg animate-slide-down z-10 relative">
            <div className="flex items-center justify-center text-center">
              <div className="rounded-full bg-[#e0f1e4] w-fit px-4 py-5 ">
                <div className="flex items-center justify-center">
                  <svg
                    width="33"
                    height="24"
                    viewBox="0 0 33 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30.4524 1.96484L10.9612 21.4561L2.10156 12.5964"
                      stroke="url(#paint0_linear_1595_4092)"
                      strokeWidth="3.89825"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_1595_4092"
                        x1="16"
                        y1="-7.5"
                        x2="14"
                        y2="35.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#22C446" />
                        <stop offset="1" stopColor="#18782D" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="absolute left-0">
                <svg
                  width="86"
                  height="143"
                  viewBox="0 0 86 143"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="-71.0276"
                    cy="-13.9626"
                    r="155.718"
                    transform="rotate(30.918 -71.0276 -13.9626)"
                    stroke="url(#paint0_linear_1595_4086)"
                    stroke-width="2"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_1595_4086"
                      x1="-188.248"
                      y1="-115.893"
                      x2="-103.519"
                      y2="136.899"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#249B3E" />
                      <stop
                        offset="0.936081"
                        stop-color="#249B3E"
                        stop-opacity="0"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="absolute right-0 top-14">
                <svg
                  width="29"
                  height="191"
                  viewBox="0 0 29 191"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="95.217"
                    cy="95.2732"
                    r="94.1777"
                    transform="rotate(38.0927 95.217 95.2732)"
                    stroke="url(#paint0_linear_1595_4085)"
                    stroke-width="2"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_1595_4085"
                      x1="24.0271"
                      y1="33.3689"
                      x2="75.4844"
                      y2="186.894"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#249B3E" />
                      <stop
                        offset="0.936081"
                        stop-color="#249B3E"
                        stop-opacity="0"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="flex flex-col items-center mt-5 py-4">
              <p className="text-[#000000] text-2xl font-semibold">
                {dataLocalization.Thanks_For_Your_Interest}
              </p>
              <p className="font-normal py-2">
                {dataLocalization.We_got_your_response_our_team_will_get_back_you_shortly}
              </p>
              <button
                onClick={handleClosePopup}
                className="mt-4 px-40 py-4 bg-[#EA002A] text-white rounded-lg"
              >
                {dataLocalization.Done}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestDelivery;
