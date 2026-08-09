import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Menu, X, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { SiteSettings } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  settings: SiteSettings;
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenQuote: (serviceName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, currentPage, onNavigate, onOpenQuote }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services & Products' },
    { id: 'gallery', label: 'Project Gallery' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello ABN Thermocare System, I would like to get a quote for industrial services.'
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-rose-100">
      {/* Top Utility Bar */}
      <div className="bg-rose-50/90 text-slate-700 text-xs py-2 px-4 border-b border-rose-100">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-700 hover:text-rose-700 transition font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>{settings.location}</span>
            </span>
            <span className="hidden md:inline text-rose-200">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Est. 2011 • 15+ Yrs Excellence • GSTIN Registered</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 text-slate-800 hover:text-rose-700 transition font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              <span>{settings.phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-medium transition text-xs shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </a>
            <button
              onClick={() => handleNav('admin')}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition ml-2 text-xs font-semibold"
              title="Admin Portal Login"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNav('home')}
          className="cursor-pointer group"
        >
          <Logo size="md" variant="light" />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-sm font-semibold transition-colors py-1 relative ${
                  isActive ? 'text-rose-600 font-bold' : 'text-slate-700 hover:text-rose-600'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-rose-600 to-red-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenQuote()}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-semibold text-sm px-4.5 py-2.5 rounded-xl shadow border border-rose-500/20 transition hover:shadow-md"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-rose-50 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg font-semibold text-base transition ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-rose-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold text-center py-2.5 rounded-xl transition"
            >
              Request Quick Quote
            </button>

            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-slate-100 font-semibold py-2.5 rounded-xl text-sm"
            >
              <Phone className="w-4 h-4 text-rose-400" />
              <span>Call +91 8043801550</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

