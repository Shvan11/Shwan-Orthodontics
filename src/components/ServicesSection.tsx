"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Dictionary } from "@/types/dictionary";
import Image from "next/image";
import ServiceCard from "./ServiceCard";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
    detailImages: ["/images/braces2.jpg", "/images/braces3.jpeg"],
  },
  aligners: {
    id: "aligners",
    image: "/images/aligners1.jpg",
    detailImages: ["/images/aligners2.jpeg", "/images/aligners3.jpeg"],
  },
  cbct: {
    id: "cbct",
    image: "/images/cbct1.png",
    detailImages: ["/images/cbct2.webp", "/images/cbct3.jpg"],
  },
  scanning: {
    id: "scanning",
    image: "/images/scanning1.png",
    detailImages: ["/images/scanning2.jpg"],
  },
  whitening: {
    id: "whitening",
    image: "/images/whitening1.avif",
    detailImages: ["/images/whitening2.webp", "/images/whitening3.jpg"],
  },
};

export default function ServicesSection({ t, isRTL }: ServicesSectionProps) {
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(
    null
  );
  const [animationComplete, setAnimationComplete] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState<number | null>(
    null
  );

  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 641px) and (max-width: 1024px)"
  );

  const services = useMemo(
    () => t.pages.services.services_list ?? [],
    [t.pages.services.services_list]
  );
  const descriptions = useMemo(
    () => t.pages.services.descriptions ?? [],
    [t.pages.services.descriptions]
  );

  const numColumns = useMemo(
    () => (isSmallScreen ? 1 : isMediumScreen ? 2 : 3),
    [isSmallScreen, isMediumScreen]
  );

  const serviceRows = useMemo(() => {
    const rows: Array<Array<string>> = [];
    const serviceKeys = Object.keys(servicesData);

    for (let i = 0; i < serviceKeys.length; i += numColumns) {
      rows.push(serviceKeys.slice(i, i + numColumns));
    }

    return rows;
  }, [numColumns]);

  const expandedRowIndex = useMemo(
    () =>
      expandedServiceId
        ? serviceRows.findIndex((row) => row.includes(expandedServiceId))
        : -1,
    [expandedServiceId, serviceRows]
  );

  const handleToggle = useCallback((id: string) => {
    setAnimationComplete(false);

    setExpandedServiceId((prevId) => {
      const isCollapsing = prevId !== null;
      const expandingBelow =
        prevId !== null &&
        Object.keys(servicesData).indexOf(id) >
          Object.keys(servicesData).indexOf(prevId);

      if (isCollapsing && expandingBelow) {
        const prevElement = document.getElementById(`expanded-${prevId}`);
        if (prevElement) {
          const prevHeight = prevElement.getBoundingClientRect().height;
          setSavedScrollPosition(window.scrollY - prevHeight);
        }
      }

      return prevId === id ? null : id;
    });
  }, []);

  useEffect(() => {
    if (animationComplete && expandedServiceId) {
      requestAnimationFrame(() => {
        const element = document.getElementById(
          `expanded-${expandedServiceId}`
        );
        const navbar = document.querySelector("nav");

        if (element && navbar) {
          const observer = new ResizeObserver(() => {
            const navbarHeight = navbar.clientHeight || 0;
            const elementTop =
              element.getBoundingClientRect().top + window.scrollY;

            if (savedScrollPosition !== null) {
              window.scrollTo({
                top: savedScrollPosition,
                behavior: "instant",
              });
              setSavedScrollPosition(null);
            }

            window.scrollTo({
              top: elementTop - navbarHeight - 100,
              behavior: "smooth",
            });

            observer.disconnect();
          });

          observer.observe(element);
        }
      });
    }
  }, [animationComplete, expandedServiceId, savedScrollPosition]);

  const expandedService = useMemo(() => {
    if (!expandedServiceId) return null;
    const serviceIndex = Object.keys(servicesData).indexOf(expandedServiceId);
    if (serviceIndex === -1) return null;

    return {
      id: expandedServiceId,
      title: services[serviceIndex] ?? "Unknown Service",
      description: descriptions[serviceIndex] ?? "",
      images: servicesData[expandedServiceId]?.detailImages ?? [],
    };
  }, [expandedServiceId, services, descriptions]);

  return (
    <section id="services" className="mt-12 mx-auto px-4 sm:px-6 max-w-7xl">
      <h2 className="text-3xl font-bold mb-8">{t.pages.services.title}</h2>

      {serviceRows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="mb-6">
          <div
            className={`grid gap-4 sm:gap-6 lg:gap-8 ${
              isSmallScreen
                ? "grid-cols-1"
                : isMediumScreen
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {row.map((serviceKey) => {
              const serviceData = servicesData[serviceKey];
              const serviceIndex =
                Object.keys(servicesData).indexOf(serviceKey);
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
                    priority={rowIndex === 0}
                  />
                </div>
              );
            })}
          </div>

          {rowIndex === expandedRowIndex && expandedService && (
            <AnimatePresence>
              <motion.div
                id={`expanded-${expandedService.id}`}
                key={expandedService.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full mt-4 mb-4 bg-gray-50 border rounded-lg shadow-md overflow-hidden"
                onAnimationComplete={() => setAnimationComplete(true)}
              >
                <div className={`p-6 ${isRTL ? "text-right" : "text-left"}`}>
                  <h3 className="text-2xl font-semibold mb-4 text-blue-700">
                    {expandedService.title}
                  </h3>
                  <p className="text-gray-700 text-lg">
                    {expandedService.description}
                  </p>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expandedService.images.map((imgSrc, imgIndex) => (
                      <motion.div
                        key={imgIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + imgIndex * 0.1 }}
                        className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Image
                          src={imgSrc}
                          alt={`${expandedService.title} detail ${
                            imgIndex + 1
                          }`}
                          width={600}
                          height={400}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                          priority={imgIndex < 2}
                          loading={imgIndex < 2 ? "eager" : "lazy"}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      ))}
    </section>
  );
}
