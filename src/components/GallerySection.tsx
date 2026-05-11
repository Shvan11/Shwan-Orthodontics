import { memo } from 'react';
import { Dictionary } from '@/types/dictionary';
import BeforeAfterImage from './BeforeAfterImage';
import GalleryLogoStrip from './GalleryLogoStrip';
import MobileGalleryCarousel from './MobileGalleryCarousel';
import { GalleryCase } from '@/types/gallery';

interface GallerySectionProps {
  t: Dictionary;
  isRTL: boolean;
}

function GallerySection({ t, isRTL }: GallerySectionProps) {
  const galleryData: GalleryCase[] = t.pages.gallery.cases.map((caseItem) => ({
    id: caseItem.id,
    title: caseItem.title,
    photos: caseItem.photos.map((photo, photoIndex) => ({
      before: `case${caseItem.id}/before-${photoIndex + 1}.jpg`,
      after:  `case${caseItem.id}/after-${photoIndex + 1}.jpg`,
      description: photo.description,
    })),
  }));

  const desktopSizes = "(max-width: 1200px) 50vw, 33vw";

  return (
    <section id="gallery" className="mt-12 mx-auto px-4 sm:px-6">
      <h2 className="text-3xl font-bold mb-6 text-center">{t.pages.gallery.title}</h2>

      {/* Mobile — swipeable carousel */}
      <div className="md:hidden">
        <MobileGalleryCarousel t={t} isRTL={isRTL} galleryData={galleryData} />
      </div>

      {/* Desktop — grid layout */}
      <div className="hidden md:block">
        {galleryData.map((caseItem) => (
          <div key={caseItem.id} className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">
              {t.pages.gallery.casePrefix} {caseItem.id}: {caseItem.title}
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseItem.photos.map((photo, photoIndex) => (
                <div
                  key={`${caseItem.id}-${photoIndex}`}
                  className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-lg"
                >
                  {photo.description && (
                    <div className="bg-gray-100 p-3 font-medium text-center">
                      {photo.description}
                    </div>
                  )}

                  <BeforeAfterImage
                    src={`/images/gallery/${photo.before}`}
                    alt={`Case ${caseItem.id} ${photo.description} Before`}
                    label={t.pages.gallery.before}
                    sizes={desktopSizes}
                  />

                  <GalleryLogoStrip />

                  <BeforeAfterImage
                    src={`/images/gallery/${photo.after}`}
                    alt={`Case ${caseItem.id} ${photo.description} After`}
                    label={t.pages.gallery.after}
                    sizes={desktopSizes}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(GallerySection);
