// src/app/[locale]/page.tsx
/* ========================================================
   Single Page Layout with Multilingual Support
   ======================================================== */

import { getDictionary } from "@/lib/getDictionary";
import HomeSection from "@/components/HomeSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import ServicesSection from "@/components/ServicesSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
    // Add error handling for getDictionary
    let t;
    try {
      t = await getDictionary(locale);
    } catch (error) {
      console.error("❌ Failed to load dictionary:", error);
      // Provide a fallback to avoid a broken page
      t = {
        pages: {
          home: {
            title: "Content unavailable",
          }
        }
      };
    }
  const isRTL = locale === "ar";

  return (
    <div className={`${isRTL ? "text-right" : "text-left"}`}>
      {/* Home Section */}
      <HomeSection t={t} isRTL={isRTL} />

      {/* About Section */}
      <AboutSection t={t} isRTL={isRTL} />

      {/* Services Section */}
      <ServicesSection t={t} isRTL={isRTL} />

      {/* Gallery Section */}
      <GallerySection t={t} isRTL={isRTL} />

      {/* FAQ Section */}
      <FAQSection t={t} isRTL={isRTL} />

      {/* Contact Section */}
      <ContactSection t={t} isRTL={isRTL} />
    </div>
  );
}
