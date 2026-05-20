import React from "react";
import { ISEOModel } from "shared/src/models/SEO.Model";
import HomeBuy from "shared/src/pages/buy";

export default function Home() {
  return (
    <React.Fragment>
      <HomeBuy metaTags={{} as ISEOModel}/>
    </React.Fragment>
  );
}
