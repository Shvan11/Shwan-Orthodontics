import { createClient } from '@supabase/supabase-js'

// These will be environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-project-url'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export interface ContentRow {
  id: number
  locale: 'en' | 'ar'
  section: 'services' | 'gallery' | 'about' | 'contact' | 'faq' | 'seo'
  data: Record<string, unknown>
  updated_at: string
}

export interface GalleryImageRow {
  id: number
  case_id: number
  image_type: 'before' | 'after'
  image_number: number
  image_url: string | null
  description: string
  locale: 'en' | 'ar'
  created_at: string
}

// Content management functions
export class ContentManager {
  
  // Get content by locale and section
  static async getContent(locale: 'en' | 'ar', section?: string) {
    let query = supabase
      .from('content')
      .select('*')
      .eq('locale', locale)
      .order('updated_at', { ascending: false })

    if (section) {
      query = query.eq('section', section)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Save content for a specific section
  static async saveContent(locale: 'en' | 'ar', section: string, data: Record<string, unknown>) {
    const { data: result, error } = await supabase
      .from('content')
      .upsert({
        locale,
        section,
        data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'locale,section'
      })
      .select()

    if (error) throw error
    return result
  }

  // Get full content structure (like current JSON files)
  static async getFullContent(locale: 'en' | 'ar') {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('locale', locale)

    if (error) throw error

    // Reconstruct the full content object
    const fullContent: Record<string, unknown> = {}
    data?.forEach(row => {
      if (row.section === 'seo') {
        fullContent.seo = row.data
      } else if (row.section === 'navbar') {
        fullContent.navbar = row.data
      } else {
        if (!fullContent.pages) fullContent.pages = {} as Record<string, unknown>
        ;(fullContent.pages as Record<string, unknown>)[row.section] = row.data
      }
    })

    return fullContent
  }

  // Gallery-specific functions
  static async getGalleryImages(caseId: number) {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('case_id', caseId)
      .order('image_number')

    if (error) throw error
    return data
  }

  static async saveGalleryImage(
    caseId: number,
    imageType: 'before' | 'after',
    imageNumber: number,
    description: string,
    locale: 'en' | 'ar',
    imageUrl?: string
  ) {
    const { data, error } = await supabase
      .from('gallery_images')
      .upsert({
        case_id: caseId,
        image_type: imageType,
        image_number: imageNumber,
        description,
        locale,
        image_url: imageUrl
      }, {
        onConflict: 'case_id,image_type,image_number,locale'
      })
      .select()

    if (error) throw error
    return data
  }
}

// Real-time subscriptions
export const subscribeToContentChanges = (callback: (payload: unknown) => void) => {
  return supabase
    .channel('content-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'content' 
    }, callback)
    .subscribe()
}