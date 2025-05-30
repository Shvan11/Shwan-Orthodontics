const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// You'll need to replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://pltnvorttbolkqdercbu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdG52b3J0dGJvbGtxZGVyY2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MzQxNDUsImV4cCI6MjA2NDIxMDE0NX0.BJ-oMbpPopUPCqm4eUCMdupz4SEaHTYA6P6XzVHnqj0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function migrateData() {
  try {
    console.log('🚀 Starting data migration to Supabase...');

    // Read existing JSON files
    const enPath = path.join(__dirname, '../src/locales/en.json');
    const arPath = path.join(__dirname, '../src/locales/ar.json');

    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

    console.log('📄 Loaded existing JSON data');

    // Helper function to insert content
    async function insertContent(locale, section, data) {
      const { error } = await supabase
        .from('content')
        .upsert({
          locale,
          section,
          data,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'locale,section'
        });

      if (error) {
        console.error(`❌ Error inserting ${locale} ${section}:`, error);
      } else {
        console.log(`✅ Migrated ${locale} ${section}`);
      }
    }

    // Migrate English content
    console.log('🔄 Migrating English content...');
    await insertContent('en', 'seo', enData.seo);
    await insertContent('en', 'navbar', enData.navbar);
    
    if (enData.pages) {
      for (const [section, data] of Object.entries(enData.pages)) {
        await insertContent('en', section, data);
      }
    }

    // Migrate Arabic content
    console.log('🔄 Migrating Arabic content...');
    await insertContent('ar', 'seo', arData.seo);
    await insertContent('ar', 'navbar', arData.navbar);
    
    if (arData.pages) {
      for (const [section, data] of Object.entries(arData.pages)) {
        await insertContent('ar', section, data);
      }
    }

    // Migrate gallery images metadata
    console.log('🔄 Migrating gallery images metadata...');
    if (enData.pages?.gallery?.cases) {
      for (const caseItem of enData.pages.gallery.cases) {
        const arCase = arData.pages?.gallery?.cases?.find(c => c.id === caseItem.id);
        
        if (caseItem.photos) {
          for (let i = 0; i < caseItem.photos.length; i++) {
            const photo = caseItem.photos[i];
            const arPhoto = arCase?.photos?.[i];

            // Determine image type and number from description
            let imageType = 'before';
            let imageNumber = i + 1;
            
            if (photo.description.toLowerCase().includes('after') || 
                photo.description.toLowerCase().includes('بعد')) {
              imageType = 'after';
            }

            // Insert English description
            const { error: enError } = await supabase
              .from('gallery_images')
              .upsert({
                case_id: caseItem.id,
                image_type: imageType,
                image_number: imageNumber,
                description: photo.description,
                locale: 'en',
                image_url: `/images/gallery/case${caseItem.id}/${imageType}-${imageNumber}.jpg`
              }, {
                onConflict: 'case_id,image_type,image_number,locale'
              });

            if (enError) {
              console.error(`❌ Error inserting gallery image EN:`, enError);
            }

            // Insert Arabic description
            if (arPhoto) {
              const { error: arError } = await supabase
                .from('gallery_images')
                .upsert({
                  case_id: caseItem.id,
                  image_type: imageType,
                  image_number: imageNumber,
                  description: arPhoto.description,
                  locale: 'ar',
                  image_url: `/images/gallery/case${caseItem.id}/${imageType}-${imageNumber}.jpg`
                }, {
                  onConflict: 'case_id,image_type,image_number,locale'
                });

              if (arError) {
                console.error(`❌ Error inserting gallery image AR:`, arError);
              }
            }

            console.log(`✅ Migrated gallery image case ${caseItem.id} ${imageType}-${imageNumber}`);
          }
        }
      }
    }

    console.log('🎉 Data migration completed successfully!');
    console.log('📋 Next steps:');
    console.log('1. Update your .env.local file with Supabase credentials');
    console.log('2. Test the admin panel with Supabase integration');
    console.log('3. Verify all content appears correctly');

  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
}

// Helper function to display instructions
function displayInstructions() {
  console.log('📋 MIGRATION INSTRUCTIONS:');
  console.log('');
  console.log('1. Create a Supabase project at https://supabase.com');
  console.log('2. Run the SQL schema in your Supabase SQL Editor');
  console.log('3. Update SUPABASE_URL and SUPABASE_ANON_KEY in this file');
  console.log('4. Run: node scripts/migrate-to-supabase.js');
  console.log('');
  console.log('Your Supabase credentials:');
  console.log('- URL: Found in Project Settings > API');
  console.log('- Anon Key: Found in Project Settings > API');
  console.log('');
}

// Check if credentials are set
if (SUPABASE_URL === 'your-project-url' || SUPABASE_ANON_KEY === 'your-anon-key') {
  displayInstructions();
} else {
  migrateData();
}

module.exports = { migrateData };