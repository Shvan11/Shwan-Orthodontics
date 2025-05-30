"use client";
import Image from "next/image";
import {
  useState,
  useRef,
  useEffect,
  TouchEvent,
  useCallback,
  memo,
} from "react";

interface GalleryItem {
  before: string;
  after: string;
  description: string;
}

interface GalleryCarouselProps {
  items: GalleryItem[];
  isRTL?: boolean;
}

// Memoized pagination button component
const PaginationButton = memo(
  ({
    index,
    isActive,
    onClick,
  }: {
    index: number;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      className={`w-3 h-3 rounded-full ${
        isActive ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={onClick}
      aria-label={`Go to slide ${index + 1}`}
    />
  )
);
PaginationButton.displayName = "PaginationButton";


// Memoized gallery item component
const GalleryItem = memo(
  ({ item, index }: { item: GalleryItem; index: number }) => (
    <div className="min-w-full snap-start p-4">
      <div className="max-w-lg mx-auto border rounded-lg overflow-hidden shadow-lg">
        {/* Case description at the top */}
        <div className="bg-gray-100 p-3 font-medium">{item.description}</div>

        {/* Before image */}
        <div className="relative">
          <Image
            src={item.before}
            alt={`Case ${index + 1} Before`}
            className="w-full h-64 object-cover"
            width={400}
            height={300}
            loading="lazy" // Add lazy loading
          />
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1">
            Before
          </div>
        </div>

        {/* After image */}
        <div className="relative">
          <Image
            src={item.after}
            alt={`Case ${index + 1} After`}
            className="w-full h-64 object-cover"
            width={400}
            height={300}
            loading="lazy" // Add lazy loading
          />
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1">
            After
          </div>
        </div>
      </div>
    </div>
  )
);
GalleryItem.displayName = "GalleryItem";

const GalleryCarousel = ({ items, isRTL = false }: GalleryCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Memoize handlers to prevent recreation on each render
  // const scrollToIndex = useCallback((index: number) => {
  //   if (carouselRef.current) {
  //     const container = carouselRef.current;
  //     const children = container.children;

  //     if (children[index]) {
  //       children[index].scrollIntoView({
  //         behavior: "smooth",
  //         block: "nearest",
  //         inline: "start",
  //       });
  //     }

  //     setActiveIndex(index);
  //   }
  // }, []); // Empty dependency array since carouselRef doesn't change
  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const children = container.children;
      
      if (children[index]) {
        children[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      }
      
      setActiveIndex(index);
    }
  };
  
  const scrollLeft = useCallback(() => {
    setActiveIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const scrollRight = useCallback(() => {
    setActiveIndex((prevIndex) => Math.min(items.length - 1, prevIndex + 1));
  }, [items.length]); // Only depends on items length

  // Touch event handlers for swipe functionality
  const onTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // For RTL layouts, we need to reverse the swipe direction logic
    if (isRTL) {
      if (isLeftSwipe) {
        scrollLeft();
      }
      if (isRightSwipe) {
        scrollRight();
      }
    } else {
      if (isLeftSwipe) {
        scrollRight();
      }
      if (isRightSwipe) {
        scrollLeft();
      }
    }

    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, isRTL, scrollLeft, scrollRight]);

  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleSwipeIndicator = () => {
      const container = carouselRef.current;
      if (!container) return;

      // Add swipe indicator on mobile devices
      const isMobile = window.innerWidth <= 768;
      if (isMobile && items.length > 1) {
        // Show swipe hint animation on first load
        const indicator = document.createElement("div");
        indicator.className = "swipe-indicator";
        container.appendChild(indicator);

        // Store the reference
        indicatorRef.current = indicator;

        // Remove indicator after animation
        timeoutRef.current = window.setTimeout(() => {
          if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
          }
          indicatorRef.current = null;
        }, 3000);
      }
    };

    // Run once after component mounts
    handleSwipeIndicator();

    // Cleanup
    return () => {
      // Clear timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Remove the indicator directly
      if (indicatorRef.current && indicatorRef.current.parentNode) {
        indicatorRef.current.parentNode.removeChild(indicatorRef.current);
        indicatorRef.current = null;
      }
    };
  }, [items.length]); // Empty dependency array - only run on mount

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full z-10 hover:bg-opacity-90"
        onClick={isRTL ? scrollRight : scrollLeft}
        aria-label={isRTL ? "Next" : "Previous"}
      >
        {isRTL ? "❯" : "❮"}
      </button>

      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full z-10 hover:bg-opacity-90"
        onClick={isRTL ? scrollLeft : scrollRight}
        aria-label={isRTL ? "Previous" : "Next"}
      >
        {isRTL ? "❮" : "❯"}
      </button>

      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", direction: isRTL ? "rtl" : "ltr" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {items.map((item, index) => (
          <GalleryItem key={index} item={item} index={index} />
        ))}
      </div>

      {/* Pagination indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {items.map((_, index) => (
          <PaginationButton
            key={index}
            index={index}
            isActive={index === activeIndex}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>

      {/* Custom CSS to hide scrollbar and add swipe indicator */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes swipeAnimation {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(30px);
          }
        }

        .swipe-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 24px;
          animation: swipeAnimation 2s ease-in-out infinite;
          z-index: 20;
        }

        .swipe-indicator:before {
          content: "⇄";
        }
      `}</style>

      {/* Mobile swipe instruction (only visible on first load) */}
      <div className="text-center text-sm text-gray-500 mt-2 md:hidden">
        Swipe left or right to navigate
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(GalleryCarousel);
