import React from 'react';
import { ShieldCheck, Award, CheckCircle2, MessageCircle, Flame } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutPageProps {
  settings: SiteSettings;
  onNavigate: (page: string) => void;
  onOpenQuote: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate, onOpenQuote }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello ABN Thermocare System, I would like to learn more about your company services.'
  )}`;

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-rose-50/70 via-white to-slate-50 text-slate-900 py-16 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Established 2011 • Greater Noida, India
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-2">
            About ABN Thermocare System
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            Leading Manufacturer & Industrial Service Provider for Thermal Insulation, Utility Pipeline Engineering, Electric Heaters, Industrial Chimneys & Chemical Storage Vessels.
          </p>
        </div>
      </section>

      {/* Main Company Profile & Owner Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                15+ Years Industrial Heritage
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                Pioneering Industrial Thermal & Electrical Engineering
              </h2>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              Founded in <strong>2011</strong> under the leadership of <strong>Mr. A. Singh</strong>, ABN Thermocare System has grown from a specialized thermal insulation contractor into a full-fledged manufacturer and turnkey service provider in Greater Noida, Gautam Buddha Nagar, Uttar Pradesh.
            </p>

            <p className="text-sm text-slate-700 leading-relaxed">
              We cater to diverse heavy industries including petrochemical refineries, pharmaceutical formulation plants, chemical manufacturing, food processing mills, and power generation units. Our solutions focus on maximizing fuel efficiency, maintaining strict process temperatures, and guaranteeing industrial safety.
            </p>

            {/* Key Business Specs Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Business Structure</span>
                <strong className="text-slate-900">{settings.businessType}</strong>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Owner / Founder</span>
                <strong className="text-slate-900">{settings.owner}</strong>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Year Established</span>
                <strong className="text-slate-900">2011 (15+ Yrs)</strong>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Team Strength</span>
                <strong className="text-slate-900">{settings.employeeCount} Experts</strong>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">GSTIN Registration</span>
                <strong className="text-slate-900">{settings.gstin}</strong>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Headquarters</span>
                <strong className="text-slate-900">Greater Noida, UP</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenQuote}
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow transition"
              >
                Request Quotation
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-3.5 rounded-xl transition flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Owner / Sales</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-md border border-rose-100 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 bg-rose-600 text-white rounded-lg flex items-center justify-center font-bold">
                  <Flame className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">Facility & Operations</h3>
                  <p className="text-xs text-slate-500">EcoTech Industrial Area, Greater Noida</p>
                </div>
              </div>

              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
                  alt="ABN Thermocare Manufacturing Works"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>In-house heavy sheet metal bending, rolling, and automated seam welding.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>NDT crack detection, pneumatic pressure testing, and hydrostatic vessel testing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>High-density Rockwool, Ceramic Fibre, and Polyurethane foam thermal insulation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Statements */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Our Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To engineer energy-efficient, robust thermal insulation and heavy electrical systems that minimize industrial heat loss, optimize manufacturing cost structures, and adhere strictly to global environmental and safety standards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Our Quality Commitment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every utility pipeline, storage tank, and electric heater delivered by ABN Thermocare System undergoes meticulous quality assurance checks, material grade certifications, and on-site testing prior to final client hand-over.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ownership & Location Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-serif text-white">Visit Our Greater Noida Works</h3>
            <p className="text-xs text-rose-100 max-w-xl">
              {settings.address}
            </p>
            <p className="text-xs text-rose-200 font-medium">
              Phone: {settings.phone} • Email: {settings.email}
            </p>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="bg-white hover:bg-rose-50 text-rose-800 font-bold text-xs px-6 py-3 rounded-xl shadow transition shrink-0"
          >
            Get Directions & Contact Form
          </button>
        </div>
      </section>
    </div>
  );
};

