'use client';
// src/components/SocialMediaLinks.tsx

import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function SocialMediaLinks() {
  const handleFacebookClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      e.preventDefault();
      window.location.href = 'fb://facewebmodal/f?href=https://www.facebook.com/Shwan.Ortho';
    }
  };

  const handleInstagramClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      e.preventDefault();
      window.location.href = 'instagram://user?username=shwan.ortho';
    }
  };

  return (
    <div className="mt-6 flex justify-center px-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:flex md:gap-12 gap-8 w-full max-w-lg">
        <div className="flex flex-col items-center">
          <a 
            href="https://www.facebook.com/Shwan.Ortho" 
            onClick={handleFacebookClick}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <FaFacebook className="text-4xl md:text-5xl lg:text-6xl text-blue-600 hover:text-blue-800 transition-colors duration-300" />
          </a>
          <p className="text-center text-sm mt-2">Shwan.Ortho</p>
        </div>
        
        <div className="flex flex-col items-center">
          <a 
            href="https://www.instagram.com/shwan.ortho" 
            onClick={handleInstagramClick}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <FaInstagram className="text-4xl md:text-5xl lg:text-6xl text-pink-500 hover:text-pink-700 transition-colors duration-300" />
          </a>
          <p className="text-center text-sm mt-2">Shwan.Ortho</p>
        </div>
        
        <div className="flex flex-col items-center">
          <a 
            href="https://www.tiktok.com/@shwan.ortho" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <FaTiktok className="text-4xl md:text-5xl lg:text-6xl text-black hover:text-gray-800 transition-colors duration-300" />
          </a>
          <p className="text-center text-sm mt-2">Shwan.Ortho</p>
        </div>
        
        <div className="flex flex-col items-center">
          <a 
            href="https://www.youtube.com/@shwan.ortho" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <FaYoutube className="text-4xl md:text-5xl lg:text-6xl text-red-600 hover:text-red-800 transition-colors duration-300" />
          </a>
          <p className="text-center text-sm mt-2">Shwan.Ortho</p>
        </div>
      </div>
    </div>
  );
}