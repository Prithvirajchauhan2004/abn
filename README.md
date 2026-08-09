# ABN Thermocare System - Industrial Business Website & Admin Portal

A full-stack web application and admin management system for **ABN Thermocare System**, an industrial manufacturer and service provider based in Greater Noida, Gautam Buddha Nagar, Uttar Pradesh, India, established in 2011.

---

## 🌟 Features

### Public Website
1. **Home Page**: Hero banner with company tagline, direct call & WhatsApp CTAs, 15+ years experience trust bar, dynamic services grid, core competencies, client testimonials, and quotation request banner.
2. **About Us**: Detailed history (est. 2011), founder story (Mr. A. Singh), Greater Noida EcoTech facility details, ISO & CPCB compliance, quality assurance, and mission statements.
3. **Services & Products Catalog**: Live dynamic service catalog rendered from the admin database across all 8 requested categories:
   - **Installation Services** (Utility Pipeline, Storage Tank)
   - **Insulation Services** (Steam Pipe, Hot & Cold Thermal Lagging)
   - **Electric Heaters** (Suction Heater, Oil Immersion Heaters, Band & Ceramic Infrared)
   - **Fire Alarm System Service**
   - **Industrial Chimneys** (MS Chimney, Self-Supported, Stainless Steel)
   - **Turnkey Electrical Project Service** (HT/LT Panels)
   - **Heating Coils** (Mineral Insulated Coils)
   - **Storage Tanks** (Stainless Steel & Mild Steel Chemical Vessels)
   - *Filter by Category, Search by Keyword, and View Technical Specifications in Detail Modals.*
4. **Project Gallery**: High-resolution industrial project execution photos with category filters and image lightbox viewer.
5. **Contact & Lead Capture**: Interactive quotation form with anti-spam honeypot, click-to-call hotline (+91 8043801550), WhatsApp click-to-chat integration, and embedded Greater Noida Google Map.

### Protected Admin Portal (`/admin`)
1. **Authentication**: JWT & bcrypt password hashing authentication with pre-configured reviewer credentials.
2. **Dashboard**: Live summary metrics (Total Leads, New Leads this week, Active Services count, Most Requested Category, Recent Lead activity feed).
3. **Leads Management**:
   - Filter leads by status (`New`, `Contacted`, `Converted`, `Closed`) or search term.
   - Click to view full requirement details and write follow-up notes.
   - Export lead database to **CSV**.
4. **Services Management (CRUD)**:
   - Create new services with title, category, full description, image, price, and use-case tags.
   - Edit existing service specifications.
   - Delete services with safety confirmation modal.
   - **Active/Inactive Toggle**: Hide or reveal services on the public site instantly without deleting them.
5. **Site Settings & Security**:
   - Update phone number, WhatsApp chat number, official email, GSTIN, and address across the site in real time.
   - Update admin account password.

---

## 🔑 Pre-Configured Test Credentials

Access the admin dashboard via the navbar link or by selecting the **Admin** tab.

- **Admin Login URL**: `/admin`
- **Username / Email**: `admin@abnthermocare.com` or `admin`
- **Password**: `adminpassword123`

---

## 🛠️ Environment Variables (`.env.example`)

```env
# Server Port (3000 hardcoded in Cloud Run container environment)
PORT=3000

# Secret key for JWT admin authentication
JWT_SECRET="abn-thermocare-secret-key-2026"

# Optional Gemini API Key
GEMINI_API_KEY=""
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (Express + Vite)
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 📦 Production Build & Deployment

```bash
# Build Vite frontend & bundle Express server with esbuild
npm run build

# Start production server
npm run start
```
