import { atom, selector, useSetRecoilState } from "recoil";

interface inputParam {
    DeviceId: number;
    BrandId: number;
    ModelId: number;
    SeriesId: number;
    VariantId: number;
    AddressId: number;
    ColourId: number;
}

const initialState: inputParam = {
    DeviceId: 0,
    BrandId: 0,
    ModelId: 0,
    SeriesId: 0,
    VariantId: 0,
    AddressId: 0,
    ColourId: 0
};

export const deviceIdState = atom({
    key: 'deviceIdState',
    default: {
        id: 0
    }
});

export const brandIdState = atom({
    key: 'brandIdState',
    default: {
        id: 0
    }
});

export const seriesIdState = atom({
    key: 'seriesIdState',
    default: {
        id: 0
    }
});

export const modelIdState = atom({
    key: 'modelIdState',
    default: {
        id: 0
    }
});

export const variantIdState = atom({
    key: 'variantIdState',
    default: {
        id: 0
    }
});

export const colourIdState = atom({
    key: 'colourIdState',
    default: {
        id: 0
    }
});

export const addressIdState = atom({
    key: 'addressIdState',
    default: {
        id: 0
    }
});

export const AddressID = atom({
    key: "AddressID",
    default: {
        AddressId: 0
    }
})

export const availabilityState = atom({
    key: "availabilityState",
    default: {
      message: "OBD not checked",
      color: "text-neutral-400",
    },
  });

export const useUpdateInputParam = () => {
    const setDeviceId = useSetRecoilState(deviceIdState);
    const setBrandId = useSetRecoilState(brandIdState);
    const setSeriesId = useSetRecoilState(seriesIdState);
    const setModelId = useSetRecoilState(modelIdState);
    const setVariantId = useSetRecoilState(variantIdState);
    const setColourId = useSetRecoilState(colourIdState);
    const setAddressId = useSetRecoilState(addressIdState);

    const updateInputParam = ({ payload, type }: any) => {
        switch (type) {
            case 'PRODUCT_ID':
                setDeviceId(payload);
                break;
            case 'BRAND_ID':
                setBrandId(payload);
                break;
            case 'SERIES_ID':
                setSeriesId(payload);
                break;
            case 'MODEL_ID':
                setModelId(payload);
                break;
            case 'VARIANT_ID':
                setVariantId(payload);
                break;
            case 'COLOUR_ID':
                setColourId(payload);
                break;
            case 'ADDRESS_ID':
                setAddressId(payload);
                break;
            default:
                break;
        }
    };

    const resetInputParams = () => {
        setDeviceId({
            id: 0
        });
        setBrandId({
            id: 0
        });
        setSeriesId({
            id: 0
        });
        setModelId({
            id: 0
        });
        setVariantId({
            id: 0
        });
        setColourId({
            id: 0
        });
        setAddressId({
            id: 0
        });
    };

    return { updateInputParam, resetInputParams };
};


type InputParamProps = {
    PRODUCT_ID: number,
    BRAND_ID: number,
    SERIES_ID: number,
    MODEL_ID: number,
    VARIANT_ID: number,
    COLOUR_ID: number,
    ADDRESS_ID: number
}

export const InputParamsHandler = atom<InputParamProps>({
    key: "InputParamHandler",
    default: {
        PRODUCT_ID: 0,
        BRAND_ID: 0,
        SERIES_ID: 0,
        MODEL_ID: 0,
        VARIANT_ID: 0,
        COLOUR_ID: 0,
        ADDRESS_ID: 0
    }
})