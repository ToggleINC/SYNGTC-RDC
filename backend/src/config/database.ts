import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuration SSL pour Supabase
const isSupabase = process.env.DB_HOST?.includes('supabase.co');

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'syngtc_rdc',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // Augmenté pour Supabase
  // SSL obligatoire pour Supabase
  ...(isSupabase ? {
    ssl: {
      rejectUnauthorized: false,
    },
    // Forcer IPv4 si nécessaire (décommentez si problème IPv6)
    // family: 4,
  } : {}),
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connexion à la base de données établie');
});

pool.on('error', (err: Error) => {
  console.error('❌ Erreur de connexion à la base de données:', err);
  if (err.message.includes('ENOTFOUND')) {
    console.error('⚠️  Le host Supabase ne peut pas être résolu.');
    console.error('   Vérifiez que :');
    console.error('   1. Le projet Supabase est actif (pas en pause)');
    console.error('   2. Votre connexion internet fonctionne');
    console.error('   3. Le host dans .env est correct :', process.env.DB_HOST);
  }
});

export default pool;

