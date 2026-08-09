import React, { useState } from 'react';
import { Filter, X, ZoomIn, ArrowRight } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryPageProps {
  gallery: GalleryItem[];
  onOpenQuote: (serviceName?: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery, onOpenQuote }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Insulation Services', 'Storage Tanks', 'Industrial Chimneys', 'Turnkey Electrical Project Service', 'Electric Heaters', 'Fire Alarm System Service'];

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
            Real field execution photos of utility pipeline lagging, chemical storage tanks, self-supported industrial chimneys, HT/LT electrical panels, and electric heaters.
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
              className="group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
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
                    <span>View Project</span>
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
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 my-8 text-white">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video relative bg-slate-950">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 space-y-3 bg-slate-900">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded">
                {activeItem.category}
              </span>
              <h2 className="text-xl font-bold font-serif text-white">{activeItem.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{activeItem.description}</p>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400">Execution Site: Greater Noida / NCR Region</span>
                <button
                  onClick={() => {
                    const title = activeItem.title;
                    setActiveItem(null);
                    onOpenQuote(title);
                  }}
                  className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
                >
                  <span>Request Similar Project Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

