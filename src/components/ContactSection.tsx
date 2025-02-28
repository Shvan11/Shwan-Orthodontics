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
           <p className="mt-8 text-2xl font-semibold text-center">{t.pages.contact.socialHeading}</p>
   
           {/* Social Media Links - Using Client Component */}
           <SocialMediaLinks />
   
           {/* Google Maps Frame */}
           <p className="mt-8 text-lg font-semibold">{t.pages.contact.mapsHeading}</p>
           <div className="mt-4 rounded-lg overflow-hidden shadow-md">
             <iframe
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.9330256258786!2d42.96253899999999!3d36.868021899999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40088d2a904bd26f%3A0x918a15c34b96aef9!2sShwan%20Orthodontics!5e0!3m2!1sen!2siq!4v1740734860597!5m2!1sen!2siq"
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