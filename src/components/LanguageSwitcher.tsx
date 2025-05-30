//"C:\shwan-orthodontics\src\components\LanguageSwitcher.tsx"
"use client";
import { memo, useCallback } from "react";

import { useLocale } from "@/context/LocaleContext";

function LanguageSwitcher() {
  
  const { locale, setLocale } = useLocale();
  const isRTL = locale === "ar";

  // Compute these values outside render to reduce work
  const newLocale = locale === "en" ? "ar" : "en";
  const buttonText = locale === "en" ? "عربي" : "English";

  // Memoize the change language handler
  const changeLanguage = useCallback(() => {
    setLocale(newLocale);
  }, [newLocale, setLocale]);

  return (
    <button
      onClick={changeLanguage}
      className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${isRTL ? 'mr-4' : 'ml-4'} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300`}
      aria-label={`Switch to ${newLocale === 'ar' ? 'Arabic' : 'English'} language`}
      title={`Switch to ${newLocale === 'ar' ? 'Arabic' : 'English'}`}
    >
      {buttonText}
    </button>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(LanguageSwitcher);
