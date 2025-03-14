// src/app/[locale]/layout.tsx

import "@/styles/globals.css";
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dir } from "i18next";
import { LocaleProvider } from "@/context/LocaleContext";
import HTMLDirectionManager from "@/components/HTMLDirectionManager";
import { Analytics } from "@vercel/analytics/react"
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
 

 // Await the params Promise
 const resolvedParams = await params;
 const detectedLang = resolvedParams.locale;

  
  // Log the locale (might still be undefined in some cases)
  console.log("🚀 detectedLang", detectedLang);

  return (
    <html lang={detectedLang || ''} dir={detectedLang ? dir(detectedLang) : 'ltr'}>
      <body className="min-h-screen flex flex-col">
        <LocaleProvider>
          <HTMLDirectionManager initialLocale={detectedLang || ''} />
          <Navbar />
          <main className="flex-grow container mx-auto p-4">
            {children}
            <Analytics />
          </main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}