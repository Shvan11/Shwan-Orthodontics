// src/components/GallerySection.tsx
/* ========================================================
   Gallery Section Component - Before & After Gallery
   ======================================================== */
   import { memo } from 'react';
   import { Dictionary } from '@/types/dictionary';
   import Image from 'next/image';
   import logo from '@public/images/_logo.png';
   import LogoWatermark from './LogoWatermark';
   import MobileGalleryCarousel from './MobileGalleryCarousel';
   import { GalleryCase } from '@/types/gallery';
   
   interface GallerySectionProps {
     t: Dictionary;
     isRTL: boolean;
   }
   
   function GallerySection({ t, isRTL }: GallerySectionProps) {
     // Generate the gallery data structure from translations
     const galleryData: GalleryCase[] = t.pages.gallery.cases.map((caseItem) => {
       const casePhotos = caseItem.photos.map((photo, photoIndex) => {
         const photoNumber = photoIndex + 1;
         return {
           before: `case${caseItem.id}/before-${photoNumber}.jpg`,
           after: `case${caseItem.id}/after-${photoNumber}.jpg`,
           description: photo.description
         };
       });
   
       return {
         id: caseItem.id,
         title: caseItem.title,
         photos: casePhotos
       };
     });
   
     return (
       <section id="gallery" className='mt-12 mx-auto px-4 sm:px-6'>
         <h2 className='text-3xl font-bold mb-6 text-center'>{t.pages.gallery.title}</h2>
   
         {/* Mobile view - Swipeable carousel */}
         <div className="md:hidden">
           <MobileGalleryCarousel t={t} isRTL={isRTL} galleryData={galleryData}  />
         </div>
   
         {/* Desktop view - Grid layout */}
         <div className="hidden md:block">
           {galleryData.map((caseItem) => (
             <div key={caseItem.id} className="mb-12">
               <h3 className="text-2xl font-semibold mb-4">
               {t.pages.gallery.casePrefix} {caseItem.id}: {caseItem.title}
               </h3>
   
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {caseItem.photos.map((photo, photoIndex) => (
                   <div key={photoIndex} className="flex flex-col border rounded-lg overflow-hidden shadow-lg">
                     {/* Photo description */}
                     {photo.description && (
                       <div className="bg-gray-100 p-3 font-medium text-center">
                         {photo.description}
                       </div>
                     )}
   
                     {/* Before image with watermark */}
                     <div className="relative">
                       <div className="relative h-64 w-full">
                         <Image
                           src={`/images/gallery/${photo.before}`}
                           alt={`Case ${caseItem.id} ${photo.description} Before`}
                           className="object-contain bg-white"
                           fill
                           sizes="(max-width: 1200px) 50vw, 33vw"
                         />
                         <LogoWatermark opacity={0.35} position="center" size="medium" />
                         <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 z-20">
                           Before
                         </div>
                       </div>
                     </div>
   
                     {/* Logo in the middle */}
                     <div className="flex justify-center items-center py-0 h-8 bg-gray-700">
                       <Image
                         src={logo}
                         alt="Shwan Orthodontics Logo"
                         width={80}
                         height={30}
                         className="h-6 object-contain"
                       />
                     </div>
   
                     {/* After image with watermark */}
                     <div className="relative">
                       <div className="relative h-64 w-full">
                         <Image
                           src={`/images/gallery/${photo.after}`}
                           alt={`Case ${caseItem.id} ${photo.description} After`}
                           className="object-contain bg-white"
                           fill
                           sizes="(max-width: 1200px) 50vw, 33vw"
                         />
                         <LogoWatermark opacity={0.35} position="center" size="medium" />
                         <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 z-20">
                           After
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </section>
     );
   }
   
   // Export memoized component to prevent unnecessary re-renders
   export default memo(GallerySection);