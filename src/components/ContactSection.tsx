// src/components/ContactSection.tsx
/* ========================================================
   Contact Section Component - Contact Information
   ======================================================== */
   import { Dictionary } from '@/types/dictionary';
   import SocialMediaLinks from './SocialMediaLinks';
   
   interface ContactSectionProps {
     t: Dictionary;
     isRTL: boolean;
   }
   
   export default function ContactSection({ t }: ContactSectionProps) {
     return (
       <section id="contact" className="mt-12 mx-auto px-4 sm:px-6">
         <h2 className="text-3xl font-bold mb-6">{t.pages.contact.title}</h2>
         <div className="max-w-3xl mx-auto">
           <p className="mt-4">{t.pages.contact.email}</p>
           <p className="mt-2">{t.pages.contact.phone}</p>
           <p className="mt-2">{t.pages.contact.address}</p>
   
           {/* Social Media Description */}
           <p className="mt-8 text-2xl font-semibold text-center">Follow us on social media to stay connected!</p>
   
           {/* Social Media Links - Using Client Component */}
           <SocialMediaLinks />
   
           {/* Google Maps Frame */}
           <p className="mt-8 text-lg font-semibold">Find us on the map below:</p>
           <div className="mt-4 rounded-lg overflow-hidden shadow-md">
             <iframe
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345092917!2d144.95373531571696!3d-37.81627977975179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727b8b1d8d4f9b!2sShwan%20Orthodontics!5e0!3m2!1sen!2sus!4v1614302690507!5m2!1sen!2sus"
               width="100%"
               height="400"
               style={{ border: 0 }}
               allowFullScreen={true}
               loading="lazy"
             ></iframe>
           </div>
         </div>
       </section>
     );
   }