'use client';

import { useEffect } from 'react';

export default function AxeptioWidget() {
  useEffect(() => {
    // Configuration Axeptio
    window.axeptioSettings = {
      clientId: "693ad3bbbbc710e6f7d043084",
      cookiesVersion: "a7d7acfc-bbae-4b70-8443-470e2a730b53",
      googleConsentMode: {
        default: {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          wait_for_update: 500
        }
      }
    };

    // Charger le script Axeptio
    (function(d, s) {
      var t = d.getElementsByTagName(s)[0], e = d.createElement(s);
      e.async = true;
      e.src = "//static.axept.io/sdk.js";
      t.parentNode.insertBefore(e, t);
    })(document, "script");
  }, []);

  return null;
}
