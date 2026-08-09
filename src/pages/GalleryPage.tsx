import React, { useState } from 'react';
import { Filter, X, ZoomIn, ArrowRight, Phone, PhoneCall, MessageCircle } from 'lucide-react';
import { GalleryItem, SiteSettings } from '../types';

interface GalleryPageProps {
  gallery: GalleryItem[];
  settings?: SiteSettings;
  onOpenQuote: (serviceName?: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery, settings, onOpenQuote }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const phoneNum = settings?.phone || '+91 8043801550';
  const whatsappNum = settings?.whatsapp || '+918043801550';

  const categories = [
    'All',
    'Insulation Services',
    'Storage Tanks',
    'Industrial Chimneys',
    'Turnkey Electrical Project Service',
    'Electric Heaters',
    'Fire Alarm System Service',
  ];

  const filteredGallery = activeCategory === 'All' ? gallery : gallery.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-rose-50/70 via-white to-slate-50 text-slate-900 py-16 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Industrial Works Showcase
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-2">
            Installation & Project Gallery
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            Real field execution photos of utility pipeline lagging, chemical storage tanks, self-supported industrial chimneys, HT/LT electrical panels, and electric heaters. Click any tile to read full project description and request a callback.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:border-rose-300"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow">
                      <ZoomIn className="w-4 h-4 text-rose-600" />
                      <span>Read Full Project</span>
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-sm text-rose-400 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-rose-500/20">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold font-serif text-slate-900 group-hover:text-rose-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">Greater Noida / NCR</span>
                <span className="text-xs font-semibold text-rose-700 group-hover:text-rose-800 transition">
                  View Project &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX / FULL DESCRIPTION MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 my-8 text-white">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full transition shadow"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video max-h-80 relative bg-slate-950">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto bg-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded">
                  {activeItem.category}
                </span>
                <span className="text-xs text-slate-400">Site: Greater Noida / NCR Region</span>
              </div>

              <h2 className="text-xl font-bold font-serif text-white">{activeItem.title}</h2>

              {/* Full Description with whitespace-pre-wrap to preserve admin formatting */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Project Description
                </h4>
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {activeItem.description}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Get a Callback */}
                <button
                  onClick={() => {
                    const title = activeItem.title;
                    setActiveItem(null);
                    onOpenQuote(`Callback Request for Project: ${title}`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Get a Callback</span>
                </button>

                {/* Call Now */}
                <a
                  href={`tel:${phoneNum.replace(/[^0-9+]/g, '')}`}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-slate-700"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  <span>Call Now ({phoneNum})</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ABN Thermocare, I am interested in project: "${activeItem.title}". Please call me back.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-emerald-800/50"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => {
                  const title = activeItem.title;
                  setActiveItem(null);
                  onOpenQuote(title);
                }}
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
              >
                <span>Request Project Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
