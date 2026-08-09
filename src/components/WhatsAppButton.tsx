import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface WhatsAppButtonProps {
  settings: SiteSettings;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ settings }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello ABN Thermocare System, I would like to inquire about industrial thermal & insulation solutions.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end group">
      {/* Tooltip badge */}
      <div className="hidden group-hover:flex items-center gap-2 bg-slate-900 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-xl mb-2 animate-bounce border border-slate-700">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        <span>Chat with ABN Sales Engineers (+91 8043801550)</span>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instant WhatsApp Chat Support"
        className="flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white"
      >
        <MessageCircle className="w-8 h-8 fill-white text-emerald-500" />
      </a>
    </div>
  );
};
