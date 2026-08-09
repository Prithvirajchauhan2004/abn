import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import { SiteSettings } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (page: string) => void;
  onOpenQuote: (serviceName?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenQuote }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello ABN Thermocare System, I would like to get a quote for industrial thermal solutions.'
  )}`;

  const serviceCategories = [
    'Installation Services',
    'Insulation Services',
    'Electric Heaters',
    'Fire Alarm System Service',
    'Industrial Chimneys',
    'Turnkey Electrical Project Service',
    'Heating Coils',
    'Storage Tanks',
  ];

  return (
    <footer className="bg-slate-50 text-slate-700 pt-16 pb-8 border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <div
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer inline-block"
            >
              <Logo size="md" variant="light" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Established in 2011 in Greater Noida, UP, India. Premier manufacturer and industrial service provider for thermal insulation, utility pipelines, heaters, chimneys, and electrical turnkey systems.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Proprietorship • Owner: {settings.owner} • GSTIN: {settings.gstin}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-slate-900 font-semibold text-base border-b border-rose-100 pb-2 font-serif">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home Page', page: 'home' },
                { label: 'About Our Company', page: 'about' },
                { label: 'Services & Products Catalog', page: 'services' },
                { label: 'Project Gallery', page: 'gallery' },
                { label: 'Contact & Request Quote', page: 'contact' },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => {
                      onNavigate(item.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 hover:text-rose-600 transition text-slate-600 text-left text-xs"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-rose-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Service Categories */}
          <div className="space-y-4">
            <h3 className="text-slate-900 font-semibold text-base border-b border-rose-100 pb-2 font-serif">
              Product Categories
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {serviceCategories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onNavigate('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-rose-600 transition flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-full" />
                    <span>{cat}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info & CTA */}
          <div className="space-y-4">
            <h3 className="text-slate-900 font-semibold text-base border-b border-rose-100 pb-2 font-serif">
              Contact Works
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600 leading-normal">{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rose-600 shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-rose-600 transition text-xs font-semibold">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-600 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-rose-600 transition text-xs">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-xl transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => onOpenQuote()}
                className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-xs py-2.5 rounded-xl transition shadow-sm"
              >
                Request Quotation
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ABN Thermocare System. All rights reserved. Industrial Solutions Since 2011.</p>
          <div className="flex items-center gap-4">
            <span>Greater Noida, Uttar Pradesh, India</span>
            <span>•</span>
            <button
              onClick={() => {
                onNavigate('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-rose-600 transition font-semibold"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

