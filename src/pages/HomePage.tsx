import React from 'react';
import { ShieldCheck, Phone, MessageCircle, ArrowRight, CheckCircle2, Star, Flame, Wrench, Factory, Zap, ChevronRight } from 'lucide-react';
import { Service, SiteSettings } from '../types';

interface HomePageProps {
  settings: SiteSettings;
  services: Service[];
  onNavigate: (page: string) => void;
  onOpenQuote: (serviceName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ settings, services, onNavigate, onOpenQuote }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello ABN Thermocare System, I am interested in your industrial thermal & insulation services.'
  )}`;

  // Top active featured services from database
  const featuredServices = services.filter((s) => s.isActive).slice(0, 6);

  return (
    <div className="space-y-16 pb-16 text-slate-800">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-rose-50/70 via-white to-slate-50 text-slate-900 overflow-hidden py-16 sm:py-24 border-b border-rose-100/80">
        {/* Subtle Industrial Background Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-5 bg-cover bg-center mix-blend-multiply" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1920')" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Crisp Headline & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-rose-100/80 border border-rose-200/80 text-rose-800 font-semibold text-xs px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>Greater Noida Industrial Hub • Est. 2011</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold font-serif leading-tight text-slate-900 tracking-tight">
                Engineering Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-700 to-red-600">Thermal & Insulation</span> Solutions
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Precision-engineered utility pipelines, steam thermal insulation, industrial electric heaters, chimneys, and turnkey electrical systems.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenQuote()}
                  className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md shadow-rose-600/20 hover:shadow-lg transition flex items-center gap-2"
                >
                  <span>Request a Fast Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm transition flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-rose-600" />
                  <span>Call {settings.phone}</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 py-3.5 rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>15+ Years Track Record</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>NDT Certified Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>CPCB & ISO Standards</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-rose-100 shadow-xl group bg-white p-2">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"
                    alt="Steam Pipe Thermal Insulation Installation"
                    className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-rose-100 shadow-lg space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-700">Featured Showcase</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md">Thermal Lagging</span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold">Zero-Heat-Loss Steam Pipe Insulation System</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0 space-y-1">
            <div className="text-3xl font-bold font-serif text-slate-900">15+</div>
            <p className="text-xs font-semibold text-slate-600">Years Industry Experience</p>
          </div>
          <div className="pt-2 md:pt-0 space-y-1">
            <div className="text-3xl font-bold font-serif text-rose-600">250+</div>
            <p className="text-xs font-semibold text-slate-600">Turnkey Projects</p>
          </div>
          <div className="pt-2 md:pt-0 space-y-1">
            <div className="text-3xl font-bold font-serif text-slate-900">100%</div>
            <p className="text-xs font-semibold text-slate-600">Compliance & Safety</p>
          </div>
          <div className="pt-2 md:pt-0 space-y-1">
            <div className="text-3xl font-bold font-serif text-rose-600">ISO 9001</div>
            <p className="text-xs font-semibold text-slate-600">Certified Manufacturing</p>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Industrial Services & Products
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-1.5 font-semibold text-xs text-rose-700 hover:text-rose-800 transition"
          >
            <span>View Full Catalog ({services.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-slate-900">
                  <img
                    src={srv.imageUrl}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-rose-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-rose-500/20">
                    {srv.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold font-serif text-slate-900 group-hover:text-rose-700 transition">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {srv.shortDescription}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="text-xs font-semibold text-slate-700">
                  {srv.price}
                </span>
                <button
                  onClick={() => onOpenQuote(srv.name)}
                  className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US - CLEAN LIGHT CARDS */}
      <section className="bg-gradient-to-br from-rose-50/70 via-white to-slate-50 border border-rose-100 py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
            Engineering Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            Why Engineers Partner With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-rose-100/90 p-6 rounded-2xl shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center font-bold">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif">In-House Manufacturing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Custom fabrication in Greater Noida facility adhering to ASME and IS specification guidelines.
            </p>
          </div>

          <div className="bg-white border border-rose-100/90 p-6 rounded-2xl shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif">NDT Certified Welding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rigorous quality testing and insulation lagging for zero-leak, zero-heat-loss performance.
            </p>
          </div>

          <div className="bg-white border border-rose-100/90 p-6 rounded-2xl shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Turnkey Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete project execution from isometric design and insulation to panel installation.
            </p>
          </div>
        </div>
      </section>

      {/* CLIENT REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
            Client Feedback
          </span>
          <h2 className="text-2xl font-bold font-serif text-slate-900">
            Trusted Across Greater Noida & NCR
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex text-rose-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-rose-500" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "ABN Thermocare completed steam pipe insulation at our chemical plant. Thermal loss dropped drastically and boiler fuel savings are noticeable."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Rajesh Sharma</p>
              <p className="text-[11px] text-slate-500">Plant Manager, Chemical Unit</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex text-rose-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-rose-500" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Ordered two stainless steel jacketed storage tanks. Flawless fabrication quality, on-time delivery, and full pressure test documentation."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Vikram Mehta</p>
              <p className="text-[11px] text-slate-500">Technical Director, Pharma Lab</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex text-rose-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-rose-500" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Reliable industrial oil immersion heaters and custom band heaters. The technical team provided expert guidance on site."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Anil Agarwal</p>
              <p className="text-[11px] text-slate-500">Operations Head, Polymer Ind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <h2 className="text-2xl font-bold font-serif">
              Need Industrial Thermal & Insulation Work?
            </h2>
            <p className="text-xs sm:text-sm text-rose-100">
              Contact ABN Thermocare System for direct factory pricing or on-site pipeline inspection.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuote()}
              className="bg-white hover:bg-rose-50 text-rose-800 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition"
            >
              Get a Fast Quote
            </button>
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="bg-rose-800/40 hover:bg-rose-800/60 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 border border-rose-400/30"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};


