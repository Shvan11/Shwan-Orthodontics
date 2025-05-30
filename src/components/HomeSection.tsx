// src/components/HomeSection.tsx
/* ========================================================
   Home Section Component - Hero and Welcome Message
   ======================================================== */
   import { Dictionary } from '@/types/dictionary';
   import { memo } from 'react';
   
   interface HomeSectionProps {
     t: Dictionary;
     isRTL: boolean;
   }
   
   function HomeSection({ t }: HomeSectionProps) {
     return (
       <section id="home" className='relative bg-gray-700 h-96 mx-auto'>  
         <div className='absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 sm:px-6'>  
           <h1 className='text-4xl text-white font-bold text-center'>{t.pages.home.title}</h1>  
         </div>
       </section>
     );
   }
   
   // Export memoized component to prevent unnecessary re-renders
   export default memo(HomeSection);