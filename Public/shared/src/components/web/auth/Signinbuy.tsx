import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import TermsAndConditionPopup from "../../popups/TermsAndConditionPopup";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegistrationModel } from "shared/src/models/Registration.Model";
import { HelperConstant } from "../../helper/HelperConstant";
import AuthServices from "shared/src/services/Auth.Services";
import { LoginModalHandler, NewUser, SignupPhoneNumber } from "../../../recoil/userAuth";

interface CreateUserRequestViewModel {
  Name: string;
  Phone: string;
  Email: string;
}

function Signinbuy() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isTerms, setIsTerms] = useState(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [termsErr, setTermsErr] = useState<string | null>(null);
  const pattern = HelperConstant.emailPattern.pattern;
  const [disbleLogin, setDisableLogin] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [alreadyUser, setAlreadyUser] = useState("");

  const PhoneNumber = useRecoilValue(SignupPhoneNumber);
  const [__, setLoginHandler] = useRecoilState(LoginModalHandler);
  const [_, setPhoneNumber] = useRecoilState(SignupPhoneNumber);
  const [, setUserName] = useRecoilState(NewUser);

  const { register, handleSubmit, formState: { errors, isSubmitting }, clearErrors, watch, getValues, setValue } = useForm<IRegistrationModel>({});

  const isFormFilled = name !== "" && email !== "" && pinCode !== "";

  const termsPopUp = () => {
    setIsTerms(true);
    setTimeout(() => {
      let ele = document.getElementById("terms-default-modal");
      ele?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  }

  const signIn = () => {
    setLoginHandler({
      handler: "login",
      isOpen: true
    })
  }

  const clearPhoneNumber = () => {
    setPhoneNumber({
      PhoneNumber: ""
    })
  }

  const onSubmit: SubmitHandler<IRegistrationModel> = data => {
    setAuthError(null);
    if (!isSelected) {
      setTermsErr("Please accept Terms and Conditions");
      return;
    }
  
    // New simplified payload for CreateUser API
    const requestData: CreateUserRequestViewModel = {
      Name: data.Username?.trim() || "",
      Phone: data.mobileNumber?.trim() || "",
      Email: data.Email?.trim() || "",
    };
  
    clearPhoneNumber();
  
    AuthServices.authenticate(requestData).then((res) => {
      setDisableLogin(true);
      if (res.status === 200) {
        if (res.data === "Already registerd number") {
          setAuthError("The Mobile number is already registered.");
          return;
        } else if (res.data === "Already registerd email") {
          setAuthError("The Email is already registered.");
          return;
        } else {
          signIn();
        }
      } else {
        setAuthError("An error occurred during registration.");
      }
    }).catch((error) => {
      setDisableLogin(false);
      setAuthError("An unexpected error occurred. Please try again.");
    });
  };

  return (
    <>
      <div className="lg:w-full h-full flex lg:justify-center lg:items-center flex-col relative top-3 lg:mt-0 2xl:mt-32">
        <div className="bg-white rounded-[12px] overflow-hidden">
          <div className="overflow-hidden relative lg:px-8 px-4 lg:py-4 py-4">
            <h1 className="lg:text-3xl 2xl:text-4xl text-2xl font-semibold">Sign up</h1>
            <h5 className="text-xs lg:text-md 2xl:text-base mt-1 lg:mt-0 color-[#050505]">
              Proceed to sign up by using your mobile number
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
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col px-4 lg:px-8 py-0">
              <h2 className="lg:text-md 2xl:text-lg font-semibold">Name</h2>
              <input
                type="text"
                id='UserName'
                placeholder="Enter Your Name"
                className="lg:w-[500px] 2xl:w-[560px] py-2 lg:py-2 2xl:py-4 w-[300px] px-4 mt-2 rounded-lg border-2 border-[#efefef] "
                {...register("Username", { required: true, maxLength: 100, onChange: (e: any) => { setValue("Username", e.target.value); clearErrors("Username"); setAuthError(null); } })}
              />
              {errors.Username?.type === "required" && <p className="text-xs text-red-700 mt-2">Enter Full Name</p>}
              {(errors.Username?.type === "maxLength") && <p className="text-xs text-red-700  mt-2">Your Name must be within 100 words</p>}
              <div className="mt-1 ">
                <h2 className="lg:text-md mt-2 2xl:text-lg font-semibold">Mobile Number</h2>
                <div className="  flex-grow my-2 flex items-center border-2 border-[#efefef] rounded-lg focus-within:border-black w-[300px] lg:w-[500px] 2xl:w-[560px]  ">
                  <select className="w-[60px] py-2 h-full bg-white border-0 border-[#efefef] rounded-l-lg focus:outline-none" disabled>
                    <option value="+91" selected>+91</option>
                  </select>
                  <input
                    id="mobileNumber"
                    inputMode="numeric"
                    minLength={10}
                    maxLength={10}
                    defaultValue={PhoneNumber.PhoneNumber || ""}
                    placeholder="Enter mobile number"
                    className="flex-grow  px-4 py-2 lg:py-2 2xl:py-4 w-[300px] lg:w-[450px] 2xl:w-[560px] rounded-r-lg outline-none focus:outline-none"
                    {...register("mobileNumber", {
                      required: true, minLength: 10, maxLength: 10,
                      onChange: (e: any) => {
                        setValue("mobileNumber", HelperConstant.numberOnlyRegex.regex.test(e.target.value) ? e.target.value : "");
                        clearErrors("mobileNumber");
                        setAuthError(null);
                      }
                    })}
                  />
                </div>
                {errors.mobileNumber && errors.mobileNumber.type === "required" && (<p className="text-xs font-medium text-red-700 mt-2">Please Enter Mobile Number</p>)}
                {errors.mobileNumber && (errors.mobileNumber.type === "minLength" || errors.mobileNumber.type === "maxLength")
                  && (<p className="text-xs font-medium text-red-700 mt-2">Please enter valid Mobile Number</p>)}
              </div>
              <div className="mt-1">
                <h2 className="lg:text-md 2xl:text-lg font-semibold">Email</h2>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="lg:w-[500px] 2xl:w-[560px] py-2 lg:py-2 2xl:py-4 w-[300px] px-4 mt-2 rounded-lg border-2 border-[#efefef]"
                  {...register("Email", {
                    required: true, pattern: pattern, onChange: (e: any) => {
                      setValue("Email", e.target.value); clearErrors("Email"); setAuthError(null);
                    }
                  })}
                />
                {errors.Email?.type === "required" && <p className="text-xs text-red-700 mt-2">Enter Email</p>}
                {errors.Email?.type === "pattern" && <p className="text-xs text-red-700 mt-2">Please Enter valid an Email Id</p>}
              </div>

              <div className="flex items-center mt-3">
                <input type="checkbox" id="check-box" className="accent-[#EA002A]" checked={isSelected} onClick={() => { setIsSelected(!isSelected) }} />
                <label htmlFor="link-radio" className="ms-2 text-sm font-medium text-gray-900">I Agree to the <span onClick={() => termsPopUp()} className="text-[#EA002A] hover:underline cursor-pointer">Terms and Conditions</span></label>
              </div>
              {(!isSelected && termsErr) && <p className="text-[#EA002A] text-sm my-1 font-semibold">{termsErr}</p>}
              {authError && <p className="text-xs text-red-700 mt-2">{authError}</p>}
              <button
                className={`py-3 lg:py-3 border text-md 2xl:text-base bg-[#EA002A] rounded-lg text-center mt-5 mb-4 text-white cursor-pointer`}
                disabled={isSubmitting} type="submit"> Submit </button>
            </div>
          </form>
        </div>
      </div>
      {isTerms &&
        <TermsAndConditionPopup setIsTerms={setIsTerms} isTerms={isTerms} isSelected={isSelected} setIsSelected={setIsSelected} />
      }
    </>
  );
}

export default Signinbuy;
