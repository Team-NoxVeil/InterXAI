import React from 'react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-slate-400 px-6 md:px-16 py-12">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
        <div>
          <Logo dark className="mb-3" />
          <p className="text-sm text-slate-400 max-w-xs">
            Autonomous AI interviews, smarter careers. Built for the next generation of talent.
          </p>
        </div>
        <div className="flex flex-wrap gap-12">
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Contact'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-slate-200 text-sm font-semibold mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`}
                      className="text-sm hover:text-slate-200 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs">© {new Date().getFullYear()} InterXAI. All rights reserved.</p>
        <div className="flex gap-4">
          {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
            <a key={s} href="#" className="text-xs hover:text-slate-200 transition-colors">{s}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
