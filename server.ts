import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './server/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'abn-thermocare-secret-key-2026';

export const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth Middleware
interface AuthRequest extends Request {
  user?: { id: string; email: string; username: string };
}

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; username: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

// API ROUTES

// 1. Health & Database Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: db.getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/db-status', (req, res) => {
  res.json(db.getDbStatus());
});

// 2. Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    const admin = await db.getAdminUser();
    const isEmailMatch = admin.email.toLowerCase() === usernameOrEmail.toLowerCase();
    const isUserMatch = admin.username.toLowerCase() === usernameOrEmail.toLowerCase();

    if ((!isEmailMatch && !isUserMatch) || !bcrypt.compareSync(password, admin.passwordHash)) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, username: admin.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userWithoutPassword } = admin;
    return res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: 'Server authentication error' });
  }
});

app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const admin = await db.getAdminUser();
    const { passwordHash, ...userWithoutPassword } = admin;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/auth/change-password', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const admin = await db.getAdminUser();
    if (!bcrypt.compareSync(currentPassword, admin.passwordHash)) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    await db.updateAdminPassword(newHash);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// 3. Settings Routes
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// 4. Services Routes
app.get('/api/services', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let isAuthenticated = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        isAuthenticated = true;
      } catch (e) {
        // Token invalid, keep as public
      }
    }

    const includeInactive = isAuthenticated && req.query.includeInactive === 'true';
    const services = await db.getAllServices(includeInactive);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const service = await db.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

app.post('/api/services', requireAuth, async (req, res) => {
  try {
    const { name, category, shortDescription, fullDescription, imageUrl, price, isActive, sortOrder, useCases } = req.body;
    if (!name || !category || !shortDescription || !fullDescription) {
      return res.status(400).json({ error: 'Name, category, short description, and full description are required' });
    }

    const newService = await db.createService({
      name,
      category,
      shortDescription,
      fullDescription,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      price: price || 'Price on Request',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      sortOrder: Number(sortOrder) || 99,
      useCases: Array.isArray(useCases) ? useCases : [],
    });

    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/services/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.patch('/api/services/:id/toggle', requireAuth, async (req, res) => {
  try {
    const service = await db.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const updated = await db.updateService(req.params.id, { isActive: !service.isActive });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle service status' });
  }
});

app.delete('/api/services/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db.deleteService(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// 5. Leads Routes
app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, email, companyName, serviceInterested, message, city, honeypot } = req.body;

    // Anti-spam honeypot check
    if (honeypot) {
      return res.status(200).json({ message: 'Lead submitted successfully' });
    }

    if (!name || !phone || !serviceInterested || !message) {
      return res.status(400).json({ error: 'Name, phone number, service interested, and message are required.' });
    }

    const newLead = await db.createLead({
      name,
      phone,
      email: email || '',
      companyName: companyName || '',
      serviceInterested,
      message,
      city: city || 'Greater Noida',
    });

    res.status(201).json({ message: 'Lead submitted successfully', lead: newLead });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit lead' });
  }
});

app.get('/api/leads', requireAuth, async (req, res) => {
  try {
    const leads = await db.getAllLeads();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.put('/api/leads/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateLead(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Lead not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

app.delete('/api/leads/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db.deleteLead(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

app.get('/api/leads/export/csv', requireAuth, async (req, res) => {
  try {
    const leads = await db.getAllLeads();
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Company', 'City', 'Service Interested', 'Status', 'Message'];
    
    const csvRows = [headers.join(',')];

    leads.forEach((l) => {
      const row = [
        `"${l.id}"`,
        `"${new Date(l.createdAt).toLocaleString()}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.companyName || '').replace(/"/g, '""')}"`,
        `"${(l.city || '').replace(/"/g, '""')}"`,
        `"${(l.serviceInterested || '').replace(/"/g, '""')}"`,
        `"${l.status}"`,
        `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      ];
      csvRows.push(row.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="ABN_Thermocare_Leads_${Date.now()}.csv"`);
    res.status(200).send(csvRows.join('\n'));
  } catch (err) {
    res.status(500).send('Failed to generate CSV export');
  }
});

// 6. Gallery Routes
app.get('/api/gallery', async (req, res) => {
  try {
    const items = await db.getGalleryItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

app.post('/api/gallery', requireAuth, async (req, res) => {
  try {
    const { title, category, imageUrl, description } = req.body;
    if (!title || !category || !imageUrl) {
      return res.status(400).json({ error: 'Title, category, and image URL are required.' });
    }

    const newItem = await db.createGalleryItem({
      title,
      category,
      imageUrl,
      description: description || '',
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

app.put('/api/gallery/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateGalleryItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Gallery item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

app.delete('/api/gallery/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db.deleteGalleryItem(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// START SERVER WITH VITE MIDDLEWARE
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
