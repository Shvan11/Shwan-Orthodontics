# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack for faster builds
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Architecture

This is a **bilingual orthodontics website** built with Next.js 15 + TypeScript that supports English and Arabic with full RTL/LTR functionality.

### Internationalization Architecture

The project uses a sophisticated i18n setup:

- **Route-based localization**: URLs follow `/[locale]/` pattern (`/en/`, `/ar/`)
- **Middleware redirection**: Root `/` redirects to `/en` by default (`src/middleware.ts`)
- **Context management**: `LocaleContext` manages current locale across components
- **Translation loading**: 
  - Server-side via `getDictionary()` in page components
  - Client-side via dynamic imports in individual components
- **RTL support**: Automatic text direction switching with `HTMLDirectionManager`

**Key i18n files:**
- `src/locales/en.json` & `src/locales/ar.json` - Translation dictionaries
- `src/context/LocaleContext.tsx` - Locale state management
- `src/lib/getDictionary.ts` - Server-side translation loader
- `src/components/HTMLDirectionManager.tsx` - Document direction updates

### Component Patterns

- **Single Page Application**: All sections on one page with hash navigation (`#home`, `#about`, etc.)
- **Memoization**: Extensive use of `React.memo()` for performance optimization
- **Consistent prop interfaces**: Components expect `{ t: Dictionary, isRTL: boolean }`
- **Responsive strategy**: Mobile-first with conditional rendering for different layouts

### Gallery System

Organized gallery with structured case data:
- Images in `/public/images/gallery/case[1-3]/` with `before-*.jpg` and `after-*.jpg` patterns
- Gallery data generated from translation files
- Separate components for mobile (`MobileGalleryCarousel`) and desktop (`GalleryCarousel`)

### Performance Optimizations

- **Component memoization** to prevent unnecessary re-renders
- **Translation caching** in navigation components
- **Next.js Image optimization** with proper sizing
- **Custom `useMediaQuery` hook** for responsive behavior

## Code Conventions

- **TypeScript interfaces** for all component props and data structures
- **"use client"** directives only where client-side functionality is needed
- **Tailwind CSS** with custom color scheme (primary blue: `#3b82f6`, secondary green: `#10b981`)
- **Path aliases**: Use `@/` for src directory imports

## Adding New Translations

1. Add key-value pairs to both `src/locales/en.json` and `src/locales/ar.json`
2. Update `src/types/dictionary.ts` interface if adding new sections
3. Import translations in components using either:
   - Server-side: `getDictionary(locale)` in page components
   - Client-side: Dynamic imports with caching in individual components

## Responsive Development

- Components have mobile and desktop variants where needed
- Use `useMediaQuery` hook for responsive logic
- Mobile-first Tailwind classes with breakpoint prefixes
- Test RTL layout when working on Arabic translations