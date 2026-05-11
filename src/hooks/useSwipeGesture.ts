import { useState, useCallback } from 'react';

interface UseSwipeGestureOptions {
  isRTL: boolean;
  minSwipeDistance?: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function useSwipeGesture({
  isRTL,
  minSwipeDistance = 50,
  onNext,
  onPrevious,
}: UseSwipeGestureOptions) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // RTL reverses the visual direction of swiping
    if (isRTL) {
      if (isLeftSwipe) onPrevious();
      if (isRightSwipe) onNext();
    } else {
      if (isLeftSwipe) onNext();
      if (isRightSwipe) onPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, isRTL, minSwipeDistance, onNext, onPrevious]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}
