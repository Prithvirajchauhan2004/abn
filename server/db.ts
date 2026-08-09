import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { Pool as NeonPool } from '@neondatabase/serverless';
import { Service, Lead, SiteSettings, GalleryItem, AdminUser } from '../src/types.js';

const { Pool } = pg;

interface DBData {
  adminUser: AdminUser & { passwordHash: string };
  settings: SiteSettings;
  services: Service[];
  leads: Lead[];
  gallery: GalleryItem[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_DATABASE_URL = process.env.DATABASE_URL || '';

// Default initial database content
const getDefaultData = (): DBData => {
  const defaultPasswordHash = bcrypt.hashSync('adminpassword123', 10);

  return {
    adminUser: {
      id: 'admin-1',
      email: 'admin@abnthermocare.com',
      username: 'admin',
      name: 'A Singh (Owner)',
      passwordHash: defaultPasswordHash,
    },
    settings: {
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
    },
    services: [
      {
        id: 'srv-1',
        name: 'Utility Pipeline Installation',
        category: 'Installation Services',
        shortDescription: 'Precision engineering for high-pressure steam, oil, chemical, and gas utility pipelines.',
        fullDescription: 'We deliver comprehensive utility pipeline installation services tailored for chemical plants, refineries, textile mills, and manufacturing units. Our engineers handle isometric route planning, NDT-certified structural welding, hydrostatic testing, and pressure vessel connections ensuring zero leakage and long operational lifespan.',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 1,
        useCases: ['Chemical Processing Plants', 'Petrochemical Refineries', 'Pharmaceutical Utilities', 'Steam & Condensate Lines'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-2',
        name: 'Storage Tank Installation',
        category: 'Installation Services',
        shortDescription: 'On-site erection and mechanical installation for vertical & horizontal industrial storage tanks.',
        fullDescription: 'Turnkey storage tank installation services including civil foundation alignment, shell assembly, jack-up erection, inlet/outlet manifold piping, safety valve calibration, and jacketed thermal wrapping for heated fluids.',
        imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 2,
        useCases: ['Fuel Storage Depots', 'Chemical Bulk Storage', 'Edible Oil Refineries', 'Thermal Fluid Reservoirs'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-3',
        name: 'Steam Pipe Insulation',
        category: 'Insulation Services',
        shortDescription: 'High-density Rockwool and Ceramic Fibre insulation with aluminum/SS cladding for minimum thermal loss.',
        fullDescription: 'Custom steam pipe thermal lagging using high-density mineral wool, calcium silicate blocks, and ceramic blankets. Finished with heavy-gauge aluminum or stainless steel jacketing to prevent corrosion-under-insulation (CUI) and optimize boiler fuel consumption.',
        imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 3,
        useCases: ['Boiler Steam Mains', 'Turbine Exhaust Lines', 'Distillation Columns', 'Food Processing Steam Lines'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-4',
        name: 'Hot & Cold Thermal Insulation',
        category: 'Insulation Services',
        shortDescription: 'Cryogenic & high-temp thermal barrier lagging for oil, gas, hydrocarbon, and refinery processes.',
        fullDescription: 'Engineered thermal insulation solutions covering extremes from -180°C cryogenic chilling loops to +1200°C furnace exhaust conduits. Designed specifically for oil & gas refineries, hydrocarbon fractionators, and fertilizer production plants.',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 4,
        useCases: ['Hydrocarbon Refineries', 'LPG/LNG Cryogenic Tanks', 'Chilled Water Lines', 'Thermal Oil Piping'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-5',
        name: 'Electric Suction Heater',
        category: 'Electric Heaters',
        shortDescription: 'Heavy-duty oil tank suction heaters for maintaining pumpable fluid temperatures.',
        fullDescription: 'Designed to heat viscous fluids like furnace oil, LDO, and bitumen at the suction point of storage tanks. Features explosion-proof junction boxes, removable heating element bundles, and precise digital temperature control panel integration.',
        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 5,
        useCases: ['Heavy Fuel Oil Tanks', 'Bitumen Storage Terminals', 'Furnace Feed Systems'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-6',
        name: 'Industrial Oil Immersion Heaters',
        category: 'Electric Heaters',
        shortDescription: 'Flanged & screw-plug electric immersion heaters with SS316/Incoloy sheathing.',
        fullDescription: 'Direct heating solutions for thermal oils, water, chemical solutions, and hydraulic fluids. Engineered with low watt-density heating elements to prevent oil carbonization and extend oil service life.',
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 6,
        useCases: ['Hot Oil Circulators', 'Hydraulic Power Units', 'Cleaning & Degreasing Tanks'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-7',
        name: 'Band Heater & Ceramic Infrared Heater',
        category: 'Electric Heaters',
        shortDescription: 'High-efficiency mica/ceramic band heaters and radiant infrared panels for plastic molding & drying.',
        fullDescription: 'Precision heating components for extrusion machines, injection molding barrels, and radiant curing tunnels. Offers uniform thermal distribution up to 500°C with thermal insulation shrouds for energy conservation.',
        imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 7,
        useCases: ['Plastic Extruders', 'Blow Molding Machines', 'Paint Drying Tunnels'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-8',
        name: 'Industrial Fire Alarm System Service',
        category: 'Fire Alarm System Service',
        shortDescription: 'Addressable & conventional fire detection, smoke sensing, and automated alarm integration.',
        fullDescription: 'Complete design, wiring, testing, and periodic audit services for industrial fire alarm systems. Includes optical smoke detectors, heat sensors, beam detectors for high-bay warehouses, main panel programming, and integration with fire suppression pumps.',
        imageUrl: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 8,
        useCases: ['Industrial Factories', 'High-Bay Warehouses', 'Chemical Storage Sheds', 'Control Rooms'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-9',
        name: 'Mild Steel Industrial Chimney',
        category: 'Industrial Chimneys',
        shortDescription: 'Custom fabricated MS self-supported & guy-wired industrial exhaust stacks up to 50m height.',
        fullDescription: 'Heavy-duty mild steel chimney stack fabrication and erection. Complete with internal anti-corrosion coating, external heat-resistant paint, aviation warning lights, lightning arrestors, and sampling ports per CPCB emission norms.',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 9,
        useCases: ['Industrial Boilers', 'DG Generator Sets', 'Process Furnaces', 'Incinerators'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-10',
        name: 'Self-Supported & Stainless Steel Chimney',
        category: 'Industrial Chimneys',
        shortDescription: 'SS304 / SS316 grade chimneys for corrosive chemical gas & flue stack discharge.',
        fullDescription: 'Corrosion-resistant stainless steel chimneys engineered for aggressive chemical fumes, acid vapors, and high-moisture exhaust streams. Includes structural stability calculations, wind load resistance, and expansion bellows.',
        imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 10,
        useCases: ['Acid Plants', 'Pharma Cleanroom Exhaust', 'Chemical Scrubbers'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-11',
        name: 'Turnkey Electrical Project Service',
        category: 'Turnkey Electrical Project Service',
        shortDescription: 'Complete HT/LT panel installation, transformer commissioning, and factory electrification.',
        fullDescription: 'End-to-end industrial electrical project management. Services cover HT switchgear, LT distribution panels, cable tray installation, busduct trunking, plant grounding / earthing grids, and power factor control panel (APFC) setup.',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 11,
        useCases: ['New Factory Setup', 'Power Substation Upgrade', 'Industrial Automation Electrification'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-12',
        name: 'Mineral Insulated Heating Coil',
        category: 'Heating Coils',
        shortDescription: 'Rugged MI heating cables & coils for pipe heat tracing, vessel heating, and high-temp processes.',
        fullDescription: 'Mineral insulated heating cables encased in seamless stainless steel or alloy sheaths with magnesium oxide insulation. Ideal for pipe freeze protection, temperature maintenance up to 600°C, and hazardous area trace heating.',
        imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 12,
        useCases: ['Pipeline Heat Tracing', 'Silo & Hopper Heating', 'High-Viscosity Fluid Transport'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-13',
        name: 'Stainless Steel & Mild Steel Chemical Storage Tanks',
        category: 'Storage Tanks',
        shortDescription: 'Custom capacity (1,000L to 100,000L) chemical, oil, and water storage tanks.',
        fullDescription: 'Precision fabricated SS316, SS304, and MS storage vessels engineered to IS & ASME standards. Available with agitators, level gauges, jacketed heating/cooling channels, and dish-end pressings for heavy chemical process industries.',
        imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=800',
        price: 'Price on Request',
        isActive: true,
        sortOrder: 13,
        useCases: ['Acid & Solvent Storage', 'Process Water Reservoirs', 'Resin & Polymer Tanks'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    leads: [
      {
        id: 'lead-101',
        name: 'Rajesh Sharma',
        phone: '+91 9811023456',
        email: 'rajesh@shardachemicals.in',
        companyName: 'Sharda Chemical Works',
        serviceInterested: 'Hot & Cold Thermal Insulation',
        message: 'We require steam pipeline thermal insulation for our 120m steam line at Greater Noida Phase-2 unit. Please provide a quote.',
        city: 'Greater Noida',
        status: 'New',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'lead-102',
        name: 'Vikram Mehta',
        phone: '+91 9873456123',
        email: 'vmehta@mehtapharma.com',
        companyName: 'Mehta Pharma Lab',
        serviceInterested: 'Stainless Steel & Mild Steel Chemical Storage Tanks',
        message: 'Looking for 2 units of 15,000L SS316 jacketed chemical storage vessels with agitators.',
        city: 'Noida',
        status: 'Contacted',
        notes: 'Discussed specifications on call. Sent preliminary quotation.',
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      },
      {
        id: 'lead-103',
        name: 'Anil Agarwal',
        phone: '+91 9958123890',
        email: 'aagarwal@agarwalpolymers.co.in',
        companyName: 'Agarwal Polymers Ltd',
        serviceInterested: 'Band Heater & Ceramic Infrared Heater',
        message: 'Need 25 pieces of high temperature ceramic band heaters for extrusion machinery.',
        city: 'Ghaziabad',
        status: 'Converted',
        notes: 'Purchase order received. Project execution scheduled.',
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'High-Pressure Steam Line Lagging Project',
        category: 'Insulation Services',
        imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
        description: 'Completed 250-meter steam pipeline insulation with aluminum cladding at EcoTech 3, Greater Noida.',
      },
      {
        id: 'gal-2',
        title: '30,000L SS316 Chemical Storage Vessel',
        category: 'Storage Tanks',
        imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=800',
        description: 'Fabrication and hydrostatic commissioning of stainless steel jacketed storage tank.',
      },
      {
        id: 'gal-3',
        title: '35 Meter MS Industrial Chimney Erection',
        category: 'Industrial Chimneys',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
        description: 'Self-supported mild steel stack installation for a textile processing unit.',
      },
      {
        id: 'gal-4',
        title: 'Factory Electrification & HT Panel Assembly',
        category: 'Turnkey Electrical Project Service',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
        description: 'Turnkey installation of 11kV HT switchgear panel and cable tray routing.',
      },
      {
        id: 'gal-5',
        title: 'High Capacity Oil Immersion Heating System',
        category: 'Electric Heaters',
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
        description: 'Flanged immersion heaters installed in thermal fluid circulator loops.',
      },
      {
        id: 'gal-6',
        title: 'Fire Alarm System Control Room Integration',
        category: 'Fire Alarm System Service',
        imageUrl: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800',
        description: 'Addressable smoke detection and main control panel installation in industrial complex.',
      },
    ],
  };
};

export class Database {
  private pool: pg.Pool | null = null;
  private localData: DBData | null = null;
  private isPgConnected = false;

  constructor() {
    this.initPool();
  }

  public getDbStatus() {
    return {
      isPgConnected: this.isPgConnected,
      mode: this.isPgConnected ? 'Neon PostgreSQL' : 'Local File DB (db.json)',
      hasDbUrl: Boolean(DEFAULT_DATABASE_URL),
    };
  }

  private async initPool() {
    const dbUrl = DEFAULT_DATABASE_URL;
    if (dbUrl) {
      try {
        if (dbUrl.includes('neon.tech')) {
          this.pool = new NeonPool({ connectionString: dbUrl }) as unknown as pg.Pool;
        } else {
          this.pool = new Pool({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false },
            max: 10,
            idleTimeoutMillis: 30000,
          });
        }

        // Test connection & initialize schema
        const client = await this.pool.connect();
        try {
          await this.initPgSchema(client);
          this.isPgConnected = true;
          console.log('Successfully connected to Neon PostgreSQL database via WebSocket/HTTP.');
        } finally {
          client.release();
        }
      } catch (err) {
        console.error('Failed to initialize PostgreSQL database, falling back to local storage:', err);
        this.isPgConnected = false;
        this.pool = null;
        this.initFallbackFileDb();
      }
    } else {
      this.isPgConnected = false;
      this.pool = null;
      this.initFallbackFileDb();
    }
  }

  private initFallbackFileDb() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (e) {}
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.localData = JSON.parse(fileContent);
        return;
      } catch (err) {
        console.error('Error reading fallback db.json:', err);
      }
    }
    this.localData = getDefaultData();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.localData, null, 2), 'utf-8');
    } catch (e) {}
  }

  private async initPgSchema(client: pg.PoolClient) {
    // 1. Admin Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL
      );
    `);

    // 2. Settings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY DEFAULT 1,
        company_name VARCHAR(255),
        tagline VARCHAR(255),
        location TEXT,
        address TEXT,
        owner VARCHAR(255),
        phone VARCHAR(100),
        whatsapp VARCHAR(100),
        email VARCHAR(255),
        experience_years INT,
        employee_count VARCHAR(100),
        business_type VARCHAR(255),
        gstin VARCHAR(100)
      );
    `);

    // 3. Services Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        short_description TEXT NOT NULL,
        full_description TEXT NOT NULL,
        image_url TEXT,
        images JSONB DEFAULT '[]',
        price VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 99,
        use_cases JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE services ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
    `);

    // 4. Leads Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        company_name VARCHAR(255),
        service_interested VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        city VARCHAR(255),
        status VARCHAR(50) DEFAULT 'New',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 5. Gallery Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        description TEXT
      );
    `);

    // SEED IF EMPTY
    const defaultData = getDefaultData();

    // Check admin
    const adminRes = await client.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(adminRes.rows[0].count, 10) === 0) {
      await client.query(
        `INSERT INTO admin_users (id, email, username, name, password_hash) VALUES ($1, $2, $3, $4, $5)`,
        [
          defaultData.adminUser.id,
          defaultData.adminUser.email,
          defaultData.adminUser.username,
          defaultData.adminUser.name,
          defaultData.adminUser.passwordHash,
        ]
      );
    }

    // Check settings
    const settingsRes = await client.query('SELECT COUNT(*) FROM site_settings');
    if (parseInt(settingsRes.rows[0].count, 10) === 0) {
      const s = defaultData.settings;
      await client.query(
        `INSERT INTO site_settings (id, company_name, tagline, location, address, owner, phone, whatsapp, email, experience_years, employee_count, business_type, gstin)
         VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [s.companyName, s.tagline, s.location, s.address, s.owner, s.phone, s.whatsapp, s.email, s.experienceYears, s.employeeCount, s.businessType, s.gstin]
      );
    }

    // Check services
    const srvRes = await client.query('SELECT COUNT(*) FROM services');
    if (parseInt(srvRes.rows[0].count, 10) === 0) {
      for (const srv of defaultData.services) {
        await client.query(
          `INSERT INTO services (id, name, category, short_description, full_description, image_url, price, is_active, sort_order, use_cases, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [srv.id, srv.name, srv.category, srv.shortDescription, srv.fullDescription, srv.imageUrl, srv.price, srv.isActive, srv.sortOrder, JSON.stringify(srv.useCases), srv.createdAt, srv.updatedAt]
        );
      }
    }

    // Check leads
    const leadRes = await client.query('SELECT COUNT(*) FROM leads');
    if (parseInt(leadRes.rows[0].count, 10) === 0) {
      for (const lead of defaultData.leads) {
        await client.query(
          `INSERT INTO leads (id, name, phone, email, company_name, service_interested, message, city, status, notes, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [lead.id, lead.name, lead.phone, lead.email, lead.companyName, lead.serviceInterested, lead.message, lead.city, lead.status, lead.notes || null, lead.createdAt]
        );
      }
    }

    // Check gallery
    const galRes = await client.query('SELECT COUNT(*) FROM gallery_items');
    if (parseInt(galRes.rows[0].count, 10) === 0) {
      for (const gal of defaultData.gallery) {
        await client.query(
          `INSERT INTO gallery_items (id, title, category, image_url, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [gal.id, gal.title, gal.category, gal.imageUrl, gal.description]
        );
      }
    }
  }

  // --- ADMIN & AUTH ---
  async getAdminUser(): Promise<AdminUser & { passwordHash: string }> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('SELECT id, email, username, name, password_hash FROM admin_users LIMIT 1');
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            email: row.email,
            username: row.username,
            name: row.name,
            passwordHash: row.password_hash,
          };
        }
      } catch (e) {
        console.error('Error fetching admin user from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }
    if (!this.localData) this.initFallbackFileDb();
    return this.localData!.adminUser;
  }

  async updateAdminPassword(newPasswordHash: string): Promise<void> {
    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query('UPDATE admin_users SET password_hash = $1', [newPasswordHash]);
        return;
      } catch (e) {
        console.error('Error updating admin password in PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }
    if (!this.localData) this.initFallbackFileDb();
    this.localData!.adminUser.passwordHash = newPasswordHash;
    this.saveLocalData();
  }

  // --- SITE SETTINGS ---
  async getSettings(): Promise<SiteSettings> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM site_settings LIMIT 1');
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            companyName: r.company_name,
            tagline: r.tagline,
            location: r.location,
            address: r.address,
            owner: r.owner,
            phone: r.phone,
            whatsapp: r.whatsapp,
            email: r.email,
            experienceYears: Number(r.experience_years),
            employeeCount: r.employee_count,
            businessType: r.business_type,
            gstin: r.gstin,
          };
        }
      } catch (e) {
        console.error('Error fetching settings from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }
    if (!this.localData) this.initFallbackFileDb();
    return this.localData!.settings;
  }

  async updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `UPDATE site_settings SET
            company_name = $1, tagline = $2, location = $3, address = $4,
            owner = $5, phone = $6, whatsapp = $7, email = $8,
            experience_years = $9, employee_count = $10, business_type = $11, gstin = $12
           WHERE id = 1`,
          [
            updated.companyName, updated.tagline, updated.location, updated.address,
            updated.owner, updated.phone, updated.whatsapp, updated.email,
            updated.experienceYears, updated.employeeCount, updated.businessType, updated.gstin
          ]
        );
        return updated;
      } catch (e) {
        console.error('Error updating settings in PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    this.localData!.settings = updated;
    this.saveLocalData();
    return updated;
  }

  // --- SERVICES CRUD ---
  async getAllServices(includeInactive = false): Promise<Service[]> {
    if (this.isPgConnected && this.pool) {
      try {
        const query = includeInactive
          ? 'SELECT * FROM services ORDER BY sort_order ASC'
          : 'SELECT * FROM services WHERE is_active = TRUE ORDER BY sort_order ASC';
        const res = await this.pool.query(query);
        return res.rows.map((r) => ({
          id: r.id,
          name: r.name,
          category: r.category,
          shortDescription: r.short_description,
          fullDescription: r.full_description,
          imageUrl: r.image_url,
          images: Array.isArray(r.images) ? r.images : (typeof r.images === 'string' ? JSON.parse(r.images) : []),
          price: r.price,
          isActive: r.is_active,
          sortOrder: r.sort_order,
          useCases: Array.isArray(r.use_cases) ? r.use_cases : (typeof r.use_cases === 'string' ? JSON.parse(r.use_cases) : []),
          createdAt: new Date(r.created_at).toISOString(),
          updatedAt: new Date(r.updated_at).toISOString(),
        }));
      } catch (e) {
        console.error('Error fetching services from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    if (includeInactive) {
      return [...this.localData!.services].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return this.localData!.services
      .filter((s) => s.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM services WHERE id = $1', [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            name: r.name,
            category: r.category,
            shortDescription: r.short_description,
            fullDescription: r.full_description,
            imageUrl: r.image_url,
            images: Array.isArray(r.images) ? r.images : (typeof r.images === 'string' ? JSON.parse(r.images) : []),
            price: r.price,
            isActive: r.is_active,
            sortOrder: r.sort_order,
            useCases: Array.isArray(r.use_cases) ? r.use_cases : (typeof r.use_cases === 'string' ? JSON.parse(r.use_cases) : []),
            createdAt: new Date(r.created_at).toISOString(),
            updatedAt: new Date(r.updated_at).toISOString(),
          };
        }
      } catch (e) {
        console.error('Error fetching service by id from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    return this.localData!.services.find((s) => s.id === id);
  }

  async createService(serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const newService: Service = {
      ...serviceData,
      images: serviceData.images || [],
      id: `srv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO services (id, name, category, short_description, full_description, image_url, images, price, is_active, sort_order, use_cases, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            newService.id, newService.name, newService.category, newService.shortDescription, newService.fullDescription,
            newService.imageUrl, JSON.stringify(newService.images), newService.price, newService.isActive, newService.sortOrder,
            JSON.stringify(newService.useCases), newService.createdAt, newService.updatedAt
          ]
        );
        return newService;
      } catch (e) {
        console.error('Error creating service in PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    this.localData!.services.push(newService);
    this.saveLocalData();
    return newService;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    const existing = await this.getServiceById(id);
    if (!existing) return undefined;

    const updated: Service = {
      ...existing,
      ...updates,
      images: updates.images ?? existing.images ?? [],
      updatedAt: new Date().toISOString(),
    };

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `UPDATE services SET
            name = $1, category = $2, short_description = $3, full_description = $4,
            image_url = $5, images = $6, price = $7, is_active = $8, sort_order = $9,
            use_cases = $10, updated_at = $11
           WHERE id = $12`,
          [
            updated.name, updated.category, updated.shortDescription, updated.fullDescription,
            updated.imageUrl, JSON.stringify(updated.images), updated.price, updated.isActive, updated.sortOrder,
            JSON.stringify(updated.useCases), updated.updatedAt, id
          ]
        );
        return updated;
      } catch (e) {
        console.error('Error updating service in PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    const index = this.localData!.services.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.localData!.services[index] = updated;
      this.saveLocalData();
    }
    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('DELETE FROM services WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
      } catch (e) {
        console.error('Error deleting service from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    const initialLen = this.localData!.services.length;
    this.localData!.services = this.localData!.services.filter((s) => s.id !== id);
    const success = this.localData!.services.length < initialLen;
    if (success) this.saveLocalData();
    return success;
  }

  // --- LEADS CRUD ---
  async getAllLeads(): Promise<Lead[]> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM leads ORDER BY created_at DESC');
        return res.rows.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email || '',
          companyName: r.company_name || '',
          serviceInterested: r.service_interested,
          message: r.message,
          city: r.city || '',
          status: r.status || 'New',
          notes: r.notes || undefined,
          createdAt: new Date(r.created_at).toISOString(),
        }));
      } catch (e) {
        console.error('Error fetching leads from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    return [...this.localData!.leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM leads WHERE id = $1', [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            name: r.name,
            phone: r.phone,
            email: r.email || '',
            companyName: r.company_name || '',
            serviceInterested: r.service_interested,
            message: r.message,
            city: r.city || '',
            status: r.status || 'New',
            notes: r.notes || undefined,
            createdAt: new Date(r.created_at).toISOString(),
          };
        }
      } catch (e) {
        console.error('Error fetching lead by id from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    return this.localData!.leads.find((l) => l.id === id);
  }

  async createLead(leadData: Omit<Lead, 'id' | 'status' | 'createdAt'>): Promise<Lead> {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO leads (id, name, phone, email, company_name, service_interested, message, city, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            newLead.id, newLead.name, newLead.phone, newLead.email, newLead.companyName,
            newLead.serviceInterested, newLead.message, newLead.city, newLead.status, newLead.createdAt
          ]
        );
        return newLead;
      } catch (e) {
        console.error('Error creating lead in PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    this.localData!.leads.unshift(newLead);
    this.saveLocalData();
    return newLead;
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | undefined> {
    const existing = await this.getLeadById(id);
    if (!existing) return undefined;

    const updated: Lead = {
      ...existing,
      ...updates,
    };

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `UPDATE leads SET
            name = $1, phone = $2, email = $3, company_name = $4,
            service_interested = $5, message = $6, city = $7, status = $8, notes = $9
           WHERE id = $10`,
          [
            updated.name, updated.phone, updated.email, updated.companyName,
            updated.serviceInterested, updated.message, updated.city, updated.status, updated.notes || null, id
          ]
        );
        return updated;
      } catch (e) {
        console.error('Error updating lead in PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    const index = this.localData!.leads.findIndex((l) => l.id === id);
    if (index !== -1) {
      this.localData!.leads[index] = updated;
      this.saveLocalData();
    }
    return updated;
  }

  async deleteLead(id: string): Promise<boolean> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('DELETE FROM leads WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
      } catch (e) {
        console.error('Error deleting lead from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    const initialLen = this.localData!.leads.length;
    this.localData!.leads = this.localData!.leads.filter((l) => l.id !== id);
    const success = this.localData!.leads.length < initialLen;
    if (success) this.saveLocalData();
    return success;
  }

  // --- GALLERY CRUD ---
  async getGalleryItems(): Promise<GalleryItem[]> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM gallery_items');
        return res.rows.map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          imageUrl: r.image_url,
          description: r.description || '',
        }));
      } catch (e) {
        console.error('Error fetching gallery items from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    return this.localData!.gallery;
  }

  async getGalleryItemById(id: string): Promise<GalleryItem | undefined> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM gallery_items WHERE id = $1', [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            title: r.title,
            category: r.category,
            imageUrl: r.image_url,
            description: r.description || '',
          };
        }
      } catch (e) {
        console.error('Error fetching gallery item by id from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    return this.localData!.gallery.find((g) => g.id === id);
  }

  async createGalleryItem(itemData: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
    };

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO gallery_items (id, title, category, image_url, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [newItem.id, newItem.title, newItem.category, newItem.imageUrl, newItem.description]
        );
        return newItem;
      } catch (e) {
        console.error('Error creating gallery item in PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    this.localData!.gallery.unshift(newItem);
    this.saveLocalData();
    return newItem;
  }

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | undefined> {
    const existing = await this.getGalleryItemById(id);
    if (!existing) return undefined;

    const updated: GalleryItem = {
      ...existing,
      ...updates,
    };

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `UPDATE gallery_items SET
            title = $1, category = $2, image_url = $3, description = $4
           WHERE id = $5`,
          [updated.title, updated.category, updated.imageUrl, updated.description, id]
        );
        return updated;
      } catch (e) {
        console.error('Error updating gallery item in PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    const index = this.localData!.gallery.findIndex((g) => g.id === id);
    if (index !== -1) {
      this.localData!.gallery[index] = updated;
      this.saveLocalData();
    }
    return updated;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query('DELETE FROM gallery_items WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
      } catch (e) {
        console.error('Error deleting gallery item from PG, switching to local DB:', e);
        this.isPgConnected = false;
        this.pool = null;
      }
    }

    if (!this.localData) this.initFallbackFileDb();
    const initialLen = this.localData!.gallery.length;
    this.localData!.gallery = this.localData!.gallery.filter((g) => g.id !== id);
    const success = this.localData!.gallery.length < initialLen;
    if (success) this.saveLocalData();
    return success;
  }

  private saveLocalData() {
    if (this.localData) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(this.localData, null, 2), 'utf-8');
      } catch (err) {
        console.error('Error writing fallback db.json:', err);
      }
    }
  }
}

export const db = new Database();
