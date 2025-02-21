// src/components/FAQToggle.tsx
"use client";

import { useState } from 'react';

interface FAQToggleProps {
  index: number;
  question: string;
  answer: string;
  isRTL?: boolean; 
}

const FAQToggle = ({  question, answer }: FAQToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-300 py-5">
      <button 
        onClick={toggleFAQ} 
        className="w-full focus:outline-none flex items-center justify-between"
      >
        <h3 className="text-xl font-semibold">{question}</h3>
        <span className="text-blue-500 text-xl">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <p className="mt-3 text-gray-700 px-1">{answer}</p>
      )}
    </div>
  );
};

export default FAQToggle;