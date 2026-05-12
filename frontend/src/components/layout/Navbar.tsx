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
  onCtaClick?: () => void;
  orgCtaLabel?: string;
  onOrgCtaClick?: () => void;
}

const defaultNavItems: NavItem[] = [
  { label: 'Solutions', href: '#solutions', hasDropdown: true },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Users', href: '#for-users' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources', hasDropdown: true },
];

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-50">
    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({
  items = defaultNavItems,
  ctaLabel = 'Sign In',
  ctaHref,
  onCtaClick,
  orgCtaLabel,
  onOrgCtaClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3.5
        bg-white/80 backdrop-blur-lg border-b border-slate-200/70 shadow-sm shadow-slate-100"
    >
      {/* Logo */}
      <Logo />

      {/* Desktop Nav Links */}
      <ul className="hidden lg:flex items-center gap-1">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900
                hover:bg-slate-100 text-sm font-medium transition-all duration-150"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown />}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop CTAs */}
      <div className="hidden lg:flex items-center gap-2">
        {orgCtaLabel && onOrgCtaClick && (
          <Button variant="ghost" onClick={onOrgCtaClick} id="navbar-org-cta">
            {orgCtaLabel}
          </Button>
        )}
        <Button
          variant="ghost"
          href={onCtaClick ? undefined : ctaHref}
          onClick={onCtaClick}
          id="navbar-signin"
        >
          {ctaLabel}
        </Button>
        <Button
          variant="primary"
          onClick={onCtaClick}
          id="navbar-cta"
          className="flex items-center gap-1.5"
        >
          Get Started
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>

      {/* Mobile Hamburger */}
      <button
        id="mobile-menu-btn"
        className="lg:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1.5">
          <span className={`block h-0.5 w-5 bg-slate-700 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-5 bg-slate-700 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-slate-700 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 right-0 bg-white border-b border-slate-200
            px-6 py-4 flex flex-col gap-3 lg:hidden shadow-lg"
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium py-1 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" onClick={onCtaClick} className="flex-1 justify-center">
              Sign In
            </Button>
            <Button variant="primary" onClick={onCtaClick} className="flex-1 justify-center">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
