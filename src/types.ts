export type ServiceCategory =
  | 'Installation Services'
  | 'Insulation Services'
  | 'Electric Heaters'
  | 'Fire Alarm System Service'
  | 'Industrial Chimneys'
  | 'Turnkey Electrical Project Service'
  | 'Heating Coils'
  | 'Storage Tanks';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  price: string; // e.g. "Price on Request" or "₹15,000 / unit"
  isActive: boolean;
  sortOrder: number;
  useCases: string[];
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Closed';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  serviceInterested: string;
  message: string;
  city: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  location: string;
  address: string;
  owner: string;
  phone: string;
  whatsapp: string;
  email: string;
  experienceYears: number;
  employeeCount: string;
  businessType: string;
  gstin: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  name: string;
}

export interface AuthState {
  token: string | null;
  user: AdminUser | null;
}
