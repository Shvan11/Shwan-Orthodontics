'use client';

import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface SocialLink {
  name: string;
  Icon: IconType;
  url: string;
  iconClass: string;
  handle: string;
  appUrl: string | null;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Facebook',
    Icon: FaFacebook,
    url: 'https://www.facebook.com/Shwan.Ortho',
    iconClass: 'text-blue-600 hover:text-blue-800',
    handle: 'Shwan.Ortho',
    appUrl: 'fb://facewebmodal/f?href=https://www.facebook.com/Shwan.Ortho',
  },
  {
    name: 'Instagram',
    Icon: FaInstagram,
    url: 'https://www.instagram.com/shwan.ortho',
    iconClass: 'text-pink-500 hover:text-pink-700',
    handle: 'Shwan.Ortho',
    appUrl: 'instagram://user?username=shwan.ortho',
  },
  {
    name: 'TikTok',
    Icon: FaTiktok,
    url: 'https://www.tiktok.com/@shwan.ortho',
    iconClass: 'text-black hover:text-gray-800',
    handle: 'Shwan.Ortho',
    appUrl: null,
  },
  {
    name: 'YouTube',
    Icon: FaYoutube,
    url: 'https://www.youtube.com/@shwan.ortho',
    iconClass: 'text-red-600 hover:text-red-800',
    handle: 'Shwan.Ortho',
    appUrl: null,
  },
];

function handleMobileAppRedirect(e: React.MouseEvent<HTMLAnchorElement>, appUrl: string | null) {
  if (appUrl && /Mobi|Android/i.test(navigator.userAgent)) {
    e.preventDefault();
    window.location.href = appUrl;
  }
}

export default function SocialMediaLinks() {
  return (
    <div className="mt-6 flex justify-center px-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:flex md:gap-12 gap-8 w-full max-w-lg">
        {SOCIAL_LINKS.map(({ name, Icon, url, iconClass, handle, appUrl }) => (
          <div key={name} className="flex flex-col items-center">
            <a
              href={url}
              onClick={(e) => handleMobileAppRedirect(e, appUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center"
              aria-label={name}
            >
              <Icon className={`text-4xl md:text-5xl lg:text-6xl transition-colors duration-300 ${iconClass}`} />
            </a>
            <p className="text-center text-sm mt-2">{handle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
