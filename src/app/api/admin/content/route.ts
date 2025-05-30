import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET - Read content files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');
    
    if (!locale || !['en', 'ar'].includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid or missing locale parameter' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'src', 'locales', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `Content file not found for locale: ${locale}` },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json(
      { error: 'Failed to read content' },
      { status: 500 }
    );
  }
}

// POST - Write content files
export async function POST(request: NextRequest) {
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

    const filePath = path.join(process.cwd(), 'src', 'locales', `${locale}.json`);
    
    // Create backup before writing
    const backupPath = path.join(
      process.cwd(), 
      'src', 
      'locales', 
      `${locale}.backup.${Date.now()}.json`
    );
    
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    // Write the new content
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    
    return NextResponse.json({ 
      success: true,
      message: `Content updated for locale: ${locale}`,
      backup: backupPath
    });
  } catch (error) {
    console.error('Error writing content:', error);
    return NextResponse.json(
      { error: 'Failed to write content' },
      { status: 500 }
    );
  }
}