// src/components/Navbar.tsx
"use client";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "@/context/LocaleContext";
import { useEffect, useState, useCallback, memo, useRef } from "react";
import Image from 'next/image';
import logo from '@public/images/_logo.png';

// Define a type for navbar translations
interface NavbarTranslations {
  home?: string;
  about?: string;
  services?: string;
  gallery?: string;
  faq?: string;
  contact?: string;
  [key: string]: string | undefined;
}

interface Translations {
  navbar?: NavbarTranslations;
  [key: string]: unknown;
}


// Cache for loaded translations
const loadedTranslations: Record<string, Translations> = {};

// Memoized NavLink component to prevent unnecessary re-renders
const NavLink = memo(
  ({
    href,
    className,
    children,
    onClick,
  }: {
    href: string;
    className: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
);
NavLink.displayName = "NavLink";

function Navbar() {
  const { locale } = useLocale();
  const [t, setT] = useState<Translations>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Use useCallback for event handlers
  const loadTranslations = useCallback(async () => {
    // Check cache first
    if (loadedTranslations[locale]) {
      setT(loadedTranslations[locale]);
      return;
    }

    // Lazy load the JSON file for the required language
    try {
      const translations = await import(`@/locales/${locale}.json`);
      loadedTranslations[locale] = translations.default; // Cache the loaded translations
      setT(translations.default);
    } catch (error) {
      console.error("❌ Error loading translations:", error);
    }
  }, [locale]);

  const toggleMobileMenu = useCallback((state?: boolean) => {
    setMobileMenuOpen(prev => state !== undefined ? state : !prev);
  }, []);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        toggleMobileMenu(false);
      }
    }

    // Only attach the event listener if the mobile menu is open
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, toggleMobileMenu]);

  // Load translations on locale change
  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

  // Compute navigation items
  const navItems = [
    { key: "home", label: t.navbar?.home || "Home" },
    { key: "about", label: t.navbar?.about || "About" },
    { key: "services", label: t.navbar?.services || "Services" },
    { key: "gallery", label: t.navbar?.gallery || "Gallery" },
    { key: "faq", label: t.navbar?.faq || "FAQ" },
    { key: "contact", label: t.navbar?.contact || "Contact" },
  ];

  // Reusable Logo component
  const Logo = () => (
    <Link href="/" className="flex items-center">
      <Image 
        src={logo}
        alt="Shwan Orthodontics Logo" 
        width={logo.width}
        height={logo.height}
        className="h-auto w-[120px] md:w-[150px]"
        priority
      />
    </Link>
  );

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Mobile layout */}
        <div className="flex justify-between items-center md:hidden">
          <Logo />
          <div className="flex items-center">
            <div className="mr-4">
              <LanguageSwitcher />
            </div>
            <button
              ref={buttonRef}
              onClick={() => toggleMobileMenu()}
              className="p-1 focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen 
                    ? "M6 18L18 6M6 6l12 12" 
                    : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex justify-between items-center">
          <Logo />
          <div className="flex-1 flex justify-center">
            <div className="flex items-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  href={`#${item.key}`}
                  className="px-4 py-2 hover:text-blue-300 transition-colors"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div ref={menuRef} className="mt-4 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                href={`#${item.key}`}
                className="block py-2 px-4 hover:bg-gray-700 transition-colors"
                onClick={() => toggleMobileMenu(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(Navbar);