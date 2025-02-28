"use client";
// src/components/MobileGalleryCarousel.tsx

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import logo from '@public/images/_logo.png';
import LogoWatermark from './LogoWatermark';
import { GalleryCase } from '@/types/gallery';

interface MobileGalleryProps {
  isRTL: boolean;
  galleryData: GalleryCase[];
}

export default function MobileGalleryCarousel({ isRTL, galleryData }: MobileGalleryProps) {
  // State for tracking which case and which photo within that case
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Get active case and photo
  const activeCase = galleryData[activeCaseIndex];
  const totalPhotosInCurrentCase = activeCase.photos.length;
  
  // Flatten all photos for pagination (all photos from all cases)
  const allPhotos = useMemo(() => {
    const flat: {
      caseIndex: number;
      photoIndex: number;
      caseId: number;
      caseTitle: string;
      photo: {
        before: string;
        after: string;
        description?: string;
      };
    }[] = [];
    
    galleryData.forEach((caseItem, caseIdx) => {
      caseItem.photos.forEach((photo, photoIdx) => {
        flat.push({
          caseIndex: caseIdx,
          photoIndex: photoIdx,
          caseId: caseItem.id,
          caseTitle: caseItem.title,
          photo
        });
      });
    });
    
    return flat;
  }, [galleryData]);
  
  // Calculate total number of photos
  const totalPhotos = allPhotos.length;
  
  // Get current flat index based on case and photo indices
  const currentFlatIndex = useMemo(() => {
    let index = 0;
    for (let i = 0; i < activeCaseIndex; i++) {
      index += galleryData[i].photos.length;
    }
    return index + activePhotoIndex;
  }, [activeCaseIndex, activePhotoIndex, galleryData]);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  // Navigation functions
  const navigateToFlatIndex = useCallback((flatIndex: number) => {
    // Ensure index is within bounds (circular)
    const safeIndex = (flatIndex + totalPhotos) % totalPhotos;
    const targetItem = allPhotos[safeIndex];
    
    setActiveCaseIndex(targetItem.caseIndex);
    setActivePhotoIndex(targetItem.photoIndex);
  }, [allPhotos, totalPhotos]);
  
  // Handle touch events
  const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
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
        // Move to previous in RTL mode
        navigateToFlatIndex(currentFlatIndex - 1);
      }
      if (isRightSwipe) {
        // Move to next in RTL mode
        navigateToFlatIndex(currentFlatIndex + 1);
      }
    } else {
      if (isLeftSwipe) {
        // Move to next in LTR mode
        navigateToFlatIndex(currentFlatIndex + 1);
      }
      if (isRightSwipe) {
        // Move to previous in LTR mode
        navigateToFlatIndex(currentFlatIndex - 1);
      }
    }

    // Reset touch values
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, isRTL, currentFlatIndex, navigateToFlatIndex]);

  // Navigation button handlers
  const goToPrevious = useCallback(() => {
    navigateToFlatIndex(currentFlatIndex - 1);
  }, [currentFlatIndex, navigateToFlatIndex]);

  const goToNext = useCallback(() => {
    navigateToFlatIndex(currentFlatIndex + 1);
  }, [currentFlatIndex, navigateToFlatIndex]);

  // Get active photo
  const activePhoto = activeCase.photos[activePhotoIndex];
  
  if (!activeCase || !activePhoto) return null;

  return (
    <div className="relative">
      {/* Mobile Swipe Instructions */}
      <div className="text-center text-sm text-gray-500 mb-2">
        Swipe left or right to navigate
      </div>
      
      {/* Carousel container with touch handlers */}
      <div
        className="relative border rounded-lg overflow-hidden shadow-lg"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Case title and description */}
        <div className="bg-gray-100 p-3">
          <h3 className="font-medium text-center text-lg">
            Case {activeCase.id}: {activeCase.title}
          </h3>
          {activePhoto.description ? (
            <p className="text-center text-sm mt-1">
              {activePhoto.description} ({activePhotoIndex + 1}/{totalPhotosInCurrentCase})
            </p>
          ) : (
            <p className="text-center text-sm mt-1">
              ({activePhotoIndex + 1}/{totalPhotosInCurrentCase})
            </p>
          )}
        </div>
        
        {/* Before image with watermark */}
        <div className="relative">
          <div className="relative h-64 w-full">
            <Image
              src={`/images/gallery/${activePhoto.before}`}
              alt={`Case ${activeCase.id} ${activePhoto.description} Before`}
              className="object-contain bg-white"
              fill
              sizes="100vw"
              priority
            />
            <LogoWatermark opacity={0.35} position="center" size="medium" />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 z-20">
              Before
            </div>
          </div>
        </div>
        
        {/* Logo in the middle */}
        <div className="flex justify-center items-center py-3 bg-white">
          <Image 
            src={logo} 
            alt="Shwan Orthodontics Logo" 
            width={80} 
            height={30} 
            className="h-auto"
          />
        </div>
        
        {/* After image with watermark */}
        <div className="relative">
          <div className="relative h-64 w-full">
            <Image
              src={`/images/gallery/${activePhoto.after}`}
              alt={`Case ${activeCase.id} ${activePhoto.description} After`}
              className="object-contain bg-white"
              fill
              sizes="100vw"
              priority
            />
            <LogoWatermark opacity={0.35} position="center" size="medium" />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 z-20">
              After
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full z-10 hover:bg-opacity-90"
          onClick={isRTL ? goToNext : goToPrevious}
          aria-label={isRTL ? "Next" : "Previous"}
        >
          {isRTL ? "❯" : "❮"}
        </button>

        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full z-10 hover:bg-opacity-90"
          onClick={isRTL ? goToPrevious : goToNext}
          aria-label={isRTL ? "Previous" : "Next"}
        >
          {isRTL ? "❮" : "❯"}
        </button>
      </div>
      
      {/* Pagination indicators */}
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {allPhotos.map((item, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentFlatIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => navigateToFlatIndex(index)}
            aria-label={`Go to Case ${item.caseId}: ${item.photo.description}`}
          />
        ))}
      </div>
    </div>
  );
}