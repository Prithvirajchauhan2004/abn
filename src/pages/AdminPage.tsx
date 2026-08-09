import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  LayoutDashboard,
  Users,
  Wrench,
  Settings,
  Plus,
  Search,
  Download,
  Eye,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  Building2,
  MapPin,
  X,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Flame,
  KeyRound,
  FileText,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';
import { Service, Lead, SiteSettings, LeadStatus, ServiceCategory, AdminUser, GalleryItem } from '../types';
import { api, getAuthToken, removeAuthToken } from '../lib/api';

const INDUSTRIAL_PRESET_IMAGES = [
  {
    title: 'Thermal Piping Insulation',
    category: 'Insulation Services',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Storage Tank & Vessel',
    category: 'Storage Tanks',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Industrial Heaters & Coils',
    category: 'Electric Heaters',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Industrial Chimneys & MS Ducting',
    category: 'Industrial Chimneys',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'HT/LT Electrical Control Panels',
    category: 'Turnkey Electrical Project Service',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Fire Alarm Safety System',
    category: 'Fire Alarm System Service',
    url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800',
  },
];

const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return reject(new Error('Failed to read image file'));

      // If file is smaller than 800KB, use directly
      if (file.size < 800 * 1024) {
        resolve(result);
        return;
      }

      // Canvas compression for larger high-res camera uploads
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        } else {
          resolve(result);
        }
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

interface AdminPageProps {
  onNavigate: (page: string) => void;
  onRefreshPublicData: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate, onRefreshPublicData }) => {
  // Auth state
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ usernameOrEmail: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'services' | 'gallery' | 'settings'>('dashboard');

  // Admin Data State
  const [services, setServices] = useState<Service[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Gallery CRUD State
  const [gallerySearch, setGallerySearch] = useState('');
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    category: 'Installation Services',
    imageUrl: '',
    description: '',
  });
  const [deletingGalleryId, setDeletingGalleryId] = useState<string | null>(null);

  // Gallery Image Upload State
  const [galImageInputTab, setGalImageInputTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [galImageUploading, setGalImageUploading] = useState(false);
  const [galImageUploadError, setGalImageUploadError] = useState<string | null>(null);
  const [isDraggingGalImage, setIsDraggingGalImage] = useState(false);

  const handleGalImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setGalImageUploadError('Please select a valid image file.');
      return;
    }

    setGalImageUploadError(null);
    setGalImageUploading(true);

    try {
      const dataUrl = await processImageFile(file);
      setGalleryFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch (err) {
      setGalImageUploadError('Failed to process image file.');
    } finally {
      setGalImageUploading(false);
    }
  };

  const handleGalDropImage = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingGalImage(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setGalImageUploadError('Please drop a valid image file.');
      return;
    }

    setGalImageUploadError(null);
    setGalImageUploading(true);
    try {
      const dataUrl = await processImageFile(file);
      setGalleryFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch (err) {
      setGalImageUploadError('Failed to process dropped image file.');
    } finally {
      setGalImageUploading(false);
    }
  };

  // Leads Filter & Search State
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All');
  const [selectedLeadModal, setSelectedLeadModal] = useState<Lead | null>(null);
  const [leadNotesInput, setLeadNotesInput] = useState('');

  // Service CRUD Modals
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    category: 'Installation Services' as ServiceCategory,
    shortDescription: '',
    fullDescription: '',
    imageUrl: '',
    price: 'Price on Request',
    isActive: true,
    sortOrder: 1,
    useCasesText: '',
  });
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  // Service Image Upload State
  const [imageInputTab, setImageInputTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setImageUploadError(null);
    setImageUploading(true);

    try {
      const dataUrl = await processImageFile(file);
      setServiceFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch (err: any) {
      setImageUploadError('Failed to process image file. Please try another image.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
  };

  const handleDropImage = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please drop a valid image file.');
      return;
    }

    setImageUploadError(null);
    setImageUploading(true);
    try {
      const dataUrl = await processImageFile(file);
      setServiceFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch (err) {
      setImageUploadError('Failed to process dropped image file.');
    } finally {
      setImageUploading(false);
    }
  };

  // Settings & Change Password Form
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Verify auth session on mount
  useEffect(() => {
    if (token) {
      api
        .getMe()
        .then((data) => {
          setUser(data.user);
          loadAdminData();
        })
        .catch(() => {
          removeAuthToken();
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [allServices, allLeads, siteSettings, galleryData] = await Promise.all([
        api.getServices(true), // include inactive
        api.getLeads(),
        api.getSettings(),
        api.getGallery(),
      ]);
      setServices(allServices);
      setLeads(allLeads);
      setSettings(siteSettings);
      setSettingsForm(siteSettings);
      setGalleryItems(galleryData);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoggingIn(true);
    try {
      const res = await api.login(loginForm.usernameOrEmail, loginForm.password);
      setToken(res.token);
      setUser(res.user);
      await loadAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  // ---------------- SERVICES CRUD HANDLERS ----------------
  const handleOpenAddService = () => {
    setEditingService(null);
    setImageUploadError(null);
    setImageInputTab('upload');
    setServiceFormData({
      name: '',
      category: 'Installation Services',
      shortDescription: '',
      fullDescription: '',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      price: 'Price on Request',
      isActive: true,
      sortOrder: services.length + 1,
      useCasesText: '',
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: Service) => {
    setEditingService(service);
    setImageUploadError(null);
    setImageInputTab(service.imageUrl && service.imageUrl.startsWith('data:') ? 'upload' : 'url');
    setServiceFormData({
      name: service.name,
      category: service.category,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      imageUrl: service.imageUrl,
      price: service.price,
      isActive: service.isActive,
      sortOrder: service.sortOrder,
      useCasesText: service.useCases ? service.useCases.join('\n') : '',
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const useCases = serviceFormData.useCasesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: serviceFormData.name,
        category: serviceFormData.category,
        shortDescription: serviceFormData.shortDescription,
        fullDescription: serviceFormData.fullDescription,
        imageUrl: serviceFormData.imageUrl,
        price: serviceFormData.price,
        isActive: serviceFormData.isActive,
        sortOrder: serviceFormData.sortOrder,
        useCases,
      };

      if (editingService) {
        await api.updateService(editingService.id, payload);
      } else {
        await api.createService(payload);
      }

      setIsServiceModalOpen(false);
      await loadAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    }
  };

  const handleToggleServiceActive = async (id: string) => {
    try {
      await api.toggleServiceActive(id);
      await loadAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle service status');
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await api.deleteService(id);
      setDeletingServiceId(null);
      await loadAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete service');
    }
  };

  // ---------------- LEADS HANDLERS ----------------
  const handleUpdateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      await api.updateLead(leadId, { status });
      await loadAdminData();
      if (selectedLeadModal && selectedLeadModal.id === leadId) {
        setSelectedLeadModal((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update lead status');
    }
  };

  const handleSaveLeadNotes = async () => {
    if (!selectedLeadModal) return;
    try {
      await api.updateLead(selectedLeadModal.id, { notes: leadNotesInput });
      await loadAdminData();
      setSelectedLeadModal((prev) => (prev ? { ...prev, notes: leadNotesInput } : null));
      alert('Lead notes updated successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to update notes');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead record?')) return;
    try {
      await api.deleteLead(leadId);
      if (selectedLeadModal?.id === leadId) setSelectedLeadModal(null);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete lead');
    }
  };

  // ---------------- GALLERY CRUD HANDLERS ----------------
  const handleOpenAddGallery = () => {
    setEditingGalleryItem(null);
    setGalImageUploadError(null);
    setGalImageInputTab('upload');
    setGalleryFormData({
      title: '',
      category: 'Installation Services',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      description: '',
    });
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalImageUploadError(null);
    setGalImageInputTab(item.imageUrl && item.imageUrl.startsWith('data:') ? 'upload' : 'url');
    setGalleryFormData({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      description: item.description,
    });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormData.title.trim() || !galleryFormData.imageUrl.trim()) {
      alert('Please enter a project title and image URL/upload an image.');
      return;
    }

    try {
      if (editingGalleryItem) {
        await api.updateGalleryItem(editingGalleryItem.id, galleryFormData);
      } else {
        await api.createGalleryItem(galleryFormData);
      }
      setIsGalleryModalOpen(false);
      await loadAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to save gallery item');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      await api.deleteGalleryItem(id);
      setDeletingGalleryId(null);
      await loadAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete gallery item');
    }
  };

  // ---------------- SETTINGS HANDLERS ----------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    setSettingsSuccess(null);
    try {
      const updated = await api.updateSettings(settingsForm);
      setSettings(updated);
      setSettingsSuccess('Site configuration saved successfully!');
      onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      await api.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordSuccess('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    }
  };

  // ---------------- UNAUTHENTICATED LOGIN SCREEN ----------------
  if (!token || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-950">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center mx-auto text-white shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-white">
              ABN Thermocare Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Authorized Personnel Login • Greater Noida Management System
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username or Work Email
              </label>
              <input
                type="text"
                required
                value={loginForm.usernameOrEmail}
                onChange={(e) => setLoginForm({ ...loginForm, usernameOrEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-rose-500 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm py-3 rounded-xl shadow transition disabled:opacity-50"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-400 hover:text-rose-400 transition"
            >
              ← Back to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- PROTECTED ADMIN DASHBOARD SHELL ----------------
  const filteredLeads = leads.filter((lead) => {
    const matchStatus = leadStatusFilter === 'All' || lead.status === leadStatusFilter;
    const q = leadSearch.toLowerCase().trim();
    const matchQuery =
      !q ||
      lead.name.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.companyName.toLowerCase().includes(q) ||
      lead.serviceInterested.toLowerCase().includes(q) ||
      lead.city.toLowerCase().includes(q);

    return matchStatus && matchQuery;
  });

  const activeServicesCount = services.filter((s) => s.isActive).length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-600 rounded-lg flex items-center justify-center font-bold text-white">
              <Flame className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold font-serif text-white">ABN Thermocare System</h1>
              <p className="text-[11px] text-rose-400 font-medium">
                Admin Management Console • {user.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              View Public Site
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white px-3 py-1.5 rounded-lg border border-red-500/30 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'leads', label: `Leads Inbox (${newLeadsCount} New)`, icon: Users },
            { id: 'services', label: `Services CRUD (${services.length})`, icon: Wrench },
            { id: 'gallery', label: `Gallery CRUD (${galleryItems.length})`, icon: ImageIcon },
            { id: 'settings', label: 'Site Settings & Password', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 text-xs font-semibold px-4 py-3 border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-rose-500 text-rose-400 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl text-center shadow text-slate-500 text-sm">
            Loading latest admin database records...
          </div>
        ) : (
          <>
            {/* ---------------- TAB 1: DASHBOARD OVERVIEW ---------------- */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <span className="text-xs font-semibold text-slate-500 block">Total Customer Leads</span>
                    <div className="text-3xl font-bold font-serif text-slate-900">{leads.length}</div>
                    <p className="text-[11px] text-emerald-600 font-semibold">{newLeadsCount} New pending review</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <span className="text-xs font-semibold text-slate-500 block">Active Services Live</span>
                    <div className="text-3xl font-bold font-serif text-slate-900">{activeServicesCount}</div>
                    <p className="text-[11px] text-slate-500">Total in catalog: {services.length}</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <span className="text-xs font-semibold text-slate-500 block">Converted Clients</span>
                    <div className="text-3xl font-bold font-serif text-slate-900">
                      {leads.filter((l) => l.status === 'Converted').length}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-semibold">High conversion rate</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <span className="text-xs font-semibold text-slate-500 block">Top Category</span>
                    <div className="text-lg font-bold font-serif text-amber-700 truncate">
                      Insulation Services
                    </div>
                    <p className="text-[11px] text-slate-500">Steam pipe lagging inquiries</p>
                  </div>
                </div>

                {/* Recent Leads Widget */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-slate-900">Recent Lead Inquiries</h3>
                      <p className="text-xs text-slate-500">Latest form submissions from buyers in Greater Noida & North India</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
                    >
                      <span>Manage All Leads</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px]">
                        <tr>
                          <th className="p-3">Client Name</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Service Interested</th>
                          <th className="p-3">City</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {leads.slice(0, 5).map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900">{lead.name}</td>
                            <td className="p-3">{lead.phone}</td>
                            <td className="p-3 font-medium text-amber-800">{lead.serviceInterested}</td>
                            <td className="p-3">{lead.city}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                                  lead.status === 'New'
                                    ? 'bg-amber-100 text-amber-800'
                                    : lead.status === 'Contacted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : lead.status === 'Converted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {lead.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedLeadModal(lead);
                                  setLeadNotesInput(lead.notes || '');
                                }}
                                className="text-amber-700 hover:underline font-semibold"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- TAB 2: LEADS MANAGEMENT ---------------- */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-serif text-slate-900">
                        Customer Lead Inquiries
                      </h2>
                      <p className="text-xs text-slate-500">
                        Manage lead statuses, add follow-up notes, or export records to CSV.
                      </p>
                    </div>

                    <a
                      href={api.exportLeadsCsvUrl()}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2 self-start"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Export Leads to CSV</span>
                    </a>
                  </div>

                  {/* Filters & Search */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                    <div className="md:col-span-8 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search leads by name, phone, email, company, or service..."
                        value={leadSearch}
                        onChange={(e) => setLeadSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="md:col-span-4 flex items-center gap-1 overflow-x-auto">
                      {['All', 'New', 'Contacted', 'Converted', 'Closed'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setLeadStatusFilter(st)}
                          className={`text-xs font-semibold px-3 py-2 rounded-lg transition whitespace-nowrap ${
                            leadStatusFilter === st
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Leads Table */}
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-xs text-slate-700 border-collapse">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">Client & Company</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Service Interested</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredLeads.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">
                              No leads found matching your filters.
                            </td>
                          </tr>
                        ) : (
                          filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50 transition">
                              <td className="p-3 text-slate-500 whitespace-nowrap">
                                {new Date(lead.createdAt).toLocaleString()}
                              </td>
                              <td className="p-3">
                                <strong className="text-slate-900 block font-semibold">{lead.name}</strong>
                                {lead.companyName && (
                                  <span className="text-[11px] text-slate-500">{lead.companyName}</span>
                                )}
                              </td>
                              <td className="p-3 space-y-0.5">
                                <a href={`tel:${lead.phone}`} className="text-slate-900 font-semibold hover:underline block">
                                  {lead.phone}
                                </a>
                                {lead.email && <span className="text-[11px] text-slate-500 block">{lead.email}</span>}
                              </td>
                              <td className="p-3">
                                <span className="font-semibold text-amber-800 block">{lead.serviceInterested}</span>
                                <span className="text-[11px] text-slate-500">{lead.city}</span>
                              </td>
                              <td className="p-3">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                                  className={`text-[11px] font-bold px-2 py-1 rounded border outline-none ${
                                    lead.status === 'New'
                                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                                      : lead.status === 'Contacted'
                                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                                      : lead.status === 'Converted'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                      : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  <option value="New">New</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Converted">Converted</option>
                                  <option value="Closed">Closed</option>
                                </select>
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedLeadModal(lead);
                                    setLeadNotesInput(lead.notes || '');
                                  }}
                                  className="text-amber-700 hover:underline font-semibold"
                                >
                                  View / Notes
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="text-red-600 hover:underline font-semibold"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- TAB 3: SERVICES CRUD MANAGEMENT ---------------- */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-serif text-slate-900">
                        Services & Products Management
                      </h2>
                      <p className="text-xs text-slate-500">
                        Add, edit, toggle active/inactive, or delete services. All changes update public catalog immediately.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddService}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  {/* Services List grouped */}
                  <div className="space-y-4 pt-2">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        className={`p-4 rounded-xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          srv.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-300 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={srv.imageUrl}
                            alt={srv.name}
                            className="w-16 h-16 object-cover rounded-lg shrink-0 bg-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 font-serif">{srv.name}</h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  srv.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {srv.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-xs text-amber-700 font-medium">{srv.category}</p>
                            <p className="text-xs text-slate-600 line-clamp-1">{srv.shortDescription}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => handleToggleServiceActive(srv.id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 transition flex items-center gap-1.5"
                            title="Toggle active status without deleting"
                          >
                            {srv.isActive ? (
                              <>
                                <ToggleRight className="w-4 h-4 text-emerald-600" />
                                <span>Hide</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 text-slate-400" />
                                <span>Show</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenEditService(srv)}
                            className="text-xs font-semibold px-3 py-1.5 rounded border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setDeletingServiceId(srv.id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- TAB: GALLERY CRUD MANAGEMENT ---------------- */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-serif text-slate-900">
                        Project & Facility Gallery Management
                      </h2>
                      <p className="text-xs text-slate-500">
                        Add, edit, or remove project photos, site installation images, and equipment showcase items displayed on the public gallery.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddGallery}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Gallery Photo</span>
                    </button>
                  </div>

                  {/* Search bar for gallery items */}
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search gallery projects by title or category..."
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
                    />
                    {gallerySearch && (
                      <button
                        onClick={() => setGallerySearch('')}
                        className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Gallery items grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    {galleryItems
                      .filter((item) => {
                        const q = gallerySearch.toLowerCase().trim();
                        return (
                          !q ||
                          item.title.toLowerCase().includes(q) ||
                          item.category.toLowerCase().includes(q) ||
                          item.description.toLowerCase().includes(q)
                        );
                      })
                      .map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                        >
                          <div>
                            <div className="relative h-48 bg-slate-900 overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="bg-slate-900/80 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur border border-amber-500/20">
                                  {item.category}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 space-y-2">
                              <h4 className="text-sm font-bold font-serif text-slate-900">{item.title}</h4>
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {item.description || 'No description provided.'}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-end gap-2 mt-2">
                            <button
                              onClick={() => handleOpenEditGallery(item)}
                              className="text-xs font-semibold px-3 py-1.5 rounded border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setDeletingGalleryId(item.id)}
                              className="text-xs font-semibold px-3 py-1.5 rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {galleryItems.filter((item) => {
                    const q = gallerySearch.toLowerCase().trim();
                    return (
                      !q ||
                      item.title.toLowerCase().includes(q) ||
                      item.category.toLowerCase().includes(q) ||
                      item.description.toLowerCase().includes(q)
                    );
                  }).length === 0 && (
                    <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-sm font-semibold">No gallery items found.</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try clearing your search query or click "Add New Gallery Photo" above.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- TAB 4: SITE SETTINGS & SECURITY ---------------- */}
            {activeTab === 'settings' && settingsForm && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Site Contact Settings */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold font-serif text-slate-900 border-b border-slate-100 pb-3">
                    Public Company Contact Details
                  </h3>

                  {settingsSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{settingsSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={settingsForm.companyName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Telephone Number</label>
                        <input
                          type="text"
                          value={settingsForm.phone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                        <input
                          type="text"
                          value={settingsForm.whatsapp}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Full Factory Address</label>
                      <textarea
                        rows={3}
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
                        <input
                          type="text"
                          value={settingsForm.gstin}
                          onChange={(e) => setSettingsForm({ ...settingsForm, gstin: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Owner Name</label>
                        <input
                          type="text"
                          value={settingsForm.owner}
                          onChange={(e) => setSettingsForm({ ...settingsForm, owner: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
                    >
                      Save Contact Info Settings
                    </button>
                  </form>
                </div>

                {/* Password Change Box */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold font-serif text-slate-900 border-b border-slate-100 pb-3">
                    Change Admin Password
                  </h3>

                  {passwordSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
                      {passwordSuccess}
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                      {passwordError}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">New Password (Min 6 chars)</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg transition"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ---------------- MODALS ---------------- */}

      {/* 1. LEAD DETAIL MODAL */}
      {selectedLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Lead Details
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900">{selectedLeadModal.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLeadModal(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone</span>
                  <a href={`tel:${selectedLeadModal.phone}`} className="font-bold text-slate-900 hover:underline">
                    {selectedLeadModal.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email</span>
                  <span className="font-medium text-slate-800">{selectedLeadModal.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Company</span>
                  <span className="font-medium text-slate-800">{selectedLeadModal.companyName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">City</span>
                  <span className="font-medium text-slate-800">{selectedLeadModal.city}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Service Interested</span>
                <strong className="text-amber-800 font-serif text-sm">{selectedLeadModal.serviceInterested}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Requirement Message</span>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                  {selectedLeadModal.message}
                </p>
              </div>
            </div>

            {/* Follow up notes */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800">Admin Follow-up Notes</label>
              <textarea
                rows={3}
                placeholder="Add notes e.g., Sent quotation on WhatsApp, discussed pricing on call..."
                value={leadNotesInput}
                onChange={(e) => setLeadNotesInput(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
              />
              <button
                onClick={handleSaveLeadNotes}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded text-xs transition"
              >
                Save Notes
              </button>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedLeadModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD / EDIT SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                {editingService ? 'Edit Service Details' : 'Add New Service to Database'}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Utility Pipeline Installation"
                  value={serviceFormData.name}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={serviceFormData.category}
                    onChange={(e) =>
                      setServiceFormData({ ...serviceFormData, category: e.target.value as ServiceCategory })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    {[
                      'Installation Services',
                      'Insulation Services',
                      'Electric Heaters',
                      'Fire Alarm System Service',
                      'Industrial Chimneys',
                      'Turnkey Electrical Project Service',
                      'Heating Coils',
                      'Storage Tanks',
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Price on Request"
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary for service cards..."
                  value={serviceFormData.shortDescription}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, shortDescription: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed technical specifications, materials used, temperature range..."
                  value={serviceFormData.fullDescription}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, fullDescription: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              {/* Service Image Upload & Selector Control */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Service Image</span>
                  <span className="text-[11px] text-slate-400 font-normal">Displayed on catalog cards & modals</span>
                </label>

                {/* Live Image Preview */}
                {serviceFormData.imageUrl ? (
                  <div className="mb-3 relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 group">
                    <img
                      src={serviceFormData.imageUrl}
                      alt="Service Preview"
                      className="w-full h-40 object-cover opacity-90 group-hover:opacity-100 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <span className="bg-slate-950/80 text-amber-400 text-[10px] font-bold px-2 py-1 rounded backdrop-blur">
                        {serviceFormData.imageUrl.startsWith('data:') ? 'Uploaded File' : 'Image Linked'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setServiceFormData({ ...serviceFormData, imageUrl: '' })}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow transition flex items-center gap-1"
                        title="Remove current image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Source Selection Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 mb-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setImageInputTab('upload')}
                    className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition ${
                      imageInputTab === 'upload'
                        ? 'bg-white text-amber-800 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputTab('url')}
                    className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition ${
                      imageInputTab === 'url'
                        ? 'bg-white text-amber-800 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Web URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputTab('presets')}
                    className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition ${
                      imageInputTab === 'presets'
                        ? 'bg-white text-amber-800 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Stock Presets</span>
                  </button>
                </div>

                {/* TAB 1: FILE UPLOAD & DROPZONE */}
                {imageInputTab === 'upload' && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDropImage}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer relative ${
                      isDraggingImage
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-300 hover:border-amber-500 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {imageUploading
                            ? 'Processing & Optimizing Image...'
                            : 'Click to Choose File or Drag & Drop Image Here'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Supports PNG, JPG, WEBP, SVG (Auto-compressed for fast rendering)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: EXTERNAL WEB URL */}
                {imageInputTab === 'url' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Paste image URL (https://images.unsplash.com/...)"
                      value={serviceFormData.imageUrl}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, imageUrl: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}

                {/* TAB 3: INDUSTRIAL STOCK PRESETS */}
                {imageInputTab === 'presets' && (
                  <div className="grid grid-cols-3 gap-2">
                    {INDUSTRIAL_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setServiceFormData({ ...serviceFormData, imageUrl: preset.url })}
                        className={`group relative rounded-lg overflow-hidden border text-left transition ${
                          serviceFormData.imageUrl === preset.url
                            ? 'border-amber-500 ring-2 ring-amber-500/50'
                            : 'border-slate-200 hover:border-amber-400'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-14 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-1.5 bg-white text-[10px] font-semibold text-slate-800 truncate">
                          {preset.title}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {imageUploadError && (
                  <p className="text-[11px] font-semibold text-red-600 mt-1.5">{imageUploadError}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Use Cases (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Chemical Plants&#10;Refineries&#10;Pharma Labs"
                  value={serviceFormData.useCasesText}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, useCasesText: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={serviceFormData.isActive}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, isActive: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Active (Visible on public website)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DELETE SERVICE CONFIRMATION MODAL */}
      {deletingServiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 font-serif">Confirm Delete Service?</h3>
            <p className="text-slate-600">
              Are you sure you want to permanently delete this service from the database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingServiceId(null)}
                className="px-3 py-2 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteService(deletingServiceId)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD / EDIT GALLERY MODAL */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                {editingGalleryItem ? 'Edit Gallery Project Details' : 'Add New Gallery Photo to Portfolio'}
              </h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project / Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Steam Pipeline Lagging at Chemical Unit"
                  value={galleryFormData.title}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={galleryFormData.category}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Installation Services">Installation Services</option>
                  <option value="Insulation Services">Insulation Services</option>
                  <option value="Electric Heaters">Electric Heaters</option>
                  <option value="Fire Alarm System Service">Fire Alarm System Service</option>
                  <option value="Industrial Chimneys">Industrial Chimneys</option>
                  <option value="Turnkey Electrical Project Service">Turnkey Electrical Project Service</option>
                  <option value="Heating Coils">Heating Coils</option>
                  <option value="Storage Tanks">Storage Tanks</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the scope, site details, temperature specs, or equipment used..."
                  value={galleryFormData.description}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Gallery Image Upload / Selection Control */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Project Image *</span>
                  <span className="text-[11px] text-slate-400 font-normal">Displayed in high-res gallery lightbox</span>
                </label>

                {/* Live Image Preview */}
                {galleryFormData.imageUrl ? (
                  <div className="mb-3 relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 group">
                    <img
                      src={galleryFormData.imageUrl}
                      alt="Gallery Preview"
                      className="w-full h-44 object-cover opacity-90 group-hover:opacity-100 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <span className="bg-slate-950/80 text-amber-400 text-[10px] font-bold px-2 py-1 rounded backdrop-blur">
                        {galleryFormData.imageUrl.startsWith('data:') ? 'Uploaded File' : 'Image Linked'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGalleryFormData({ ...galleryFormData, imageUrl: '' })}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow transition flex items-center gap-1"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Source Selection Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 mb-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setGalImageInputTab('upload')}
                    className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition ${
                      galImageInputTab === 'upload'
                        ? 'bg-white text-amber-800 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalImageInputTab('url')}
                    className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition ${
                      galImageInputTab === 'url'
                        ? 'bg-white text-amber-800 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Web URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalImageInputTab('presets')}
                    className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition ${
                      galImageInputTab === 'presets'
                        ? 'bg-white text-amber-800 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Stock Presets</span>
                  </button>
                </div>

                {/* TAB 1: FILE UPLOAD & DROPZONE */}
                {galImageInputTab === 'upload' && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingGalImage(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDraggingGalImage(false);
                    }}
                    onDrop={handleGalDropImage}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer relative ${
                      isDraggingGalImage
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-300 hover:border-amber-500 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={handleGalImageFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {galImageUploading
                            ? 'Processing & Optimizing Image...'
                            : 'Click to Choose File or Drag & Drop Image Here'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Supports PNG, JPG, WEBP, SVG (Auto-compressed for fast rendering)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: EXTERNAL WEB URL */}
                {galImageInputTab === 'url' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Paste image URL (https://images.unsplash.com/...)"
                      value={galleryFormData.imageUrl}
                      onChange={(e) => setGalleryFormData({ ...galleryFormData, imageUrl: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}

                {/* TAB 3: INDUSTRIAL STOCK PRESETS */}
                {galImageInputTab === 'presets' && (
                  <div className="grid grid-cols-3 gap-2">
                    {INDUSTRIAL_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGalleryFormData({ ...galleryFormData, imageUrl: preset.url })}
                        className={`group relative rounded-lg overflow-hidden border text-left transition ${
                          galleryFormData.imageUrl === preset.url
                            ? 'border-amber-500 ring-2 ring-amber-500/50'
                            : 'border-slate-200 hover:border-amber-400'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-14 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-1.5 bg-white text-[10px] font-semibold text-slate-800 truncate">
                          {preset.title}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {galImageUploadError && (
                  <p className="text-[11px] font-semibold text-red-600 mt-1.5">{galImageUploadError}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
                >
                  Save Gallery Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE GALLERY ITEM CONFIRMATION MODAL */}
      {deletingGalleryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 font-serif">Confirm Delete Gallery Photo?</h3>
            <p className="text-slate-600">
              Are you sure you want to permanently delete this photo from the public gallery?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingGalleryId(null)}
                className="px-3 py-2 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteGallery(deletingGalleryId)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
