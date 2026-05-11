import Image from 'next/image';
import LogoWatermark from './LogoWatermark';

interface BeforeAfterImageProps {
  src: string;
  alt: string;
  label: string;
  sizes: string;
  priority?: boolean;
}

export default function BeforeAfterImage({ src, alt, label, sizes, priority }: BeforeAfterImageProps) {
  return (
    <div className="relative">
      <div className="relative h-64 w-full">
        <Image
          src={src}
          alt={alt}
          className="object-contain bg-white"
          fill
          sizes={sizes}
          priority={priority}
        />
        <LogoWatermark opacity={0.2} position="center" size="medium" />
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 z-20">
          {label}
        </div>
      </div>
    </div>
  );
}
