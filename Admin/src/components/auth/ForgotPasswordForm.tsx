import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import CommonService from "../../services/CommonService";
import { Regex_Patterns } from "../helper/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ForgotPasswordFormInputs = {
    identifier: string;
};

export default function ForgotPasswordForm() {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);
    const [inputType, setInputType] = useState<"mobile" | "email" | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ForgotPasswordFormInputs>({
        mode: "onChange",
    });

    const mobilePattern = Regex_Patterns.phoneNumberPattern || /^[0-9]{10}$/;
    const emailPattern = Regex_Patterns.emailPattern || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const identifier = watch("identifier", "");

    // Determine input type based on content
    const determineInputType = (value: string) => {
        if (/^[0-9]*$/.test(value) && value.length <= 10) {
            return "mobile";
        }
        if (value.includes("@") || /[a-zA-Z]/.test(value)) {
            return "email";
        }
        return null;
    };

    // Validate form based on input type
    const isFormValid = () => {
        if (inputType === "mobile") {
            return identifier.length === 10 && mobilePattern.test(identifier);
        }
        if (inputType === "email") {
            return emailPattern.test(identifier);
        }
        return false;
    };

    const restrictInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        const newInputType = determineInputType(value);

        if (newInputType === "mobile") {
            value = value.replace(/[^0-9]/g, "").slice(0, 10); // Restrict to 10 digits
        } else if (newInputType === "email") {
            value = value.trim(); // Clean email input
        }

        setInputType(newInputType);
        setValue("identifier", value, { shouldValidate: true });
    };

    const forgotPassword = async (identifier: string) => {
        try {
            const res = await CommonService.postWithSinglyQueryParam(
                "auth",
                "forgotPassword",
                "mobile",
                identifier
            );
            if (res.status === 200) {
                navigate(`/reset-password/${res.data.data}`);
            }
        } catch (err: any) {
            setApiError(err.response?.data?.message || 
                inputType === "email" ? "Email not found in the database" : 
                "Mobile number not found in the database");
            throw err;
        }
    };

    const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
        setApiError(null);
        try {
            await forgotPassword(data.identifier);
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Forgot Your Password?
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your mobile number or email linked to your account, and we’ll send you an OTP to reset your password.
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Mobile Number or Email<span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter your mobile or email"
                                        type="text"
                                        maxLength={inputType === "mobile" ? 10 : 100}
                                        {...register("identifier", {
                                            required: "Mobile number or email is required",
                                            onChange: restrictInput,
                                            validate: {
                                                validFormat: (value) => {
                                                    const type = determineInputType(value);
                                                    if (type === "mobile") {
                                                        return mobilePattern.test(value) && value.length === 10
                                                            ? true
                                                            : "Please enter a valid 10-digit mobile number";
                                                    }
                                                    if (type === "email") {
                                                        return emailPattern.test(value)
                                                            ? true
                                                            : "Please enter a valid email address";
                                                    }
                                                    return "Please enter a valid mobile number or email";
                                                },
                                            },
                                        }) as any}
                                    />
                                    {errors.identifier && (
                                        <p className="text-xs text-red-800 mt-2">
                                            {errors.identifier.message}
                                        </p>
                                    )}
                                    {apiError && (
                                        <p className="text-xs text-red-800 mt-2">
                                            {apiError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Button
                                        className="w-full"
                                        size="sm"
                                        type="submit"
                                        disabled={!isFormValid()}
                                    >
                                        Send Reset OTP
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}