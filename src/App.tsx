import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { QuoteModal } from './components/QuoteModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { Service, SiteSettings, GalleryItem } from './types';
import { api } from './lib/api';

export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
    if (path === '/admin' || hash === 'admin') return 'admin';
    if (path === '/services' || hash === 'services') return 'services';
    if (path === '/gallery' || hash === 'gallery') return 'gallery';
    if (path === '/about' || hash === 'about') return 'about';
    if (path === '/contact' || hash === 'contact') return 'contact';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    companyName: 'ABN Thermocare System',
    tagline: 'Industrial Thermal & Insulation Solutions Since 2011',
    location: 'Greater Noida, Gautam Buddha Nagar, Uttar Pradesh, India',
    address: 'Plot No. C-45, EcoTech 1, Greater Noida, Gautam Buddha Nagar, UP - 201306, India',
    owner: 'A Singh',
    phone: '+91 8043801550',
    whatsapp: '+918043801550',
    email: 'info@abnthermocare.com',
    experienceYears: 15,
    employeeCount: '11–25',
    businessType: 'Proprietorship, Manufacturer & Service Provider',
    gstin: '09AABCU9601M1ZD',
  });

  // Sync navigation with URL hash / pushState
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (page === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/${page}`);
    }
  };

  // Listen to popstate or hash changes
  useEffect(() => {
    const handlePopState = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteServiceName, setQuoteServiceName] = useState<string | undefined>(undefined);

  const fetchPublicData = async () => {
    try {
      const [fetchedServices, fetchedSettings, fetchedGallery] = await Promise.all([
        api.getServices(false), // active only for public
        api.getSettings(),
        api.getGallery(),
      ]);
      setServices(fetchedServices);
      setSettings(fetchedSettings);
      setGallery(fetchedGallery);
    } catch (err) {
      console.error('Error fetching public data:', err);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  const handleOpenQuoteModal = (serviceName?: string) => {
    setQuoteServiceName(serviceName);
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setQuoteServiceName(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        settings={settings}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenQuote={handleOpenQuoteModal}
      />

      {/* Main Dynamic View Page */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            settings={settings}
            services={services}
            gallery={gallery}
            onNavigate={handleNavigate}
            onOpenQuote={handleOpenQuoteModal}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            settings={settings}
            onNavigate={handleNavigate}
            onOpenQuote={() => handleOpenQuoteModal()}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage services={services} gallery={gallery} settings={settings} onOpenQuote={handleOpenQuoteModal} />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage gallery={gallery} settings={settings} onOpenQuote={handleOpenQuoteModal} />
        )}

        {currentPage === 'contact' && (
          <ContactPage settings={settings} services={services} />
        )}

        {currentPage === 'admin' && (
          <AdminPage onNavigate={handleNavigate} onRefreshPublicData={fetchPublicData} />
        )}
      </main>

      {/* Global Footer (shown on public pages) */}
      {currentPage !== 'admin' && (
        <Footer
          settings={settings}
          onNavigate={handleNavigate}
          onOpenQuote={handleOpenQuoteModal}
        />
      )}

      {/* Global Floating WhatsApp Chat Widget */}
      {currentPage !== 'admin' && <WhatsAppButton settings={settings} />}

      {/* Global Quick Quote Request Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={handleCloseQuoteModal}
        selectedServiceName={quoteServiceName}
        services={services}
        settings={settings}
      />
    </div>
  );
}
