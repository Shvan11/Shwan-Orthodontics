// src/components/FAQToggle.tsx
"use client";

import { useState } from 'react';

interface FAQToggleProps {
  index: number;
  question: string;
  answer: string;
  isRTL?: boolean; 
}

const FAQToggle = ({ index, question, answer, isRTL = false }: FAQToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const faqId = `faq-${index}`;

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-300 py-5">
      <button 
        onClick={toggleFAQ} 
        className={`w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
        aria-expanded={isOpen}
        aria-controls={faqId}
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} FAQ: ${question}`}
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
      <div
        id={faqId}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!isOpen}
      >
        <p className={`mt-3 text-gray-700 px-1 whitespace-pre-line ${isRTL ? 'text-right' : 'text-left'}`}>{answer}</p>
      </div>
    </div>
  );
};

export default FAQToggle;