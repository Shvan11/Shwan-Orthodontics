// src/components/GallerySection.tsx
/* ========================================================
   Gallery Section Component - Before & After Gallery
   ======================================================== */
   import { memo } from 'react';
   import GalleryCarousel from "@/components/GalleryCarousel";
   import { Dictionary } from '@/types/dictionary';
   
   interface GallerySectionProps {
     t: Dictionary;
     isRTL: boolean;
   }
   
   function GallerySection({ t, isRTL }: GallerySectionProps) {
     const galleryItems = Array.from({ length: 3 }, (_, index) => ({
       before: `https://picsum.photos/400/300`,
       after: `https://picsum.photos/400/300`,
       description: `Case ${index + 1}`
     }));
     
     return (
       <section id="gallery" className='mt-12 mx-auto px-4 sm:px-6'>
         <h2 className='text-3xl font-bold mb-6'>{t.pages.gallery.title}</h2>
         <GalleryCarousel items={galleryItems} isRTL={isRTL} />
       </section>
     );
   }
   
   // Export memoized component to prevent unnecessary re-renders
   export default memo(GallerySection);