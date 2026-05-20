import React from 'react';
import './SEOContent.css';

type Props = {
  SeocontentTitle: string
  SeoContent: string
}

function SEOContent({ SeocontentTitle, SeoContent }: Props) {
  return (

    <div>
      <h4 className='seo-h1' >{SeocontentTitle}</h4>
      <h6 className='seo-h6' dangerouslySetInnerHTML={{
        __html: `
        ${SeoContent}`
      }}></h6>
    </div>
  )
}

export default SEOContent
