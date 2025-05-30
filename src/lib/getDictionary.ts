import fs from "fs";
import path from "path";
import { Dictionary } from "@/types/dictionary";

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

export const getDictionary = async (locale: string | undefined): Promise<Dictionary> => {
  const safeLocale = locale ?? "en";
  const filePath = path.join(process.cwd(), "src/locales", `${safeLocale}.json`);

  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    const dictionary = JSON.parse(fileContent) as Dictionary;
    
    // Validate that the dictionary has required structure
    if (!dictionary.pages || !dictionary.navbar) {
      console.warn(`Invalid dictionary structure for locale ${safeLocale}, using fallback`);
      return fallbackDictionary;
    }
    
    return dictionary;
  } catch (error) {
    console.error(`Failed to load dictionary for locale ${safeLocale}:`, error);
    
    // Try to load English as fallback if we failed to load another locale
    if (safeLocale !== "en") {
      try {
        const englishPath = path.join(process.cwd(), "src/locales", "en.json");
        const englishContent = await fs.promises.readFile(englishPath, "utf-8");
        const englishDict = JSON.parse(englishContent) as Dictionary;
        console.warn(`Loaded English fallback for failed locale ${safeLocale}`);
        return englishDict;
      } catch (englishError) {
        console.error("Failed to load English fallback:", englishError);
      }
    }
    
    // If all else fails, return the hardcoded fallback
    return fallbackDictionary;
  }
};
