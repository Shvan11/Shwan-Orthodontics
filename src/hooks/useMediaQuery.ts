"use client";

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * Returns true if the media query matches, false otherwise
 * 
 * @param query CSS media query string
 * @returns boolean indicating if the media query matches
 * 
 * Example usage:
 * const isMobile = useMediaQuery('(max-width: 640px)');
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on the server or during initial client render
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window !== 'undefined') {
      // Create media query list
      const mediaQuery = window.matchMedia(query);
      
      // Set initial value
      setMatches(mediaQuery.matches);

      // Define callback for handling changes
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add event listener for changes
      mediaQuery.addEventListener('change', handleChange);

      // Clean up
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [query]);

  return matches;
}

export default useMediaQuery;