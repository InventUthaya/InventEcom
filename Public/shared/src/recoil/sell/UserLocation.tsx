import { atom } from "recoil";

export const UserLocation = atom({
    key: "UserLocation",
    default: {
        UserLocation: '',
        UserLocationId: 0
    }
})

export const SwitchCountry = atom({
    key: "SwitchCountry",
    default: {
        IsSwitched: false,
        SwitchedLocation: undefined,
        IsOpen: false
    }
})