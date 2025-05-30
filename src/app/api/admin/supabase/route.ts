import { NextRequest, NextResponse } from 'next/server';
import { ContentManager } from '../../../../../../lib/supabase';

// GET - Read content from Supabase
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') as 'en' | 'ar';
    const section = searchParams.get('section');
    
    if (!locale || !['en', 'ar'].includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid or missing locale parameter' },
        { status: 400 }
      );
    }

    let data;
    if (section) {
      // Get specific section
      const content = await ContentManager.getContent(locale, section);
      data = content.length > 0 ? content[0].data : null;
    } else {
      // Get full content structure
      data = await ContentManager.getFullContent(locale);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading content from Supabase:', error);
    return NextResponse.json(
      { error: 'Failed to read content from database' },
      { status: 500 }
    );
  }
}

// POST - Write content to Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale, section, data } = body;
    
    if (!locale || !['en', 'ar'].includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid or missing locale parameter' },
        { status: 400 }
      );
    }

    if (!section) {
      return NextResponse.json(
        { error: 'Missing section parameter' },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Missing data parameter' },
        { status: 400 }
      );
    }

    // Save content to Supabase
    const result = await ContentManager.saveContent(locale, section, data);
    
    return NextResponse.json({ 
      success: true,
      message: `Content updated for ${locale} ${section}`,
      data: result
    });
  } catch (error) {
    console.error('Error writing content to Supabase:', error);
    return NextResponse.json(
      { error: 'Failed to write content to database' },
      { status: 500 }
    );
  }
}

// PUT - Save entire content structure (for bulk updates)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale, data } = body;
    
    if (!locale || !['en', 'ar'].includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid or missing locale parameter' },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Missing data parameter' },
        { status: 400 }
      );
    }

    // Save SEO data
    if (data.seo) {
      await ContentManager.saveContent(locale, 'seo', data.seo);
    }

    // Save navbar data
    if (data.navbar) {
      await ContentManager.saveContent(locale, 'navbar', data.navbar);
    }

    // Save pages data
    if (data.pages) {
      for (const [section, sectionData] of Object.entries(data.pages)) {
        await ContentManager.saveContent(locale, section, sectionData);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Full content updated for ${locale}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving full content to Supabase:', error);
    return NextResponse.json(
      { error: 'Failed to save content to database' },
      { status: 500 }
    );
  }
}