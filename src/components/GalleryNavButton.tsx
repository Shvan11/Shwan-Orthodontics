interface GalleryNavButtonProps {
  side: 'left' | 'right';
  isRTL: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function GalleryNavButton({ side, isRTL, onPrevious, onNext }: GalleryNavButtonProps) {
  const isLeft = side === 'left';
  // Left button navigates backward in LTR, forward in RTL (and vice-versa)
  const onClick = isLeft ? (isRTL ? onNext : onPrevious) : (isRTL ? onPrevious : onNext);
  const label   = isLeft ? (isRTL ? 'Next' : 'Previous') : (isRTL ? 'Previous' : 'Next');
  const icon    = isLeft ? (isRTL ? '❯' : '❮') : (isRTL ? '❮' : '❯');

  return (
    <button
      className={`absolute top-1/2 ${isLeft ? 'left-2' : 'right-2'} -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full z-10 hover:bg-opacity-90`}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
