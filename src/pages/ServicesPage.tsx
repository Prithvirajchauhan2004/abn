import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, CheckCircle2, X, Info } from 'lucide-react';
import { Service } from '../types';

interface ServicesPageProps {
  services: Service[];
  onOpenQuote: (serviceName?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services, onOpenQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalService, setActiveModalService] = useState<Service | null>(null);

  const categories: string[] = [
    'All',
    'Installation Services',
    'Insulation Services',
    'Electric Heaters',
    'Fire Alarm System Service',
    'Industrial Chimneys',
    'Turnkey Electrical Project Service',
    'Heating Coils',
    'Storage Tanks',
  ];

  // Filtered services list from database
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchCategory = selectedCategory === 'All' || srv.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.fullDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (srv.useCases && srv.useCases.some((uc) => uc.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchCategory && matchQuery;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-rose-50/70 via-white to-slate-50 text-slate-900 py-16 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Live Database Catalog • Updated by Admin
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-2">
            Industrial Services & Product Catalog
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            Browse our full spectrum of industrial thermal insulation, utility pipeline installation, electric heaters, industrial chimneys, storage tanks, and electrical turnkey engineering solutions.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search services (e.g. steam, heater, chimney, tank)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredServices.length}</strong> of{' '}
              <strong className="text-slate-900">{services.length}</strong> services
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredServices.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <Info className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 font-serif">No Services Match Your Search</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              We couldn't find any service matching "{searchQuery}" under "{selectedCategory}". Please try adjusting your filters or contact us directly for custom requirements.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img
                      src={srv.imageUrl}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-rose-400 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow border border-rose-500/20">
                      {srv.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold font-serif text-slate-900 group-hover:text-rose-700 transition">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {srv.shortDescription}
                    </p>

                    {srv.useCases && srv.useCases.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Common Applications:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {srv.useCases.map((uc, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200/60 px-2 py-0.5 rounded font-medium"
                            >
                              {uc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => setActiveModalService(srv)}
                    className="text-xs font-semibold text-slate-700 hover:text-rose-700 transition flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5 text-rose-600" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => onOpenQuote(srv.name)}
                    className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SERVICE DETAILS MODAL */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8">
            <div className="relative aspect-video bg-slate-900">
              <img
                src={activeModalService.imageUrl}
                alt={activeModalService.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setActiveModalService(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {activeModalService.category}
                </span>
                <h2 className="text-2xl font-bold font-serif">{activeModalService.name}</h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Full Service Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeModalService.fullDescription}
                </p>
              </div>

              {activeModalService.useCases && activeModalService.useCases.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Key Industrial Applications & Use Cases
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {activeModalService.useCases.map((uc, i) => (
                      <li key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{uc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block">Pricing Structure</span>
                  <span className="text-sm font-bold text-slate-900">{activeModalService.price}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveModalService(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const name = activeModalService.name;
                      setActiveModalService(null);
                      onOpenQuote(name);
                    }}
                    className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center gap-2"
                  >
                    <span>Request Official Quotation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

