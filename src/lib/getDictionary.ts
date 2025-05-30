import fs from "fs";
import path from "path";
import { Dictionary } from "@/types/dictionary";
import { ContentManager } from "../../lib/supabase";

// Fallback dictionary structure for error cases
const fallbackDictionary: Dictionary = {
  seo: {
    title: "Shwan Orthodontics",
    description: "Professional orthodontic care",
    keywords: "orthodontics, braces, dental care",
    siteName: "Shwan Orthodontics"
  },
  navbar: {
    home: "Home",
    about: "About",
    contact: "Contact",
    faq: "FAQ",
    gallery: "Gallery",
    services: "Services"
  },
  pages: {
    home: {
      title: "Welcome to Shwan Orthodontics",
      description: "Professional orthodontic care",
      missionTitle: "Our Mission",
      mission: "Providing excellent orthodontic care",
      contactTitle: "Contact Us",
      contactInfo: "Contact us for more information"
    },
    contact: {
      title: "Contact Us",
      email: "Email: contact@shwanorthodontics.com",
      phone: "Phone: +964-750-810-8833",
      address: "Address: Duhok, Iraq",
      form: {
        name: "Your Name",
        email: "Your Email",
        message: "Your Message",
        submit: "Send"
      },
      socialHeading: "Follow us on social media",
      mapsHeading: "Find us on the map"
    },
    about: {
      title: "About Us",
      mission: "Professional orthodontic care",
      team: "Our Team",
      team_info: "Expert orthodontic professionals"
    },
    faq: {
      title: "FAQ",
      questions: [
        {
          question: "What is orthodontics?",
          answer: "Orthodontics is dental care for teeth alignment."
        }
      ]
    },
    gallery: {
      title: "Gallery",
      casePrefix: "Case",
      cases: [
        {
          id: 1,
          title: "Treatment Case",
          photos: [
            {
              description: "Treatment example"
            }
          ]
        }
      ]
    },
    services: {
      title: "Services",
      services_list: ["Braces", "Aligners", "Consultation"]
    }
  }
};

// Load from local JSON files (fallback method)
const loadFromLocalFiles = async (locale: string): Promise<Dictionary> => {
  const filePath = path.join(process.cwd(), "src/locales", `${locale}.json`);
  
  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    const dictionary = JSON.parse(fileContent) as Dictionary;
    
    if (!dictionary.pages || !dictionary.navbar) {
      console.warn(`Invalid dictionary structure for locale ${locale}, using fallback`);
      return fallbackDictionary;
    }
    
    return dictionary;
  } catch (error) {
    console.error(`Failed to load local dictionary for locale ${locale}:`, error);
    throw error;
  }
};

export const getDictionary = async (locale: string | undefined): Promise<Dictionary> => {
  const safeLocale = (locale ?? "en") as 'en' | 'ar';

  try {
    // First, try to load from Supabase
    console.log(`🔄 Loading content from Supabase for locale: ${safeLocale}`);
    const supabaseContent = await ContentManager.getFullContent(safeLocale);
    
    if (supabaseContent && typeof supabaseContent === 'object') {
      console.log(`✅ Successfully loaded from Supabase for locale: ${safeLocale}`);
      return supabaseContent as unknown as Dictionary;
    } else {
      throw new Error('Empty or invalid Supabase content');
    }
  } catch (supabaseError) {
    console.warn(`⚠️ Supabase failed for locale ${safeLocale}, falling back to local files:`, supabaseError);
    
    try {
      // Fallback to local JSON files
      const localContent = await loadFromLocalFiles(safeLocale);
      console.log(`📁 Successfully loaded from local files for locale: ${safeLocale}`);
      return localContent;
    } catch (localError) {
      console.error(`❌ Local files failed for locale ${safeLocale}:`, localError);
      
      // Try to load English as final fallback if we failed to load another locale
      if (safeLocale !== "en") {
        try {
          console.log(`🔄 Attempting English fallback...`);
          return await getDictionary("en");
        } catch (englishError) {
          console.error("❌ English fallback failed:", englishError);
        }
      }
      
      // If all else fails, return the hardcoded fallback
      console.log(`🆘 Using hardcoded fallback dictionary`);
      return fallbackDictionary;
    }
  }
};
