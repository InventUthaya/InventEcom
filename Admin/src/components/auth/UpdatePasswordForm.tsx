import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";;

type ResetPasswordFormInputs = {
    password: string;
    confirmPassword: string;
};

export default function UpdatePasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get("") || "/";
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<ResetPasswordFormInputs>({ mode: 'onChange' });

    const UpdatePassword = (password: string) => {
        navigate("/")
    }

    const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
        try {
            await UpdatePassword(data.password);
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };

    const formValues = watch();
    // Check if all fields are filled and email is valid
    const isFormValid =
        // formValues.agencyCode?.length > 0 &&
        formValues.password?.length > 0 &&
        formValues.confirmPassword?.length > 0;

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 justify-center mx-auto w-full max-w-md">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md dark:text-white/90">
                            Update Password
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Enter a new password and confirm it to update your current password.
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        New Password <span className="text-error-500">*</span>{" "}
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
                                    <div className="mx-auto mb-5 sm:pt-2 w-full max-w-md text-center">
                                        <Link
                                        to={redirectPath}
                                            className="items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-gray-400 text-sm transition-colors"
                                        >
                                            Skip
                                        </Link>
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