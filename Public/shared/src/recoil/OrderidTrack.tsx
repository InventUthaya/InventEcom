import { atom } from 'recoil';

export const selectedOrderIdState = atom<number | null>({
  key: 'selectedOrderId',
  default: null,
});

export const orderIdState = atom<any | null>({
  key: 'orderIdState', 
  default: null,       
});