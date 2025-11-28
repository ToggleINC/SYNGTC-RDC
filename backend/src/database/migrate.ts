import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

export async function runMigrations() {
  try {
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    console.log('✅ Migrations exécutées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error);
    throw error;
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

