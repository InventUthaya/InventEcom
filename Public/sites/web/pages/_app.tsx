import 'shared/src/styles/globals.css'
import type { AppProps } from "next/app";
import { RecoilRoot, RecoilEnv } from 'recoil';
import React from 'react';

// Disable the duplicate atom key checking
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

import GlobalLoader from 'shared/src/components/utils/Loader/GlobalLoader';

export default function App({ Component, pageProps }: AppProps) {

  return <RecoilRoot>
    <GlobalLoader />
    <Component {...pageProps} />
  </RecoilRoot>
}
