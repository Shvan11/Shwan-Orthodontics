"use client";

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  id: string;
  image: string;
  title: string;
  isRTL: boolean;
  isActive: boolean;
  onToggle: (id: string) => void;
}

const ServiceCard = memo(({ 
  id, 
  image, 
  title, 
  isActive, 
  onToggle 
}: ServiceCardProps) => {
  const cardVariants = {
    hover: { 
      y: -3,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.97,
      transition: { duration: 0.15 }
    }
  };

  return (
    <motion.div 
      id={`card-${id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      className={`service-card bg-white shadow-md rounded-lg overflow-hidden ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <button 
        className="w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg" 
        onClick={() => onToggle(id)}
        aria-expanded={isActive}
        aria-controls={`service-content-${id}`}
      >
        <div className="relative">
          <div className="overflow-hidden">
            <Image 
              src={image} 
              width={400}
              height={300}
              alt={title} 
              className={`w-full h-48 sm:h-52 lg:h-56 object-cover transition-transform duration-500 ${
                isActive ? 'scale-105' : 'scale-100 hover:scale-105'
              }`}
              loading="lazy"
            />
          </div>
          {/* <div className={`p-4 flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center`}>  */}
          <div className= "p-4 flex flex-row justify-between items-center"> 
            <h3 className="text-xl font-semibold">{title}</h3>
            <motion.div 
              animate={{ rotate: isActive ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-blue-500 text-xl transform"
              aria-hidden="true"
            >
              {isActive ? '−' : '+'}
            </motion.div>
          </div>
        </div>
      </button>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;