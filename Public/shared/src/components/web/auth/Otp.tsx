import { useEffect, useRef, useState } from "react";
import { HelperConstant } from "../../helper/HelperConstant";
import OtpInput from 'react-otp-input';
import { useRecoilState } from "recoil";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginModalHandler } from "shared/src/recoil/userAuth";
import { IloginModel } from "shared/src/models/Login.Model";
import AuthServices from "shared/src/services/Auth.Services";
import { AddCartModel } from "shared/src/models/Cart.Model";
import CartService from "shared/src/services/Cart.Service";
import { getProductIdwithoutLogin } from "../../helper/Helper";
import { jwtDecode } from "jwt-decode";
import { ITokenModel } from "shared/src/models/LocalStorage.Model";
import { Reloader } from "shared/src/recoil/Reloader";
import { useRouter } from "next/router";
import BuyOrderServices from "shared/src/services/BuyOrder.Services";

function Otp({ setIsOTP, isSell }: { setIsOTP: any; isSell: any }) {

  const [counter, setCounter] = useState(HelperConstant.otpVerificationTime.timer);
  const [OTP, setOTP] = useState("");
  const [__, setLoginHandler] = useRecoilState(LoginModalHandler);
  const [___, setOpenLoginWitSelectedProduct] = useRecoilState(LoginModalHandler);
  const [authError, setAuthError] = useState<string | null>(null);
  const [AuthorizedUser, setAuthorizedUser] = useState<boolean>(false);
  const productId = getProductIdwithoutLogin() as string;
  const { register, handleSubmit, formState: { errors, isSubmitting }, clearErrors, setValue } = useForm<IloginModel>({ defaultValues: { "UserName": "" } });
  const [reload, setReload] = useRecoilState(Reloader);
  const navigate = useRouter();
  const inputRefs: any = Array.from({ length: 6 }, () => useRef(null));
  const PhoneNumber = localStorage.getItem("PhoneNumber");
  const maskedPhoneNumber = PhoneNumber ? `${PhoneNumber.slice(0, 2)}******${PhoneNumber.slice(-2)}` : "";
  const otpRef = useRef("");

  const handleInputChange = (index: any, event: any) => {
    const value = event.target.value;
    if (value.length > 0) {
      if (index < 5) {
        inputRefs[index + 1].current?.focus();
      } else {
        setIsOTP(2);
      }
    }
  };
  const resendOtp = () => {
    setCounter(HelperConstant.otpVerificationTime.timer)
  }
  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [counter]);

  const handleOTPChange = (otp: any) => {
    setOTP(otp);
    otpRef.current = otp;
    setAuthError(null);
    if (otp.length === 6) {
      handleSubmit(onSubmit)();
    }
  }

  const signinhandler = () => {
    setLoginHandler({
      handler: "register",
      isOpen: true
    })
  }

  const onSubmit: SubmitHandler<IloginModel> = async data => {

    const PhoneNumber = localStorage.getItem("PhoneNumber");
    const otpToSubmit = otpRef.current || "123456";
    try {
      const res = await AuthServices.otpauthenticate(PhoneNumber, otpToSubmit);
      if (res.status === 200) {
        if (res.data === "not valid user" || res.data === "Invalid Credentials") {
          setAuthorizedUser(true);
          setAuthError("Invalid OTP. Please try again.");
          return;
        } else {
          localStorage.setItem("token", JSON.stringify(res.data.token.Token));
          if (productId) {
            addCartItem(res.data.token.Token);
          } else if (localStorage.getItem("redirectToCheckout") === "true") {
            localStorage.removeItem("redirectToCheckout");
            buyNow(res.data.token.Token);
            navigate.push('/buy/checkout');
          }
          setOpenLoginWitSelectedProduct({
            handler: "login",
            isOpen: false,
          });
          setLoginHandler({
            handler: "otp",
            isOpen: false
          })
          localStorage.setItem("PhoneNumber", "");
        }
      }
    } catch (error) {
      console.log(error);
      setAuthError("An error occurred during login. Please try again.");
    }
  };

  const buyNow = async (data: any) => {
    let tokendata: ITokenModel = jwtDecode(data);
    const OrderItem = JSON.parse(localStorage.getItem("BuyWithoutLogin") as any);
    OrderItem.EncryptedCustomerId = tokendata.PersonId as string;
    try {
      if (OrderItem) {
        const res = await BuyOrderServices.BulkOrder([OrderItem])
        if (res.status === 200) {
          localStorage.setItem("orderId", res.data);
          localStorage.removeItem("BuyWithoutLogin");
          setReload(true);
          navigate.push("/buy/checkout");
        }
      }
    } catch (error) {
      console.error("Error Buy item:", error);
    }
  }

  const addCartItem = async (data: any) => {
    let tokendata: ITokenModel = jwtDecode(data);
    
    // Get the stored cart item (from guest flow)
    const localStorageItem = JSON.parse(localStorage.getItem("cartItem") || "{}");
    
    // New payload structure
    const payload: AddCartModel = {
      userId: parseInt(tokendata.PersonId || "0"),
      skuId: [parseInt(localStorageItem?.EncryptProductId || "0")],  // assuming EncryptProductId was actually SkuID in guest flow
      quantity: 1
    };
  
    try {
      const res = await CartService.addCartItem(payload);
      if (res.status === 200) {
        localStorage.removeItem("ProductId");
        localStorage.removeItem("cartItem");
        setReload(true);
        navigate.push("/cart");
      }
    } catch (error) {
      console.error("Error adding cart item:", error);
    }
  };

  return (
    <>
      <div className="lg:w-full flex lg:justify-center lg:items-center flex-col relative top-3 opacity-0 animate-[opacity_0.4s_forwards_ease-in-out]">
        <div className="bg-white border border-[#efefef] rounded-xl overflow-hidden">
          <div className="overflow-hidden relative lg:px-8 px-4 lg:py-8 py-4">
            <h1 className="lg:text-4xl text-2xl font-semibold">Sign in</h1>
            <h5 className="text-xs lg:text-base mt-1 lg:mt-2 color-[#050505]">
              Proceed to sign in by using your mobile number
            </h5>
            <div className="absolute right-0 top-[-32px] left-[80%]">
              <svg
                width="100"
                height="146"
                viewBox="0 0 100 146"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="134.566"
                  cy="116.501"
                  r="132.579"
                  transform="rotate(72.8457 134.566 116.501)"
                  stroke="url(#paint0_linear_109_77655)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_109_77655"
                    x1="34.6533"
                    y1="29.6197"
                    x2="117.842"
                    y2="258.334"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EA002A" />
                    <stop offset="1" stopColor="#EA002A" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="w-[100px] lg:block hidden h-[100px] bg-[#1E54c9] rounded-[50%] absolute left-20 bottom-[60px] blur-[220px]"></div>
            <div className="w-[120px] h-[100px] bg-[#EA002A] rounded-[50%] absolute right-10 bottom-[40px] blur-[100px] overflow-hidden"></div>
          </div>
          <div className="lg:w-[100%] flex flex-col px-4 lg:px-8 py-5">
            <h2 className="lg:text-2xl font-semibold">Enter OTP</h2>
            <h3>Check for Otp in Registered Email </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row lg:gap-4 gap-3 mt-4">
                <OtpInput
                  shouldAutoFocus={true}
                  inputType="number"
                  value={OTP}
                  onChange={handleOTPChange}
                  numInputs={6}
                  renderSeparator={<span> </span>}
                  renderInput={(props) => <input {...props} className="otp-field" id="Otp"
                  />}
                />
              </div>
              {authError && <p className="text-xs text-red-700 mt-2">{authError}</p>}
              {/* <button className="mt-4 py-2 lg:py-3 text-lg w-full disabled:cursor-not-allowed disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC] bg-[#EA002A] border-0 outline-0 text-white rounded-lg text-center"
                type="submit" disabled={isSubmitting} >verify OTP</button> */}
            </form>
            <div className="flex justify-end text-[#888888] mt-2">
              {counter == 0 ?
                <p className="text-[#EA002A] hover:underline cursor-pointer font-semibold" onClick={resendOtp}>Resend OTP</p>
                :
                <p className="text-sm ">Resend the OTP in {counter} sec</p>}
            </div>
          </div>

          {isSell && (
            <div className="w-[100%] px-4 lg:px-8 pb-5">
              <h4 className="text-base lg:text-lg font-medium text-[#EA002A]">
                Unlock the exact price by signing in
              </h4>
              <div className=" lg:flex flex mt-4 items-start">
                <div className="lg:w-[80px] w-[100px] px-2 py-2 border flex border-[#efefef] bg-[#EDEDED] rounded-md">
                  <img
                    src={''}
                    alt="pic"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col px-4">
                  <span className="text-sm lg:text-lg font-semibold ">
                    Apple iphone 15 Pro Max(8gb / 12bg)
                  </span>
                  <span className="text-xs lg:text-sm mt-1">
                    Instantly sell and get
                  </span>
                  <span className="text-lg lg:text-2xl">$XX,XXX</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Otp;
