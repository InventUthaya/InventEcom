import { useRecoilState, useRecoilValue } from "recoil";
import Signin from "./Signin";
import Signinbuy from "./Signinbuy";
import { useEffect, useState } from "react";
import { LoginModalHandler, LoginWithSelectedProduct, ShowLoginPage } from "../../../recoil/userAuth";
import Otp from "./Otp";
import React from "react";
import { useRouter } from "next/router";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

function Signup() {
  const [isOTP, setIsOTP] = useState(0);
  const [_, setShowLogin] = useRecoilState(ShowLoginPage);
  const [__, setLoginHandler] = useRecoilState(LoginModalHandler);
  const loginHandler = useRecoilValue(LoginModalHandler);
  const isLoginViaEvalution = useRecoilValue(LoginWithSelectedProduct)

  let backValue = window.location.pathname.includes('sell');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      App.addListener("backButton", () => {
        setLoginHandler({ handler: loginHandler.handler, isOpen: false })
      })
    }
  }, []);

  useEffect(() => {
    if (loginHandler.isOpen) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto"; 
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loginHandler.isOpen]);

  if (!loginHandler.isOpen) return null;

  return (
    <React.Fragment>
      {loginHandler.isOpen && (
        <div
          className="fixed bg-[#00000077] top-0 left-0 w-full h-screen backdrop-blur-sm z-[1000] flex justify-center items-center
      opacity-0 animate-[opacity1_0.2s_forwards_ease-in-out] overflow-x-hidden overflow-y-scroll"
          onClick={() => { setShowLogin(false); }}
        >
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="w-fit p-4"
          >
            {(loginHandler.handler === "login") && (
              <Signin
                setIsOTP={setIsOTP}
                isSell={backValue ? isLoginViaEvalution : false}
              />
            )}
            {(loginHandler.handler === "otp") && (
              <Otp
                setIsOTP={setIsOTP}
                isSell={backValue ? isLoginViaEvalution : false}
              />
            )}
            {(loginHandler.handler === "register") && <Signinbuy />}
            {/* {(loginHandler.handler === "forgotpassword") && <ForgotPassword isSell={false} />}
            {(loginHandler.handler === "forgot-password-OTP") && <OTPVerification isSell={false} />}
            {(loginHandler.handler === "reset-password") && <ResetPassword isSell={false} />} */}
          </div>
        </div>
      )}
    </React.Fragment>

  );
}

export default Signup;
