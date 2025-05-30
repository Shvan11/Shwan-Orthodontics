// src/components/FAQSection.tsx
/* ========================================================
   FAQ Section Component - Frequently Asked Questions
   ======================================================== */
   import FAQToggle from "@/components/FAQToggle";
   import { Dictionary } from "@/types/dictionary";
   
   interface FAQSectionProps {
     t: Dictionary;
     isRTL: boolean;
   }
   
   export default function FAQSection({ t, isRTL }: FAQSectionProps) {
     return (
       <section id="faq" className='mt-12 mx-auto px-4 sm:px-6'>
         <h2 className='text-3xl font-bold mb-6'>{t.pages.faq.title}</h2>
         <div className="max-w-3xl mx-auto">
           {t.pages.faq.questions.map((faq: { question: string, answer: string }, index: number) => (
             <FAQToggle 
               key={index} 
               index={index} 
               question={faq.question} 
               answer={faq.answer} 
               isRTL={isRTL}
             />
           ))}
         </div>
       </section>
     );
   }