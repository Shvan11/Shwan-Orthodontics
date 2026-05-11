import Image from 'next/image';
import logo from '@public/images/_logo.png';

export default function GalleryLogoStrip() {
  return (
    <div className="flex justify-center items-center py-0 h-8 bg-gray-700">
      <Image
        src={logo}
        alt="Shwan Orthodontics Logo"
        width={logo.width}
        height={logo.height}
        style={{ height: '1.5rem', width: 'auto' }}
        className="object-contain"
      />
    </div>
  );
}
