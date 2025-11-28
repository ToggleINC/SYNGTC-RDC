/**
 * Script de test de connexion Supabase
 * 
 * Usage: node scripts/test-supabase-connection.js
 */

const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_HOST?.includes('supabase.co') ? {
    rejectUnauthorized: false,
  } : undefined,
  connectionTimeoutMillis: 10000,
});

console.log('\n🔍 Test de connexion Supabase\n');
console.log('='.repeat(50));
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT || '5432'}`);
console.log(`Database: ${process.env.DB_NAME || 'postgres'}`);
console.log(`User: ${process.env.DB_USER || 'postgres'}`);
console.log('='.repeat(50));
console.log('\n⏳ Tentative de connexion...\n');

pool.query('SELECT 1 as test, NOW() as timestamp')
  .then((result) => {
    console.log('✅ Connexion réussie !');
    console.log(`   Test: ${result.rows[0].test}`);
    console.log(`   Timestamp: ${result.rows[0].timestamp}`);
    console.log('\n✨ Supabase est accessible depuis votre machine.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n🔍 Diagnostic:');
      console.error('   Le DNS ne peut pas résoudre le nom d\'hôte.');
      console.error('   Causes possibles:');
      console.error('   1. Problème de connexion internet');
      console.error('   2. Problème DNS (essayez de changer votre DNS)');
      console.error('   3. Firewall/Antivirus bloque la connexion');
      console.error('   4. Proxy d\'entreprise bloque Supabase');
      console.error('\n💡 Solutions:');
      console.error('   - Vérifiez votre connexion internet');
      console.error('   - Changez votre DNS (8.8.8.8 pour Google DNS)');
      console.error('   - Désactivez temporairement le firewall');
      console.error('   - Vérifiez que le host est correct:', process.env.DB_HOST);
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n🔍 Diagnostic:');
      console.error('   Timeout de connexion.');
      console.error('   Le serveur Supabase ne répond pas.');
      console.error('   Vérifiez que le projet est actif dans Supabase.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n🔍 Diagnostic:');
      console.error('   Connexion refusée.');
      console.error('   Vérifiez le port et que le serveur est accessible.');
    }
    
    console.error('\n');
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });

