-- Supabase Database Schema for Shwan Orthodontics CMS
-- Run this in your Supabase SQL Editor

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Content table for storing all website content
CREATE TABLE IF NOT EXISTS content (
  id BIGSERIAL PRIMARY KEY,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ar')),
  section VARCHAR(50) NOT NULL CHECK (section IN ('services', 'gallery', 'about', 'contact', 'faq', 'seo', 'navbar', 'home')),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint for locale + section combination
ALTER TABLE content ADD CONSTRAINT unique_locale_section UNIQUE (locale, section);

-- Gallery images table for managing before/after photos
CREATE TABLE IF NOT EXISTS gallery_images (
  id BIGSERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL,
  image_type VARCHAR(10) NOT NULL CHECK (image_type IN ('before', 'after')),
  image_number INTEGER NOT NULL CHECK (image_number >= 1 AND image_number <= 10),
  image_url TEXT,
  description TEXT,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ar')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint for case_id + image_type + image_number + locale
ALTER TABLE gallery_images ADD CONSTRAINT unique_gallery_image 
  UNIQUE (case_id, image_type, image_number, locale);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_locale ON content(locale);
CREATE INDEX IF NOT EXISTS idx_content_section ON content(section);
CREATE INDEX IF NOT EXISTS idx_content_updated_at ON content(updated_at);
CREATE INDEX IF NOT EXISTS idx_gallery_case_id ON gallery_images(case_id);
CREATE INDEX IF NOT EXISTS idx_gallery_locale ON gallery_images(locale);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on content" ON content
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on gallery_images" ON gallery_images
  FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for gallery images
CREATE POLICY "Anyone can view gallery images" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY "Anyone can upload gallery images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Anyone can update gallery images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'gallery-images');

CREATE POLICY "Anyone can delete gallery images" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery-images');

-- Insert initial navbar content (same for both languages)
INSERT INTO content (locale, section, data) VALUES 
('en', 'navbar', '{
  "home": "Home",
  "about": "About", 
  "services": "Services",
  "gallery": "Gallery",
  "faq": "FAQ",
  "contact": "Contact"
}'),
('ar', 'navbar', '{
  "home": "الرئيسية",
  "about": "حولنا",
  "services": "خدماتنا", 
  "gallery": "المعرض",
  "faq": "الأسئلة الشائعة",
  "contact": "اتصل بنا"
}')
ON CONFLICT (locale, section) DO NOTHING;