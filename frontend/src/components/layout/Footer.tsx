import React from 'react';
import Logo from '../ui/Logo';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  links?: FooterLink[];
  copyright?: string;
}

const defaultLinks: FooterLink[] = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
  { label: 'Contact', href: '#contact' },
];

const Footer: React.FC<FooterProps> = ({
  links = defaultLinks,
  copyright = `© ${new Date().getFullYear()} InterXAI. All rights reserved.`,
}) => (
  <footer
    id="footer"
    className="bg-[#050e0a] border-t border-white/8 px-6 md:px-16 lg:px-24 py-10
      flex flex-col md:flex-row items-center justify-between gap-6"
    aria-label="Footer"
  >
    <Logo />

    <nav className="flex flex-wrap items-center gap-6">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-white/40 hover:text-white/80 text-sm transition-colors duration-200"
        >
          {link.label}
        </a>
      ))}
    </nav>

    <p className="text-white/30 text-xs">{copyright}</p>
  </footer>
);

export default Footer;
