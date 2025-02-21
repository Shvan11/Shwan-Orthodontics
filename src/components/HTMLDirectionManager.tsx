"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { dir } from "i18next";

export default function HTMLDirectionManager({ initialLocale }: { initialLocale: string }) {
  const pathname = usePathname();
  const lastLocaleRef = useRef(initialLocale);

  // Set attributes on initial load
  useEffect(() => {
    const setAttributes = (locale: string) => {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir(locale);
      console.log(`✅ Initial HTML attributes set: lang=${locale}, dir=${dir(locale)}`);
    };

    setAttributes(initialLocale);
  }, [initialLocale]); // Only runs once on initial load

  // Handle changes in locale on client-side navigation
  useEffect(() => {
    const detectLocaleFromPath = () => {
      const urlLocale = pathname.startsWith("/ar") ? "ar" : "en";
      
      // Only update if the locale has changed
      if (urlLocale !== lastLocaleRef.current) {
        lastLocaleRef.current = urlLocale;

        document.documentElement.lang = urlLocale;
        document.documentElement.dir = dir(urlLocale);
        console.log(`🔄 Updated HTML attributes: lang=${urlLocale}, dir=${dir(urlLocale)}`);
      }
    };

    detectLocaleFromPath();
  }, [pathname]); // Only re-run when the pathname changes

  return null;
}
