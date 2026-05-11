"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import GalleryNavButton from "./GalleryNavButton";

interface GalleryItem {
  before: string;
  after: string;
  description: string;
}

interface GalleryCarouselProps {
  items: GalleryItem[];
  isRTL?: boolean;
}

const PaginationButton = memo(
  ({ index, isActive, onClick }: { index: number; isActive: boolean; onClick: () => void }) => (
    <button
      className={`w-3 h-3 rounded-full ${isActive ? "bg-blue-500" : "bg-gray-300"}`}
      onClick={onClick}
      aria-label={`Go to slide ${index + 1}`}
    />
  )
);
PaginationButton.displayName = "PaginationButton";

const GalleryItem = memo(
  ({ item, index }: { item: GalleryItem; index: number }) => (
    <div className="min-w-full snap-start p-4">
      <div className="max-w-lg mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gray-100 p-3 font-medium">{item.description}</div>
        <div className="relative">
          <Image
            src={item.before}
            alt={`Case ${index + 1} Before`}
            className="w-full h-64 object-cover"
            width={400}
            height={300}
            sizes="(max-width: 768px) 100vw, 512px"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1">
            Before
          </div>
        </div>
        <div className="relative">
          <Image
            src={item.after}
            alt={`Case ${index + 1} After`}
            className="w-full h-64 object-cover"
            width={400}
            height={300}
            sizes="(max-width: 768px) 100vw, 512px"
            loading="lazy"
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
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const shownRef = useRef(false);

  const scrollToIndex = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const child = carouselRef.current.children[index];
    if (child) {
      child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
    setActiveIndex(index);
  }, []);

  const scrollPrevious = useCallback(() => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const scrollNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(items.length - 1, prev + 1));
  }, [items.length]);

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture({
    isRTL,
    onNext: scrollNext,
    onPrevious: scrollPrevious,
  });

  useEffect(() => {
    if (shownRef.current) return;
    const container = carouselRef.current;
    if (!container || window.innerWidth > 768 || items.length <= 1) return;

    shownRef.current = true;
    const indicator = document.createElement("div");
    indicator.className = "swipe-indicator";
    container.appendChild(indicator);
    indicatorRef.current = indicator;

    timeoutRef.current = window.setTimeout(() => {
      indicator.parentNode?.removeChild(indicator);
      indicatorRef.current = null;
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      indicatorRef.current?.parentNode?.removeChild(indicatorRef.current);
      indicatorRef.current = null;
    };
  }, [items.length]);

  return (
    <div className="relative">
      <GalleryNavButton side="left" isRTL={isRTL} onPrevious={scrollPrevious} onNext={scrollNext} />
      <GalleryNavButton side="right" isRTL={isRTL} onPrevious={scrollPrevious} onNext={scrollNext} />

      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", direction: isRTL ? "rtl" : "ltr" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {items.map((item, index) => (
          <GalleryItem key={`${item.before}-${index}`} item={item} index={index} />
        ))}
      </div>

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

      <div className="text-center text-sm text-gray-500 mt-2 md:hidden">
        Swipe left or right to navigate
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes swipeAnimation {
          0%   { opacity: 0; transform: translateX(-30px); }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(30px); }
        }
        .swipe-indicator {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 60px; height: 60px;
          background-color: rgba(0,0,0,0.4); border-radius: 50%;
          display: flex; justify-content: center; align-items: center;
          color: white; font-size: 24px;
          animation: swipeAnimation 2s ease-in-out infinite; z-index: 20;
        }
        .swipe-indicator:before { content: "⇄"; }
      `}</style>
    </div>
  );
};

export default memo(GalleryCarousel);
