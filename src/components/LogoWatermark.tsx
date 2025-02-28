// src/components/LogoWatermark.tsx

import Image from 'next/image';
import logo from '@public/images/_logo.png';

interface LogoWatermarkProps {
  opacity?: number;
  position?: 'center' | 'bottom-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
}

export default function LogoWatermark({ 
  opacity = 0.5, 
  position = 'center',
  size = 'medium' 
}: LogoWatermarkProps) {
  
  // Determine position classes
  let positionClasses = '';
  switch (position) {
    case 'center':
      positionClasses = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      break;
    case 'bottom-right':
      positionClasses = 'bottom-4 right-4';
      break;
    case 'top-left':
      positionClasses = 'top-4 left-4';
      break;
  }
  
  // Determine size
  let width = 0;
  let height = 0;
  switch (size) {
    case 'small':
      width = 60;
      height = 60;
      break;
    case 'medium':
      width = 100;
      height = 100;
      break;
    case 'large':
      width = 150;
      height = 150;
      break;
  }
  
  return (
    <div className={`absolute ${positionClasses} z-10 pointer-events-none`} style={{ opacity }}>
      <Image 
        src={logo} 
        alt="Shwan Orthodontics Logo" 
        width={width} 
        height={height}
        className="h-auto"
      />
    </div>
  );
}