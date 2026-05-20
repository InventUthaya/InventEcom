import { atom, selector } from 'recoil';

export const selectedVariantState = atom({
  key: 'selectedVariantState',
  default: -1,
});

export const selectedConditionState = atom({
  key: 'selectedConditionState',
  default: -1,
});

export const selectedColorState = atom({
    key: "selectedColorState",
    default: {
      Color: "",
      Id: null,
    },
  });

export const validCombinationSelector = selector({
  key: 'validCombinationSelector',
  get: ({ get }) => {
    const variant = get(selectedVariantState);
    const condition = get(selectedConditionState);
    const color = get(selectedColorState);
    return { variant, condition, color };
  },
});
