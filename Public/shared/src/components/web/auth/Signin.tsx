import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { LoginModalHandler, NewUser, SignupPhoneNumber, UserLoginDetails } from "../../../recoil/userAuth";
import { IloginModel } from "shared/src/models/Login.Model";
import { SubmitHandler, useForm } from "react-hook-form";
import { HelperConstant } from "../../helper/HelperConstant";
import AuthServices from "shared/src/services/Auth.Services";
import { getProductIdwithoutLogin } from "../../helper/Helper";
import { Reloader } from "shared/src/recoil/Reloader";
import { useRouter } from "next/router";

function Signin({ setIsOTP, isSell }: { setIsOTP: any; isSell: any }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, clearErrors, setValue } = useForm<IloginModel>({ defaultValues: { "UserName": "" } });
  const [authError, setAuthError] = useState<string | null>(null);
  const pattern = HelperConstant.emailPattern.pattern;

  const user = useRecoilValue(NewUser);
  const [, setUserName] = useRecoilState(NewUser);
  const [_, setIsUserLoggedIn] = useRecoilState(UserLoginDetails);
  const [__, setLoginHandler] = useRecoilState(LoginModalHandler);
  const [____, setSignupPhoneNumber] = useRecoilState(SignupPhoneNumber);
  const productId = getProductIdwithoutLogin() as string;
  const [___, setOpenLoginWitSelectedProduct] = useRecoilState(LoginModalHandler);
  const [reload, setReload] = useRecoilState(Reloader);
  const navigate = useRouter();

  const onSubmit: SubmitHandler<IloginModel> = async data => {
    setAuthError(null);
    const userName = data.UserName;
    const PhoneNumber = data.PhoneNumber ?? "";

    try {
      const res = await AuthServices.signIn(PhoneNumber);
      if (res.status === 200) {
        if (res.data === "User not registered." || res.data === "Invalid Credentials") {
          setSignupPhoneNumber({
            PhoneNumber: PhoneNumber
          })
          setLoginHandler({
            handler: "register",
            isOpen: true
          })
          return;
        } else {
          localStorage.setItem("PhoneNumber", PhoneNumber);
          setOpenLoginWitSelectedProduct({
            handler: "login",
            isOpen: false,
          });
          setLoginHandler({
            handler: "otp",
            isOpen: true
          })
        }
      }
    } catch (error) {
      console.log(error);
      setAuthError("An error occurred during login. Please try again.");
    }
  };

  const signup = () => {
    setLoginHandler({
      handler: "register",
      isOpen: true
    })
  }


  return (
    <div className="lg:w-full w-[85%] pl-16 flex lg:justify-center lg:items-center flex-col relative top-3 opacity-0 animate-[opacity_0.4s_forwards_ease-in-out]">
      <div className="bg-white border border-[#efefef] rounded-xl overflow-hidden ">
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
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col px-4 lg:px-8 py-4">
            <div className="mt-1 ">
              <h2 className="lg:text-md 2xl:text-lg font-semibold">Mobile Number</h2>
              <div className=" flex-grow mt-1 flex items-center border-2 border-[#efefef] rounded-lg focus-within:border-[#EA002A]  ">
                <select className="w-[60px] py-2 h-full bg-white border-0 border-[#efefef] rounded-l-lg focus:outline-none" disabled>
                  <option value="+91" selected>+91</option>
                </select>
                <input
                  id="PhoneNumber"
                  inputMode="numeric"
                  minLength={10}
                  maxLength={10}
                  placeholder="Enter mobile number"
                  className="flex-grow px-4 py-2 lg:py-2 2xl:py-4 w-[300px] lg:w-[450px] 2xl:w-[560px] rounded-r-lg outline-none focus:outline-none"
                  {...register("PhoneNumber", {
                    required: true, minLength: 10, maxLength: 10,
                    onChange: (e: any) => {
                      setValue("PhoneNumber", HelperConstant.numberOnlyRegex.regex.test(e.target.value) ? e.target.value : "");
                      clearErrors("PhoneNumber");
                      setAuthError(null);
                    }
                  })}
                />
              </div>
              {errors.PhoneNumber && errors.PhoneNumber.type === "required" && (<p className="text-xs font-medium text-red-700 mt-2">Please Enter Mobile Number</p>)}
              {errors.PhoneNumber && (errors.PhoneNumber.type === "minLength" || errors.PhoneNumber.type === "maxLength")
                && (<p className="text-xs font-medium text-red-700 mt-2">Please enter valid Mobile Number</p>)}
            </div>
            {authError && <p className="text-xs text-red-700 mt-2">{authError}</p>}
            <button className="mt-4 py-2 lg:py-3 text-lg w-full disabled:cursor-not-allowed disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC] bg-[#EA002A] border-0 outline-0 text-white rounded-lg text-center"
              type="submit" disabled={isSubmitting} >Get OTP</button>
            <p className="mt-2 text-center lg:text-sm 2xl:text-md" >Don't have an account? <span className="text-[#EA002A] font-semibold hover:underline cursor-pointer" onClick={signup}>Sign Up here</span></p>
          </div>
        </form>
        {isSell && (
          <div className="w-[100%] px-4 lg:px-8 pb-5">
            <h4 className="text-base lg:text-lg font-medium text-[#EA002A]">
              Unlock the exact price by signing in
            </h4>
            <div className=" lg:flex flex mt-4 items-start">
              <div className="lg:w-[80px] w-[100px] px-2 py-2 border flex border-[#efefef] bg-[#EDEDED] rounded-md">
                <img src={''} alt="pic" className="object-contain" />
              </div>
              <div className="flex flex-col px-4">
                <span className="text-sm lg:text-lg font-semibold ">
                  Apple iphone 15 Pro Max(8gb / 12bg)
                </span>
                <span className="text-xs lg:text-sm mt-1">Instantly sell and get</span>
                <span className="text-lg lg:text-2xl">$XX,XXX</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signin;

