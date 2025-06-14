// src/components/AdBanner.tsx
"use client"; // This component doesn't need server-side logic

import styles from './AdBanner.module.css';

const AdBanner = () => {
  // The ad code provided by you
  // The innerHTML is used to render the iframe and the link
  const adHtml = {
    __html: `<iframe data-aa='2398577' src='//ad.a-ads.com/2398577?size=728x90' style='width:728px; height:90px; border:0px; padding:0; overflow:hidden; background-color: transparent;'></iframe><a style="display: block; text-align: right; font-size: 12px; color: var(--text-secondary);" id="frame-link" href="https://aads.com/campaigns/new/?source_id=2398577&source_type=ad_unit&partner=2398577">Advertise here</a>`
  };

  return (
    <div className={styles.adContainer}>
      {/* Using dangerouslySetInnerHTML to render raw HTML from the ad provider.
        This is necessary for ad codes that are provided as HTML snippets.
      */}
      <div id="frame" style={{ width: '728px' }} dangerouslySetInnerHTML={adHtml} />
    </div>
  );
};

export default AdBanner;

