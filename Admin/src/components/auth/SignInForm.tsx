
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { EyeIcon } from "lucide-react";
import { EyeCloseIcon } from "../../icons";
import CommonService from "../../services/CommonService";
import Toaster, { ToastType } from "../common/Toaster";
import { Regex_Patterns, HTTP_Codes } from "../helper/constants";
import { restrictInput } from "../helper/helperfunctions";
import { useEffect, useState } from "react";

type SignInFormInputs = {
  mobile: string;
  password: string;
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [showAccessDeniedPopup, setShowAccessDeniedPopup] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  const phoneNumberPattern = Regex_Patterns.phoneNumberPattern;
  const emailPattern = Regex_Patterns.emailPattern;

  const formValues = watch();
  const isFormValid =
    formValues.mobile?.length > 0 && formValues.password?.length > 0;

  useEffect(() => {
    // Load stored login data
    const keepLoggedIn = localStorage.getItem("keepLoggedIn") === "true";
    setIsChecked(keepLoggedIn);
    if (keepLoggedIn) {
      const storedData = localStorage.getItem("loginData");
      if (storedData) {
        try {
          const loginData = JSON.parse(storedData);
          if (loginData && loginData.mobile && loginData.password) {
            setValue("mobile", loginData.mobile);
            setValue("password", loginData.password);
            clearErrors(["mobile", "password"]);
          }
        } catch (error) {
          console.error("Error parsing stored login data:", error);
          localStorage.removeItem("loginData");
        }
      }
    }
  }, [setValue, clearErrors]);

  const handleLoginError = (
    error: any,
    setToast: React.Dispatch<React.SetStateAction<{ msg: string; type: ToastType } | null>>
  ): void => {
    setBtnDisable(false);
    console.error("Error during login:", error);

    let errorMessage = "An error occurred. Please try again.";

    if (error.message.includes(HTTP_Codes.BadRequest)) {
      errorMessage = "Invalid username!";
    } else if (error.message.includes(HTTP_Codes.Unauthorized)) {
      errorMessage = "Invalid credentials!";
    } else if (error.message.includes(HTTP_Codes.Forbidden)) {
      setShowAccessDeniedPopup(true);
      return;
    }

    setToast({
      msg: errorMessage,
      type: "error" as ToastType,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    localStorage.setItem("keepLoggedIn", newCheckedState.toString());
    if (!newCheckedState) {
      localStorage.removeItem("loginData");
    }
  };

  const validateMobileOrEmail = (value: string) => {
    const isPhoneInput = /^\d+$/.test(value);
    const isEmailInput = value.includes("@") && value.includes(".");

    if (!isPhoneInput && !isEmailInput) {
      return "Please enter a valid mobile number or email address";
    }

    if (isPhoneInput) {
      if (!phoneNumberPattern.test(value)) {
        return "Mobile number must be exactly 10 digits";
      }
    } else if (isEmailInput) {
      if (!emailPattern.test(value)) {
        return "Please enter a valid email address";
      }
    }

    return true;
  };

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      setBtnDisable(true);
      const res = await CommonService.postWithDoubleQueryParam(
        "auth",
        "userlogin",
        "email",
        data.mobile,
        "password",
        data.password,
      );
      if (res.status === HTTP_Codes.Success) {
        if (res.data.success === false && res.data.errorCode === "ACCESS_DENIED") {
          setShowAccessDeniedPopup(true);
          return;
        }
        if (isChecked) {
          localStorage.setItem("loginData", JSON.stringify(data));
        }
        else {
          localStorage.removeItem("loginData");
        }

        const token = res.data?.Token;
        const ScreenMaster = res.data?.ScreenMaster;
        const RolePermission = res.data?.RolePermission;
        if (token) {
          localStorage.setItem("Token", token);
          sessionStorage.setItem("Token", token);
        }
        if (ScreenMaster) {
          localStorage.setItem("ScreenMaster", ScreenMaster);
          sessionStorage.setItem("ScreenMaster", ScreenMaster);
        }
        if (RolePermission) {
          localStorage.setItem("RolePermission", RolePermission);
          sessionStorage.setItem("RolePermission", RolePermission);
        }

        navigate(`/two-step-verification`);
      }
    } catch (err) {
      handleLoginError(err, setToast);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - 3D Animated Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-950 relative overflow-hidden">
        {/* 3D Floating Shapes Container */}
        <div className="absolute inset-0">
          {/* Rotating Orbital Rings around Logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* Large Outer Ring */}
            <div className="relative w-[500px] h-[500px] animate-spin-slow">
              <div className="absolute inset-0 border-2 border-transparent border-t-purple-400/40 border-r-indigo-400/30 rounded-full"></div>
              <div className="absolute inset-16 border-2 border-transparent border-b-indigo-300/30 border-l-purple-300/25 rounded-full"></div>

              {/* Orbital Points */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`outer-${i}`}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `rotate(${i * 45}deg) translateY(-250px) rotate(-${i * 45}deg)` }}
                >
                  <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-indigo-300 rounded-full blur-sm"></div>
                </div>
              ))}
            </div>

            {/* Medium Ring */}
            <div className="relative w-[400px] h-[400px] animate-spin-medium">
              <div className="absolute inset-0 border-3 border-transparent border-t-indigo-400/30 border-r-purple-400/25 rounded-full"></div>
              <div className="absolute inset-12 border-2 border-transparent border-b-purple-300/25 border-l-indigo-300/20 rounded-full"></div>

              {/* Orbital Points */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`medium-${i}`}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `rotate(${i * 60}deg) translateY(-200px) rotate(-${i * 60}deg)` }}
                >
                  <div className="w-2 h-2 bg-gradient-to-br from-indigo-300 to-purple-200 rounded-full"></div>
                </div>
              ))}
            </div>

            {/* Small Inner Ring */}
            <div className="relative w-[300px] h-[300px] animate-spin-fast">
              <div className="absolute inset-0 border-2 border-transparent border-l-purple-400/20 border-b-indigo-400/15 rounded-full"></div>

              {/* Orbital Points */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={`inner-${i}`}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `rotate(${i * 90}deg) translateY(-150px) rotate(-${i * 90}deg)` }}
                >
                  <div className="w-1.5 h-1.5 bg-white/70 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo Container */}
          <div className="relative z-20 flex flex-col justify-center items-center w-full h-full px-8">
            <div className="relative group">
              {/* Logo shadow/glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

              {/* Logo container with subtle 3D tilt */}
              <div className="relative transform transition-transform duration-500 1">
                <img
                  src="/images/logo/Logo (1).png"
                  alt="Company Logo"
                  width={240}
                  height={140}
                  className="object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                  style={{
                    filter: 'drop-shadow(0 20px 40px rgba(99, 102, 241, 0.3))',
                    imageRendering: 'crisp-edges'
                  }}
                />

                {/* Subtle reflection effect */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-t from-white/10 to-transparent blur-sm"></div>
              </div>
            </div>

            {/* Optional: Subtle floating indicator */}
            <div className="mt-12 animate-bounce-slow">
              {/* <div className="text-white/60 text-sm font-light tracking-wider">
                WELCOME BACK
              </div> */}
            </div>
          </div>

          {/* Background Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-30 animate-float-slow">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-indigo-600/30 rounded-full blur-2xl"></div>
              <div className="absolute inset-8 bg-gradient-to-tr from-purple-500/30 to-indigo-400/20 rounded-full blur-xl"></div>
            </div>
          </div>

          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 opacity-20 animate-float-medium">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-purple-500/25 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-white/20 rounded-full animate-pulse`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + (i % 4)}s`
              }}
            ></div>
          ))}
        </div>

        {/* Subtle grid overlay for depth */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                            linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-8">
        <div className="w-full max-w-md">
          {/* Card with subtle shadow and rounded corners */}
          <div className="bg-white rounded-3xl p-8 relative">
            {/* Small decorative circle in top-right */}
            {/* <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-900 rounded-full opacity-20"></div>
            <div className="absolute -top-12 -right-12 w-32 h-32 border-8 border-indigo-900/10 rounded-full"></div> */}

            {/* Mobile Logo - Centered with same crisp effect */}
            <div className="flex justify-center mb-6 lg:hidden">
              <div className="relative">
                <div className="absolute -inset-3 "></div>
                <img
                  src="/images/Logo (1).png"
                  alt="Company Logo"
                  width={120}
                  height={40}
                  className="relative h-auto drop-shadow-lg filter brightness-110 contrast-110"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
             Sign In
            </h2>
            {/* <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
              Enter your credentials to sign in!
            </p> */}

            {toast && (
              <Toaster
                message={toast.msg}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Mobile Number/Email <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your mobile number or email"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700"
                  {...register("mobile", {
                    required: "Mobile number or email is required",
                    validate: validateMobileOrEmail,
                    onChange(event) {
                      if (/^\d+$/.test(event.target.value)) {
                        restrictInput(event, 10);
                      }
                    },
                  })}
                />
                {errors.mobile && (
                  <p className="text-xs text-red-800 mt-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Password <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700 pr-12"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-800 mt-1">
                    {errors.password.message || "Please enter your password"}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="keepLoggedIn"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="keepLoggedIn" className="block font-normal text-gray-700 text-xs dark:text-gray-400">
                    Keep me logged in
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || btnDisable}
                className="w-full bg-indigo-900 hover:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
              >
                {btnDisable ? "Signing in..." : "Sign in"}
              </button>

              {/* <p className="text-center text-gray-600 text-xs mt-6">
                Don't have any account?{" "}
                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800">
                  Create an account
                </a>
              </p> */}
            </form>
          </div>
        </div>
      </div>

      {/* Add custom animations to global styles or in your CSS file */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(20px, -20px) rotate(120deg); }
          66% { transform: translate(-15px, 15px) rotate(240deg); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 15px); }
        }

        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 10s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }

        .animate-spin-medium {
          animation: spin-medium 30s linear infinite;
        }

        .animate-spin-fast {
          animation: spin-fast 20s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}