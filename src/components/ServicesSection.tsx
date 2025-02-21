// src/components/ServicesSection.tsx
/* ========================================================
   Services Section Component - Our Services with Images
   ======================================================== */
   import { memo } from 'react';
   import Image from 'next/image';
   import { Dictionary } from '@/types/dictionary';
   
   interface ServicesSectionProps {
     t: Dictionary;
     isRTL: boolean;
   }
   
   // Memoized ServiceCard component
   const ServiceCard = memo(({ image, title }: { image: string; title: string }) => (
     <div className="bg-white shadow-md rounded-lg overflow-hidden">
       <Image 
         src={image} 
         width={400}
         height={300}
         alt={title} 
         className="w-full h-48 object-cover"
         loading="lazy" // Add lazy loading
       />
       <div className="p-4">
         <h3 className="text-xl font-semibold">{title}</h3>
       </div>
     </div>
   ));
   ServiceCard.displayName = 'ServiceCard';
   
   function ServicesSection({ t }: ServicesSectionProps) {
     const images = [
       "/images/braces_half.jpeg",
       "/images/whitening.webp",
       "/images/aligners.jpg"
     ];
     const services = t.pages.services.services_list;
   
     return (
       <section id="services" className='mt-12 mx-auto px-4 sm:px-6'>
         <h2 className='text-3xl font-bold'>{t.pages.services.title}</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
           {services.map((service: string, index: number) => (
             <ServiceCard
               key={index}
               image={images[index % images.length]}
               title={service}
             />
           ))}
         </div>
       </section>
     );
   }
   
   // Export memoized component to prevent unnecessary re-renders
   export default memo(ServicesSection);