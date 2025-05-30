// src/components/AboutSection.tsx

import { Dictionary } from "@/types/dictionary";

/* ========================================================
   About Section Component - Mission and Information
   ======================================================== */
interface AboutSectionProps {
  t: Dictionary;
  isRTL: boolean;
}

export default function AboutSection({ t }: AboutSectionProps) {
  return (
    <section id="about" className='mt-12 mx-auto px-4 sm:px-6'>
      <h2 className='text-3xl font-bold'>{t.pages.about.title}</h2>
      <p className='mt-4'>{t.pages.about.mission}</p>
    </section>
  );
}