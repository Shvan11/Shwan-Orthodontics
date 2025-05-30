// src/types/gallery.ts

export interface GalleryPhoto {
  before: string;
  after: string;
  description?: string; // Made optional
}

export interface GalleryCase {
  id: number;
  title: string;
  photos: GalleryPhoto[];
}