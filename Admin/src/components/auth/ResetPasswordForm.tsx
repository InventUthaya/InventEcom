import { useState, useEffect } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import CommonService from "../../services/CommonService";
import OtpInput from "react-otp-input";
import { HTTP_Codes, OTPVerificationTimer } from "../helper/constants";
import Toaster, { ToastType } from "../common/Toaster";
import { useNavigate, useParams } from "react-router-dom";


type ResetPasswordFormInputs = {
  otp: string;
  // email: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const [otpError, setOtpError] = useState(false);
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [isClient, setIsClient] = useState(false);

  const handleOTPChange = (otp: string) => {
    setOtpError(false);
    setOTP(otp);
    setValue("otp", otp, { shouldValidate: true });
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({ mode: 'onChange' });

  const updatePassword = (otp: any, password: string) => {
    CommonService.postWithTripleParam("auth", "updatePassword", id, otp, password).then(res => {
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        setOtpError(false);
        navigate("/signin");
      }
    }).catch((e: any) => {
      if (e.response?.status === HTTP_Codes.InternalServerError) {
        setOtpError(true);
        // setToast({ msg: e.response.data.message, type: "error" });
      }
    });
  }


  useEffect(() => {
    setIsClient(true);
  }, []);

  const [counter, setCounter] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCounter = localStorage.getItem('otpCounter');
      const savedTimestamp = localStorage.getItem('otpCounterTimestamp');

      if (savedCounter && savedTimestamp) {
        const elapsedSeconds = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
        const remainingCounter = parseInt(savedCounter) - elapsedSeconds;
        return remainingCounter > 0 ? remainingCounter : 0;
      }
    }
    return OTPVerificationTimer;
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (counter > 0) {
      timer = setTimeout(() => {
        const newCounter = counter - 1;
        setCounter(newCounter);
        if (typeof window !== 'undefined') {
          localStorage.setItem('otpCounter', newCounter.toString());
          localStorage.setItem('otpCounterTimestamp', Date.now().toString());
        }
      }, 1000);
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('otpCounter');
        localStorage.removeItem('otpCounterTimestamp');
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [counter]);

  const resendOTP = () => {
    setCounter(OTPVerificationTimer);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('otpCounter');
      localStorage.removeItem('otpCounterTimestamp');
    }
    CommonService.postWithSinglyQueryParam("auth", "ResendOTP", "encryptedMobile", id).then(res => {
      if (res.status === 200) {
        setToast({
          msg: res.data.message,
          type: "success",
        });
      }
    }).catch((e: string) => {
      console.log(e);
      setToast({
        msg: "Error sending OTP",
        type: "error",
      });
    });
  }


  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    try {
      await updatePassword(data.otp, data.password);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const formValues = watch();
  // Check if all fields are filled and email is valid
  const isFormValid =
    // formValues.agencyCode?.length > 0 &&
    formValues.otp?.length > 0 &&
    formValues.password?.length > 0 &&
    formValues.confirmPassword?.length > 0;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  return (
    <div className="flex flex-col flex-1">
      {toast && (
        <Toaster
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex flex-col flex-1 justify-center mx-auto w-full max-w-md">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md dark:text-white/90">
              Reset Password
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Enter you OTP and new password, to reset your password.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
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
                    renderSeparator={<span></span>}
                    renderInput={(props) => (
                      <input {...props} className="otp-field" id="otp-input" />
                    )}
                  />
                  {errors.otp && (
                    <p className="mt-2 text-red-800 text-xs">
                      {errors.otp.message}
                    </p>
                  )}
                  {otpError && (
                    <p className="mt-1 text-red-500 text-sm">{'Invalid OTP'}</p>
                  )}
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Please enter your password",
                        pattern: {
                          value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                          message:
                            "Password must include at least one uppercase letter, one number, and one special character and minimum of 8 Characters",
                        },
                        onChange: (e: any) => {
                          setValue("password", e.target.value);
                          clearErrors("password");
                        },
                      }) as any}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="top-1/2 right-4 z-30 absolute -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-red-800 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>
                    Confirm Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter your confirm password"
                      {...register("confirmPassword", {
                        required: true,
                        validate: (value) =>
                          value === watch("password") ||
                          "The passwords do not match",
                        onChange: (e: any) => {
                          setValue("confirmPassword", e.target.value);
                          clearErrors("confirmPassword");
                        },
                      }) as any}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="top-1/2 right-4 z-30 absolute -translate-y-1/2 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.confirmPassword?.type === "required" && (
                    <p className="mt-2 text-red-800 text-xs">
                      Please enter your confirm password
                    </p>
                  )}
                  {errors.confirmPassword?.type === "validate" && (
                    <p className="mt-2 text-red-800 text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={!isFormValid}
                  >
                    Confirm
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {isClient && counter > 0 ? (
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Resend code in {formatTime(counter)}
                      </span>
                    ) : (
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Didn’t get the code?{" "}
                        <span className="text-brand-500 hover:text-brand-600 dark:text-brand-400 cursor-pointer" onClick={resendOTP}>
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