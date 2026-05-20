import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Editicon from "./assets/Editicon.svg";
import SubmitIcon from "./assets/submiticon.svg";
import CancelIcon from "./assets/CancelIcon.svg";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import Loader from "shared/src/components/utils/Loader/Loader";
import { useRecoilState } from "recoil";
import { Reloader } from "shared/src/recoil/Reloader";
import CustomerService from "shared/src/services/Customer.Service";
import AuthServices from "shared/src/services/Auth.Services";
import { ProfileDeleteIcon } from "shared/src/components/utils/Menus/assets/profilePageAssets";
import { UserLocation } from "shared/src/recoil/sell/UserLocation";
import { getEncryptedPersonId, getLocalStorage, localStorageClearHandler } from "shared/src/components/helper/Helper";
import TrackOrderService from "shared/src/services/TrackOrder.Service";

type UserModel = {
  Username: string;
  Email: string;
  CustomerNumber: string;
};

type PersonDetailProps = {
  persons?: any; // For SSR if needed (structure matches API response)
  isSSR?: boolean;
  direction?: any;
  language?: "in_en" | "ae_en" | "ae_ar";
};

const ProfileForm = ({ persons, isSSR, direction }: PersonDetailProps) => {
  const [person, setPerson] = useState<UserModel>({
    Username: "",
    Email: "",
    CustomerNumber: "",
  });
  const router = useRouter();
  const [isEdit, setIsEdit] = useState<"Username" | "Email" | "CustomerNumber" | "">("");
  const [onFieldChange, setOnFieldChange] = useState(false);
  const [trackOrder, setTrackOrder] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [_, setUserLocation] = useRecoilState(UserLocation);
  const [reloader, setReloader] = useRecoilState(Reloader);
  const [loading, setLoading] = useState(true);

  const pattern = HelperConstant.emailPattern.pattern;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm<UserModel>({});

  const { personId } = router.query as { personId?: string };

  const onSubmit: SubmitHandler<UserModel> = (detail) => {
    // Transform frontend field names to backend expected names
    const payload = {
      FullName: detail.Username?.trim(),
      Email: detail.Email?.trim(),
      Phone: detail.CustomerNumber?.trim(),
    };

    CustomerService.customerUpdateDetails(
      personId || "",
      payload.FullName,
      payload.Email,
      payload.Phone
    )
      .then((res) => {
        if (res.status === 200) {
          setIsEdit("");
          setOnFieldChange(false);
          // Refresh data after successful update
          getMyAccount(Number(personId));
        }
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  const getMyAccount = (id: number) => {
    CustomerService.customerGetDetails(id)
      .then((res) => {
        if (res.status === 200) {
          const userData = res.data.UserDetails;
          const userLogin = userData.UserLogin?.[0] || {};

          const transformedData: UserModel = {
            Username: userData.FullName || "",
            Email: userLogin.Email || "",
            CustomerNumber: userLogin.Phone || "",
          };

          setPerson(transformedData);
          reset(transformedData);
          setLoading(false);
        } else {
          console.log("Error fetching details:", res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching customer details:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (personId) {
      const id = Number(personId);
      const userId = getLocalStorage()?.PersonId;
      // Check for active orders (to block delete)
      TrackOrderService.GetOrderByCustomerId(userId, "All").then((res) => {
        console.log("Track order response:", res);
        if (res.status === 200) {
          const hasActiveOrders = res.data.data.some(
            (order: { OrderStatusId: number }) =>
              order.OrderStatusId === 10 || order.OrderStatusId === 20
          );
          setTrackOrder(hasActiveOrders);
        }
      });

      // Fetch user profile
      if (isSSR && persons) {
        const userData = persons.UserDetails;
        const userLogin = userData.UserLogin?.[0] || {};

        const transformedData: UserModel = {
          Username: userData.FullName || "",
          Email: userLogin.Email || "",
          CustomerNumber: userLogin.Phone || "",
        };

        setPerson(transformedData);
        reset(transformedData);
        setLoading(false);
      } else {
        getMyAccount(id);
      }
    }
  }, [personId, isSSR, persons, reset]);

  const deleteAccount = () => {
    AuthServices.DeleteAccount(Number(personId))
      .then((res) => {
        if (res.status === 200 && res.data === true) {
          localStorageClearHandler();
          setUserLocation({
            UserLocation: "",
            UserLocationId: 0,
          });
          router.push("/");
        } else {
          console.log("An error occurred. Please try again.");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleKeyPress = () => {
    handleSubmit(onSubmit)();
  };

  const handleReset = () => {
    reset(person); // Reset to last known good values
    setIsEdit("");
    setOnFieldChange(false);
  };

  const DeletePopUp = () => {
    return (
      <div className="fixed inset-0 mx-auto flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[10000]">
        <div className="bg-white p-5 rounded-lg shadow-lg">
          {trackOrder ? (
            <p className="text-lg text-gray-900 font-bold text-wrap">
              Cannot delete this user. There are active orders.
            </p>
          ) : (
            <p className="text-lg text-gray-900 font-bold text-wrap">
              Are you sure you want to delete Your Profile?
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              className="border-2 border-gray-700 text-gray-800 px-4 py-2 rounded"
              onClick={() => setDeletePopup(false)}
            >
              {trackOrder ? "Ok" : "No"}
            </button>
            <button
              className="bg-[#EA002A] px-4 py-2 rounded text-white disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC]"
              onClick={deleteAccount}
              disabled={trackOrder}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* {loading && <Loader />} */}
      {deletePopup && <DeletePopUp />}
      <div className="relative py-8 overflow-hidden z-[0]" dir={direction}>
        <div className="w-[170px] h-[170px] lg:w-[211px] lg:h-[211px] bg-[#EA002A] rounded-full absolute z-[-30] right-0 blur-[300px]">
          &nbsp;
        </div>
        <div className="w-[80px] h-[80px] lg:w-[149px] lg:h-[149px] bg-[#1E54C9] rounded-full top-[200px] left-[65px] absolute z-[-30] blur-[280px]">
          &nbsp;
        </div>

        <div className="lg:px-16 px-5">
          <div className="max-w-[1300px] mx-auto flex flex-col gap-3">
            <div className="flex flex-row items-center">
              <h1 className="font-semibold text-[22px] 2xl:text-[26px] leading-[31.2px]">
                Profile
              </h1>
              <button type="button" className="ml-3" onClick={() => setDeletePopup(true)}>
                <ProfileDeleteIcon />
              </button>
            </div>

            <div className="details flex flex-col md:flex-row gap-5 mt-1">
              {/* Full Name */}
              <div className="flex flex-col gap-1 w-full">
                <div className="title font-normal text-[15px] 2xl:text-[16px]">Full Name</div>
                <div
                  className={`${
                    isEdit === "Username" ? "bg-[#FFFFFF]" : "bg-[#FAFAFA]"
                  } border-[1px] border-[#DFDFDF] rounded-md`}
                >
                  <div className="flex justify-between py-5 px-[14px]">
                    <input
                      disabled={isEdit !== "Username"}
                      id="Username"
                      className="w-full font-normal text-[14px] 2xl:text-[14px] leading-[16.8px] outline-none profile-input bg-transparent"
                      type="text"
                      {...register("Username", {
                        required: true,
                        onChange: (e: any) => {
                          setValue("Username", e.target.value);
                          setOnFieldChange(true);
                        },
                      })}
                    />
                    {isEdit === "Username" ? (
                      <div className="flex gap-3">
                        {onFieldChange && (
                          <img
                            src={SubmitIcon.src}
                            alt="Submit"
                            className="cursor-pointer"
                            onClick={handleKeyPress}
                          />
                        )}
                        <img
                          src={CancelIcon.src}
                          alt="Cancel"
                          className="cursor-pointer"
                          onClick={handleReset}
                        />
                      </div>
                    ) : (
                      <img
                        src={Editicon.src}
                        alt="Edit"
                        className="cursor-pointer"
                        onClick={() => {
                          document.getElementById("Username")?.focus();
                          setIsEdit("Username");
                        }}
                      />
                    )}
                  </div>
                </div>
                {errors.Username?.type === "required" && (
                  <p className="text-xs text-red-700">Please Enter Your Full Name</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1 w-full">
                <div className="title font-normal text-[15px] 2xl:text-[16px]">Email ID</div>
                <div
                  className={`${
                    isEdit === "Email" ? "bg-[#FFFFFF]" : "bg-[#FAFAFA]"
                  } border-[1px] border-[#DFDFDF] rounded-md`}
                >
                  <div className="flex justify-between py-5 px-[14px]">
                    <input
                      disabled={isEdit !== "Email"}
                      id="Email"
                      className="w-full font-normal text-[14px] leading-[16.8px] outline-none profile-input bg-transparent"
                      type="text"
                      {...register("Email", {
                        required: true,
                        pattern: pattern,
                        onChange: (e: any) => {
                          setValue("Email", e.target.value);
                          setOnFieldChange(true);
                        },
                      })}
                    />
                    {isEdit === "Email" ? (
                      <div className="flex gap-3">
                        {onFieldChange && (
                          <img
                            src={SubmitIcon.src}
                            alt="Submit"
                            className="cursor-pointer"
                            onClick={handleKeyPress}
                          />
                        )}
                        <img
                          src={CancelIcon.src}
                          alt="Cancel"
                          className="cursor-pointer"
                          onClick={handleReset}
                        />
                      </div>
                    ) : (
                      <img
                        src={Editicon.src}
                        alt="Edit"
                        className="cursor-pointer"
                        onClick={() => {
                          document.getElementById("Email")?.focus();
                          setIsEdit("Email");
                        }}
                      />
                    )}
                  </div>
                </div>
                {errors.Email?.type === "pattern" && (
                  <p className="text-xs text-red-700">Please Enter a Valid Email</p>
                )}
                {errors.Email?.type === "required" && (
                  <p className="text-xs text-red-700">Please Enter an Email</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col gap-1 w-full">
                <div className="title font-normal text-[15px] 2xl:text-[16px]">Mobile Number</div>
                <div
                  className={`${
                    isEdit === "CustomerNumber" ? "bg-[#FFFFFF]" : "bg-[#FAFAFA]"
                  } border-[1px] border-[#DFDFDF] rounded-md`}
                >
                  <div className="flex justify-between py-5 px-[14px]">
                    <input
                      disabled={isEdit !== "CustomerNumber"}
                      id="CustomerNumber"
                      className="w-full font-normal text-[14px] leading-[16.8px] outline-none profile-input bg-transparent"
                      type="text"
                      {...register("CustomerNumber", {
                        required: "Please Enter a Mobile Number",
                        pattern: {
                          value: /^[6-9]\d{8,9}$/,
                          message:
                            "Please enter a valid 9 or 10 digit mobile number starting with 6-9",
                        },
                        onChange: (e: any) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length > 10) value = value.slice(0, 10);
                          setValue("CustomerNumber", value);
                          setOnFieldChange(true);
                        },
                      })}
                    />
                    {isEdit === "CustomerNumber" ? (
                      <div className="flex gap-3">
                        {onFieldChange && (
                          <img
                            src={SubmitIcon.src}
                            alt="Submit"
                            className="cursor-pointer"
                            onClick={handleKeyPress}
                          />
                        )}
                        <img
                          src={CancelIcon.src}
                          alt="Cancel"
                          className="cursor-pointer"
                          onClick={handleReset}
                        />
                      </div>
                    ) : (
                      <img
                        src={Editicon.src}
                        alt="Edit"
                        className="cursor-pointer"
                        onClick={() => {
                          document.getElementById("CustomerNumber")?.focus();
                          setIsEdit("CustomerNumber");
                        }}
                      />
                    )}
                  </div>
                </div>
                {errors.CustomerNumber?.type === "required" && (
                  <p className="text-xs text-red-700">{errors.CustomerNumber.message}</p>
                )}
                {errors.CustomerNumber?.type === "pattern" && (
                  <p className="text-xs text-red-700">{errors.CustomerNumber.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {load && <Loader />} */}
    </>
  );
};

export default ProfileForm;