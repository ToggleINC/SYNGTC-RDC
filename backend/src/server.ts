import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { testSupabaseConnection } from './config/supabase';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import criminalRoutes from './routes/criminals';
import caseRoutes from './routes/cases';
import locationRoutes from './routes/locations';
import alertRoutes from './routes/alerts';
import dashboardRoutes from './routes/dashboard';
import fileRoutes from './routes/files';
import userRoutes from './routes/users';
import backupRoutes from './routes/backup';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// Socket.io pour les alertes en temps réel
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  
  socket.on('subscribe-alerts', (userId) => {
    socket.join(`alerts-${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// Exporter io pour utilisation dans les routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/criminals', criminalRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/backup', backupRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    const isConnected = await testSupabaseConnection();
    res.json({ 
      status: 'OK', 
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected' 
    });
  }
});

// Error handler
app.use(errorHandler);

// Démarrage du serveur
httpServer.listen(PORT, async () => {
  console.log(`🚀 Serveur SYNGTC-RDC démarré sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  
  // Tester la connexion Supabase
  await testSupabaseConnection();
  
  // Démarrer le scheduler de backup après le démarrage du serveur
  try {
    const { backupScheduler } = await import('./services/backupScheduler');
    backupScheduler.start();
  } catch (error) {
    console.error('⚠️ Erreur lors du démarrage du scheduler de backup:', error);
  }
});

export { io };

