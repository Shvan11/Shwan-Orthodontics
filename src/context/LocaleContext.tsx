"use client";
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

interface LocaleContextType {
  locale: string;
  setLocale: (newLocale: string) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const detectedLocale = pathname?.startsWith("/ar") ? "ar" : "en";
  const [locale, setLocale] = useState(detectedLocale);
  
  // Memoize the locale change handler to prevent recreation on every render
  const handleChangeLocale = useCallback((newLocale: string) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      const newPath = `/${newLocale}${pathname?.replace(/^\/(en|ar)/, "") || ""}`;
      router.push(newPath);
    }
  }, [locale, pathname, router]);
  
  // Memoize the context value to prevent new object creation on every render
  const contextValue = useMemo(() => ({
    locale,
    setLocale: handleChangeLocale
  }), [locale, handleChangeLocale]);
  
  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}