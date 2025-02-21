// src/components/FAQToggle.tsx
"use client";

import { useState } from 'react';

interface FAQToggleProps {
  index: number;
  question: string;
  answer: string;
  isRTL?: boolean; 
}

const FAQToggle = ({ question, answer, isRTL = false }: FAQToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-300 py-5">
      <button 
        onClick={toggleFAQ} 
        className={`w-full focus:outline-none flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <div className={`flex-grow ${isRTL ? 'text-right' : 'text-left'}`}>
          <h3 className="text-xl font-semibold">{question}</h3>
        </div>
        <div className="flex-shrink-0 mx-4">
          <span className="text-blue-500 text-xl">
            {isOpen ? '−' : '+'}
          </span>
        </div>
      </button>
      {isOpen && (
        <p className={`mt-3 text-gray-700 px-1 ${isRTL ? 'text-right' : 'text-left'}`}>{answer}</p>
      )}
    </div>
  );
};

export default FAQToggle;