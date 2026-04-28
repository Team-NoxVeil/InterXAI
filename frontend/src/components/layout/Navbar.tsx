import React, { useState } from 'react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';

export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface NavbarProps {
  items?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

const defaultNavItems: NavItem[] = [
  { label: 'Solutions', href: '#solutions', hasDropdown: true },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Users', href: '#for-users' },
  { label: 'Contact', href: '#contact' },
];

const Navbar: React.FC<NavbarProps> = ({
  items = defaultNavItems,
  ctaLabel = 'Get Started',
  ctaHref = '#get-started',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4
        bg-black/30 backdrop-blur-md border-b border-white/10"
    >
      {/* Logo */}
      <Logo />

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex items-center gap-8">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="text-white/80 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
            >
              {item.label}
              {item.hasDropdown && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="opacity-60"
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <div className="hidden md:block">
        <Button variant="outline" href={ctaHref} id="navbar-cta">
          {ctaLabel}
        </Button>
      </div>

      {/* Mobile Hamburger */}
      <button
        id="mobile-menu-btn"
        className="md:hidden text-white p-2"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1.5">
          <span
            className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </div>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col gap-4 md:hidden"
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-white/80 hover:text-white text-sm transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Button variant="outline" href={ctaHref} className="self-start">
            {ctaLabel}
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
