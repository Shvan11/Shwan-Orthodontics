import { Dictionary } from "@/types/dictionary";
import { ContentManager } from "../../lib/supabase";

export const getDictionary = async (locale: string | undefined): Promise<Dictionary> => {
  const safeLocale = (locale ?? "en") as 'en' | 'ar';

  const supabaseContent = await ContentManager.getFullContent(safeLocale);

  if (!supabaseContent || typeof supabaseContent !== 'object') {
    throw new Error(`Failed to load content from Supabase for locale: ${safeLocale}`);
  }

  return supabaseContent as unknown as Dictionary;
};
