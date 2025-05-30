// src/app/[locale]/layout.tsx

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dir } from "i18next";
import { LocaleProvider } from "@/context/LocaleContext";
import HTMLDirectionManager from "@/components/HTMLDirectionManager";
import { Analytics } from "@vercel/analytics/react";
import { getDictionary } from "@/lib/getDictionary";
import type { Metadata } from 'next';
import ErrorBoundary from "@/components/ErrorBoundary";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getDictionary(locale);
  
  const baseUrl = 'https://shwanorthodontics.com';
  const canonicalUrl = `${baseUrl}/${locale}`;
  
  return {
    title: t.seo?.title || 'Shwan Orthodontics',
    description: t.seo?.description || 'Professional orthodontic care in Duhok, Iraq',
    keywords: t.seo?.keywords || 'orthodontics, braces, aligners, dental care, Duhok, Iraq',
    authors: [{ name: 'Dr. Shwan Elias' }],
    creator: 'Shwan Orthodontics',
    publisher: 'Shwan Orthodontics',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': '/en',
        'ar': '/ar',
      },
    },
    openGraph: {
      title: t.seo?.title || 'Shwan Orthodontics',
      description: t.seo?.description || 'Professional orthodontic care in Duhok, Iraq',
      url: canonicalUrl,
      siteName: t.seo?.siteName || 'Shwan Orthodontics',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/images/_logo.png',
          width: 1200,
          height: 630,
          alt: 'Shwan Orthodontics Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.seo?.title || 'Shwan Orthodontics',
      description: t.seo?.description || 'Professional orthodontic care in Duhok, Iraq',
      images: ['/images/_logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-token',
    },
  };
}

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DentalClinic",
            "name": "Shwan Orthodontics",
            "description": "Professional orthodontic care in Duhok, Kurdistan Region, Iraq",
            "url": "https://shwanorthodontics.com",
            "telephone": "+964-750-810-8833",
            "email": "shwan.elias@uod.ac",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "KRO Street",
              "addressLocality": "Duhok",
              "addressRegion": "Kurdistan Region",
              "addressCountry": "Iraq"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "36.8475",
              "longitude": "42.9638"
            },
            "openingHours": "Mo-Sa 09:00-18:00",
            "medicalSpecialty": "Orthodontics",
            "availableService": [
              {
                "@type": "MedicalProcedure",
                "name": "Orthodontic Braces"
              },
              {
                "@type": "MedicalProcedure",
                "name": "Clear Aligners"
              },
              {
                "@type": "MedicalProcedure",
                "name": "Teeth Whitening"
              },
              {
                "@type": "MedicalProcedure",
                "name": "CBCT Scanning"
              }
            ],
            "physician": {
              "@type": "Person",
              "name": "Dr. Shwan Elias",
              "jobTitle": "Orthodontist"
            }
          })
        }}
      />
      <div className="min-h-screen flex flex-col" lang={detectedLang || ''} dir={detectedLang ? dir(detectedLang) : 'ltr'}>
        <ErrorBoundary>
          <LocaleProvider>
            <HTMLDirectionManager initialLocale={detectedLang || ''} />
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
              {children}
              <Analytics />
            </main>
            <Footer />
          </LocaleProvider>
        </ErrorBoundary>
      </div>
    </>
  );
}