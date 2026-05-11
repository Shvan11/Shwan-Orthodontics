"use client";

import { useState, useMemo, useCallback } from 'react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import BeforeAfterImage from './BeforeAfterImage';
import GalleryNavButton from './GalleryNavButton';
import GalleryLogoStrip from './GalleryLogoStrip';
import { GalleryCase } from '@/types/gallery';
import { Dictionary } from '@/types/dictionary';

interface MobileGalleryProps {
  t: Dictionary;
  isRTL: boolean;
  galleryData: GalleryCase[];
}

export default function MobileGalleryCarousel({ t, isRTL, galleryData }: MobileGalleryProps) {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const activeCase = galleryData[activeCaseIndex];
  const totalPhotosInCurrentCase = activeCase.photos.length;

  const allPhotos = useMemo(() => {
    const flat: {
      caseIndex: number;
      photoIndex: number;
      caseId: number;
      photo: { before: string; after: string; description?: string };
    }[] = [];
    galleryData.forEach((caseItem, caseIdx) => {
      caseItem.photos.forEach((photo, photoIdx) => {
        flat.push({ caseIndex: caseIdx, photoIndex: photoIdx, caseId: caseItem.id, photo });
      });
    });
    return flat;
  }, [galleryData]);

  const totalPhotos = allPhotos.length;

  const currentFlatIndex = useMemo(() => {
    let index = 0;
    for (let i = 0; i < activeCaseIndex; i++) index += galleryData[i].photos.length;
    return index + activePhotoIndex;
  }, [activeCaseIndex, activePhotoIndex, galleryData]);

  const navigateToFlatIndex = useCallback((flatIndex: number) => {
    const safeIndex = (flatIndex + totalPhotos) % totalPhotos;
    const target = allPhotos[safeIndex];
    setActiveCaseIndex(target.caseIndex);
    setActivePhotoIndex(target.photoIndex);
  }, [allPhotos, totalPhotos]);

  const goToNext     = useCallback(() => navigateToFlatIndex(currentFlatIndex + 1), [currentFlatIndex, navigateToFlatIndex]);
  const goToPrevious = useCallback(() => navigateToFlatIndex(currentFlatIndex - 1), [currentFlatIndex, navigateToFlatIndex]);

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture({
    isRTL,
    onNext: goToNext,
    onPrevious: goToPrevious,
  });

  const activePhoto = activeCase.photos[activePhotoIndex];
  if (!activeCase || !activePhoto) return null;

  const imagesSizes = "(max-width: 768px) calc(100vw - 2rem), 768px";

  return (
    <div className="relative">
      <div className="text-center text-sm text-gray-500 mb-2">
        {t.pages.gallery.swipeHint}
      </div>

      <div
        className="relative border border-gray-200 rounded-lg overflow-hidden shadow-lg"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Case title and photo counter */}
        <div className="bg-gray-100 p-3">
          <h3 className="font-medium text-center text-lg">
            {t.pages.gallery.casePrefix} {activeCase.id}: {activeCase.title}
          </h3>
          <p className="text-center text-sm mt-1">
            {activePhoto.description ? `${activePhoto.description} ` : ''}
            ({activePhotoIndex + 1}/{totalPhotosInCurrentCase})
          </p>
        </div>

        <BeforeAfterImage
          src={`/images/gallery/${activePhoto.before}`}
          alt={`Case ${activeCase.id} ${activePhoto.description} Before`}
          label={t.pages.gallery.before}
          sizes={imagesSizes}
          priority
        />

        <GalleryLogoStrip />

        <BeforeAfterImage
          src={`/images/gallery/${activePhoto.after}`}
          alt={`Case ${activeCase.id} ${activePhoto.description} After`}
          label={t.pages.gallery.after}
          sizes={imagesSizes}
          priority
        />

        <GalleryNavButton side="left"  isRTL={isRTL} onPrevious={goToPrevious} onNext={goToNext} />
        <GalleryNavButton side="right" isRTL={isRTL} onPrevious={goToPrevious} onNext={goToNext} />
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {allPhotos.map((item, index) => (
          <button
            key={`${item.caseId}-${item.photoIndex}`}
            className={`w-3 h-3 rounded-full ${index === currentFlatIndex ? "bg-blue-500" : "bg-gray-300"}`}
            onClick={() => navigateToFlatIndex(index)}
            aria-label={`Go to Case ${item.caseId}: ${item.photo.description}`}
          />
        ))}
      </div>
    </div>
  );
}
