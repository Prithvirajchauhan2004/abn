import React, { useState } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Tag,
  ShieldCheck,
  Building2,
  Play,
  Pause,
} from 'lucide-react';
import { Service, SiteSettings, GalleryItem } from '../types';

interface ServiceDetailModalProps {
  service: Service;
  settings: SiteSettings;
  galleryItems?: GalleryItem[];
  onClose: () => void;
  onOpenQuote: (serviceName?: string) => void;
}

// Fallback high-res industrial photos per category for slideshow richness
const CATEGORY_SLIDESHOW_FALLBACKS: Record<string, string[]> = {
  'Installation Services': [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
  ],
  'Insulation Services': [
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
  ],
  'Electric Heaters': [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
  ],
  'Industrial Chimneys': [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
  ],
  'Storage Tanks': [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1200',
  ],
  'Turnkey Electrical Project Service': [
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
  ],
};

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  settings,
  galleryItems = [],
  onClose,
  onOpenQuote,
}) => {
  // Collect all unique images for the slideshow
  const categoryGalleryImages = galleryItems
    .filter((g) => g.category === service.category || g.title.toLowerCase().includes(service.name.toLowerCase().split(' ')[0]))
    .map((g) => g.imageUrl);

  const fallbacks = CATEGORY_SLIDESHOW_FALLBACKS[service.category] || [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1200',
  ];

  const slideshowImages = service.images && service.images.length > 0
    ? service.images
    : Array.from(new Set([service.imageUrl, ...categoryGalleryImages, ...fallbacks])).filter(Boolean);

  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Auto-slide effect if enabled
  React.useEffect(() => {
    if (!isPlaying || slideshowImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPlaying, slideshowImages.length]);

  const handlePrev = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? slideshowImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImgIndex((prev) => (prev + 1) % slideshowImages.length);
  };

  const phoneNum = settings.phone || '+91 8043801550';
  const whatsappNum = settings.whatsapp || '+918043801550';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        {/* TOP MODAL HEADER */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2 overflow-hidden pr-4">
            <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0">
              {service.category}
            </span>
            <h2 className="text-base sm:text-lg font-bold font-serif truncate text-slate-100">
              {service.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY - SCROLLABLE & RESPONSIVE */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* IMAGE SLIDESHOW GALLERY */}
          <div className="space-y-3 bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-inner">
            <div className="relative aspect-video max-h-80 sm:max-h-96 w-full overflow-hidden rounded-xl bg-slate-900 group">
              <img
                src={slideshowImages[currentImgIndex]}
                alt={`${service.name} view ${currentImgIndex + 1}`}
                className="w-full h-full object-contain transition-all duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next controls */}
              {slideshowImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition shadow-lg border border-slate-700 opacity-90 group-hover:opacity-100"
                    title="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition shadow-lg border border-slate-700 opacity-90 group-hover:opacity-100"
                    title="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Top Controls Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white pointer-events-none">
                <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700 text-[11px]">
                  Image {currentImgIndex + 1} of {slideshowImages.length}
                </span>

                <div className="flex items-center gap-2 pointer-events-auto">
                  {slideshowImages.length > 1 && (
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-slate-900/80 hover:bg-slate-900 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1 text-[11px] transition"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3 h-3 text-amber-400" />
                          <span>Pause Slideshow</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span>Auto Play</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="bg-slate-900/80 hover:bg-slate-900 text-slate-200 p-1.5 rounded-md border border-slate-700 transition"
                    title="Toggle view mode"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* THUMBNAIL STRIP */}
            {slideshowImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                {slideshowImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                      currentImgIndex === idx
                        ? 'border-rose-500 scale-105 shadow-md'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TWO-COLUMN INFO SECTION FOR HIGH READABILITY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Main Column: Descriptions & Details */}
            <div className="lg:col-span-8 space-y-5">
              {/* Short Summary Card */}
              <div className="bg-gradient-to-r from-rose-50 via-white to-slate-50 border border-rose-200/80 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Executive Summary
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              {/* Full Description with Admin Preserved Line Breaks */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-rose-600" />
                  Complete Service & Technical Specifications
                </h3>
                <div className="bg-slate-50/80 border border-slate-200 p-5 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                  {service.fullDescription}
                </div>
              </div>

              {/* Use Cases / Applications */}
              {service.useCases && service.useCases.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Industrial Applications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {service.useCases.map((uc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-800">{uc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Column: Commercials & Fast Actions */}
            <div className="lg:col-span-4 space-y-4">
              {/* Pricing Box */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Commercials & Rate
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-rose-400">
                  {service.price}
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Custom turnkey quotes available based on isometric drawings, piping diameter, and material specifications.
                </p>
              </div>

              {/* Standards & Trust Badges */}
              <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Quality Assurance Guaranteed</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>In-House Greater Noida Fabrication</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>NDT Testing & ASME Guidelines</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>CPCB & Industrial Safety Compliant</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER - RESPONSIVE ACTION BAR */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-2">
            {/* GET A CALLBACK */}
            <button
              onClick={() => {
                onClose();
                onOpenQuote(`Callback Request: ${service.name}`);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 sm:px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Get a Callback</span>
            </button>

            {/* CALL NOW */}
            <a
              href={`tel:${phoneNum.replace(/[^0-9+]/g, '')}`}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3 sm:px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Call Now ({phoneNum})</span>
              <span className="sm:hidden">Call Now</span>
            </a>

            {/* WHATSAPP */}
            <a
              href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello ABN Thermocare, I am reading about "${service.name}". Please call me back.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs px-3 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenQuote(service.name);
            }}
            className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow flex items-center justify-center gap-2"
          >
            <span>Request Fast Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
