//"C:\shwan-orthodontics\src\components\LanguageSwitcher.tsx"
"use client";
import { memo, useCallback } from "react";

import { useLocale } from "@/context/LocaleContext";

function LanguageSwitcher() {
  
  const { locale, setLocale } = useLocale();

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
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-4 transition-colors duration-300"
    >
      {buttonText}
    </button>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(LanguageSwitcher);
