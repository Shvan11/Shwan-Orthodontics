"use client";

import { useState, useMemo, useCallback } from 'react';
import { Dictionary } from '@/types/dictionary';
import Image from 'next/image';
import ServiceCard from './ServiceCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ServiceData {
  id: string;
  image: string;
  detailImages: string[];
}

interface ServicesSectionProps {
  t: Dictionary;
  isRTL: boolean;
}

const servicesData: Record<string, ServiceData> = {
  braces: {
    id: "braces",
    image: "/images/braces1.jpeg",
    detailImages: [
      "/images/braces2.jpg",
      "/images/braces3.jpeg",
    ],
  },
  aligners: {
    id: "aligners",
    image: "/images/aligners1.jpg",
    detailImages: [
      "/images/aligners2.jpeg",
      "/images/aligners3.jpeg",
    ],
  },

  cbct: {
    id: "cbct",
    image: "/images/cbct1.png",
    detailImages: [
      "/images/cbct2.webp",
      "/images/cbct3.jpg",
    ],
  }, 
  scanning: {
    id: "scanning",
    image: "/images/scanning1.png",
    detailImages: [
      "/images/scanning2.jpg"
    ]
    },
   whitening: {
    id: "whitening",
    image: "/images/whitening1.avif",
    detailImages: [
      "/images/whitening2.webp",
      "/images/whitening3.jpg",
    ],
  },
};

export default function ServicesSection({ t, isRTL }: ServicesSectionProps) {
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  
  const isSmallScreen = useMediaQuery('(max-width: 640px)');
  const isMediumScreen = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  
  const services = useMemo(() => 
    t.pages.services.services_list ?? [], 
    [t.pages.services.services_list]
  );
  
  const descriptions = useMemo(() => 
    t.pages.services.descriptions ?? [], 
    [t.pages.services.descriptions]
  );

  // Memoize the column count calculation
  const numColumns = useMemo(() => 
    isSmallScreen ? 1 : isMediumScreen ? 2 : 3, 
    [isSmallScreen, isMediumScreen]
  );

  const handleToggle = useCallback((id: string) => {
    setExpandedServiceId((prevId) => (prevId === id ? null : id));
  
    if (isSmallScreen) {
      requestAnimationFrame(() => {
        const element = document.getElementById(`expanded-${id}`);
        const navbar = document.querySelector("nav"); // Select the navbar
        
        if (element && navbar) {
          const observer = new ResizeObserver(() => {
            const navbarHeight = navbar.clientHeight || 0; // Get navbar height
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            
            window.scrollTo({
              top: elementTop - navbarHeight - 10, // Adjust for navbar height
              behavior: "smooth"
            });
  
            observer.disconnect(); // Stop observing once done
          });
  
          observer.observe(element);
        }
      });
    }
  }, [isSmallScreen]);
  
  const expandedService = useMemo(() => {
    if (!expandedServiceId) return null;

    const serviceIndex = Object.keys(servicesData).indexOf(expandedServiceId);
    if (serviceIndex === -1) return null;

    return {
      id: expandedServiceId,
      title: services[serviceIndex] ?? "Unknown Service",
      description: descriptions[serviceIndex] ?? '',
      images: servicesData[expandedServiceId]?.detailImages ?? [],
    };
  }, [expandedServiceId, services, descriptions]);
  
  // Memoize the service rows to prevent unnecessary recalculations
  const serviceRows = useMemo(() => {
    const rows: Array<Array<string>> = [];
    const serviceKeys = Object.keys(servicesData);
    
    for (let i = 0; i < serviceKeys.length; i += numColumns) {
      rows.push(serviceKeys.slice(i, i + numColumns));
    }
    
    return rows;
  }, [numColumns]);
  
  // Find which row contains the expanded service - memoized
  const expandedRowIndex = useMemo(() => 
    expandedServiceId 
      ? serviceRows.findIndex(row => row.includes(expandedServiceId))
      : -1,
    [expandedServiceId, serviceRows]
  );

  // Animation variants
  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <section id="services" className='mt-12 mx-auto px-4 sm:px-6 max-w-7xl'>
      <h2 className='text-3xl font-bold mb-8'>{t.pages.services.title}</h2>
      
      {serviceRows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="mb-6">
          {/* Service cards row */}
          <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
            isSmallScreen ? 'grid-cols-1' : 
            isMediumScreen ? 'grid-cols-2' : 
            'grid-cols-3'
          }`}>
            {row.map((serviceKey) => {
              const serviceData = servicesData[serviceKey];
              const serviceIndex = Object.keys(servicesData).indexOf(serviceKey);
              const isActive = expandedServiceId === serviceData.id;
              
              return (
                <div key={serviceData.id}>
                  <ServiceCard
                    id={serviceData.id}
                    image={serviceData.image}
                    title={services[serviceIndex]}
                    isRTL={isRTL}
                    isActive={isActive}
                    onToggle={() => handleToggle(serviceData.id)}
                  />
                </div>
              );
            })}
            
            {/* Fill empty cells with invisible placeholders to maintain grid layout */}
            {row.length < numColumns && Array(numColumns - row.length).fill(0).map((_, i) => (
              <div key={`placeholder-${i}`} className="invisible" aria-hidden="true"></div>
            ))}
          </div>
          
          {/* Expanded service details, only show if this row contains the expanded service */}
          {rowIndex === expandedRowIndex && expandedService && (
            <AnimatePresence>
              <motion.div 
                id={`expanded-${expandedService.id}`}
                key={expandedService.id}
                variants={detailsVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full mt-4 mb-4 bg-gray-50 border rounded-lg shadow-md overflow-hidden"
              >
                <div className={`p-6 ${isRTL ? "text-right" : "text-left"}`}>
                  <h3 className="text-2xl font-semibold mb-4 text-blue-700">{expandedService.title}</h3>
                  <p className="text-gray-700 text-lg">{expandedService.description}</p>
                  {expandedService.images.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {expandedService.images.map((imgSrc, imgIndex) => (
                        <motion.div 
                          key={imgIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + (imgIndex * 0.1) }}
                          className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Image 
                            src={imgSrc} 
                            alt={`${expandedService.title} detail ${imgIndex + 1}`}
                            width={600}
                            height={400}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                            priority={imgIndex < 2} // Prioritize loading the first two images
                            loading={imgIndex < 2 ? "eager" : "lazy"}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      ))}
    </section>
  );
}