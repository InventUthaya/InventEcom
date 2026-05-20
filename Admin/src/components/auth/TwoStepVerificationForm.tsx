import { Dispatch, SetStateAction, useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useForm, SubmitHandler } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { ToastType } from "../common/Toaster";
import { HTTP_Codes, OTPVerificationTimer } from "../helper/constants";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommonService from "../../services/CommonService";
import { ChevronLeftIcon } from "../../icons";
import { TokenData } from "../../types";

type TwoStepVerificationFormInputs = {
  otp: string;
};

export default function TwoStepVerificationPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<TwoStepVerificationFormInputs>({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [OTP, setOTP] = useState("");
  const [showAccessDeniedPopup, setShowAccessDeniedPopup] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(
    null
  );
  const [counter, setCounter] = useState(OTPVerificationTimer);

  const handleOTPChange = (otp: string) => {
    setOTP(otp);
    setValue("otp", otp, { shouldValidate: true });
    if (otp.length === 6) {
      SecureHandshake(id, otp);
    }
  };

  const handleDecodeToken = (token: string) => {
    const tokenData: TokenData = jwtDecode(token);
    return tokenData;
  };

const handleAuthError = (
  error: any,
  setToast: Dispatch<SetStateAction<{ msg: string; type: ToastType } | null>>
): void => {
  console.error("Error during secure handshake:", error);

  let errorMessage = "An error occurred. Please try again.";

  // ✅ Properly extract status from Axios error object
  const status = error?.response?.status;

  switch (status) {
    case 400:
      errorMessage = "Invalid OTP!";
      break;
    case 401:
      errorMessage = "Invalid OTP!";
      break;
    case 404:
      errorMessage = "User not found.";
      break;
    case 500:
      errorMessage = "Server error.";
      break;
    default:
      errorMessage = "Unexpected error occurred.";
  }

  setToast({
    msg: errorMessage,
    type: "error",
  });

  setTimeout(() => {
    setToast(null);
  }, 3000);
};


  const SecureHandshake = async (
    key: string | undefined,
    otp: string
  ): Promise<any> => {
    try {
      const token = localStorage.getItem("Token");

      if (!token) {
        throw new Error("Token not found");
      }
      const decoded = handleDecodeToken(token);
      const loginId = decoded.LoginId;
      const res = await CommonService.postWithDoubleQueryParam(
        "auth",
        "VerifyOTP",
        "loginId",
        loginId,
        "otp",
        otp,
      );

      if (res.status === HTTP_Codes.Success) {
        if (res.data.success === false && res.data.errorCode === "ACCESS_DENIED") {
          setShowAccessDeniedPopup(true);
          return;
        }
        navigate("/update-password")
      } else {
        handleAuthError(res, setToast);
      }
    } catch (err:any) {
      handleAuthError(err, setToast);
       console.error("Caught in catch:", err); 
    }
  };

  const onSubmit: SubmitHandler<TwoStepVerificationFormInputs> = async (data) => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        throw new Error("Token not found");
      }
      const decoded = handleDecodeToken(token);
      const loginId = decoded.LoginId;
      const res = await CommonService.postWithDoubleQueryParam(
        "auth",
        "VerifyOTP",
        "loginId",
        loginId,
        "otp",
        data.otp,
      );
      if (res.status === HTTP_Codes.Success) {
        if (res.data.success === false && res.data.errorCode === "ACCESS_DENIED") {
          setShowAccessDeniedPopup(true);
          return;
        }
        navigate("/update-password")

      }
    } catch (err) {
      handleAuthError(err, setToast);
    }
  };

  const resendOTP = () => {
    setCounter(OTPVerificationTimer);
    CommonService.postWithSinglyQueryParam(
      "auth",
      "ResendOTP",
      "encryptedEmail",
      id
    )
      .then((res) => {
        if (
          res.status === HTTP_Codes.Success ||
          res.status === HTTP_Codes.Created
        ) {
          setToast({
            msg: res.data.message,
            type: "success",
          });
        }
      })
      .catch((e: string) => {
        console.log(e);
        setToast({
          msg: "Something went wrong!",
          type: "success",
        });
      });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  return (
    <div className="flex flex-col flex-1">
      <div className="mx-auto pt-10 w-full max-w-md">
        <Link
          to="/signin"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-gray-400 text-sm transition-colors"
        >
          <ChevronLeftIcon className="size-5" />
          Back to Sign In
        </Link>
      </div>
      <div className="flex flex-col flex-1 justify-center mx-auto w-full max-w-md">
        <div>
          <div className="mb-5 sm:mb-6">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md dark:text-white/90">
              Two Step Verification
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              A verification code has been sent to your email. Please enter it
              in the field below.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <Label>
                  Type your 6 digits security code{" "}
                  <span className="text-error-500">*</span>
                </Label>
                <input
                  type="hidden"
                  {...register("otp", {
                    required: "Please enter the 6-digit code",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Code must be exactly 6 digits",
                    },
                  })}
                />
                <OtpInput
                  shouldAutoFocus={true}
                  value={OTP}
                  onChange={handleOTPChange}
                  numInputs={6}
                  inputType="number"
                  renderSeparator={<span></span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      type="number"
                      className="otp-field"
                      id="otp-input"
                    />
                  )}
                />
                {errors.otp && (
                  <p className="mt-2 text-red-800 text-xs">
                    {errors.otp.message}
                  </p>
                )}
                {toast?.msg && (
                  <p className="mt-2 font-medium text-red-800 text-sm">
                    {toast?.msg}
                  </p>
                )}
                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={!isValid}
                  >
                    Verify Me
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {counter > 0 ? (
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Resend code in {formatTime(counter)}
                      </span>
                    ) : (
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Didn’t get the code?{" "}
                        <span
                          className="text-brand-500 hover:text-brand-600 dark:text-brand-400 cursor-pointer"
                          onClick={resendOTP}
                        >
                          Resend
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
