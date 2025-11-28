// Fichier pour Vercel Serverless Functions
// Note: Ce fichier est une alternative pour Vercel, mais Railway/Render est recommandé pour le backend
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

// Import des routes
import authRoutes from '../src/routes/auth';
import criminalsRoutes from '../src/routes/criminals';
import casesRoutes from '../src/routes/cases';
import locationsRoutes from '../src/routes/locations';
import alertsRoutes from '../src/routes/alerts';
import dashboardRoutes from '../src/routes/dashboard';
import filesRoutes from '../src/routes/files';
import usersRoutes from '../src/routes/users';
import backupRoutes from '../src/routes/backup';
import { errorHandler } from '../src/middleware/errorHandler';
import { pool } from '../src/config/database';

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/criminals', criminalsRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/backup', backupRoutes);

// Route de santé
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected' 
    });
  }
});

// Gestion des erreurs
app.use(errorHandler);

// Export pour Vercel
export default app;

