import { atom } from "recoil";

type LoginHandler = {
  handler: "login" | "otp" | "register" | "forgotpassword" | "select-location" | "via-evalution" | "pending-order" | "forgot-password-OTP" | "reset-password" | "";
  isOpen: boolean
}

type NewUser = {
  UserId: any,
  NewNumber: any,
  UserName: any,
  LoginId: any
}

// this is for container zindex weather we need to pop some component globaly
// need to increase the z index to show to component all the above
export const UserLoginDetails = atom({
  key: "UserLoginDetails",
  default: {
    status: false,
    data: {
      username: "",
      email: "",
      pincode: "",
    },
  },
});

export const ShowLoginPage = atom({
  key: "ShowLoginPage",
  default: false,
});


export const LoginModalHandler = atom<LoginHandler>({
  key: "LoginModalHandler",
  default: {
    handler: "",
    isOpen: false
  }
});

export const LoginWithSelectedProduct = atom({
  key: "LoginWithSelectedProduct",
  default: false
});

export const NewUser = atom<NewUser>({
  key: "NewUser",
  default: {
    UserId: undefined,
    NewNumber: undefined,
    UserName: undefined,
    LoginId: undefined
  }
})

export const SignupPhoneNumber = atom({
  key: "SignupPhoneNumber",
  default: {
    PhoneNumber:""
  }
});

