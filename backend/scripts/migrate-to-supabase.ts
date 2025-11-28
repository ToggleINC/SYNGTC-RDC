/**
 * Script de migration des données vers Supabase
 * 
 * Ce script exporte les données de votre base PostgreSQL locale
 * et les importe dans Supabase.
 * 
 * Usage:
 *   ts-node scripts/migrate-to-supabase.ts
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

// Interface pour les questions interactives
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

// Configuration de la base locale (optionnelle)
let localPool: Pool | null = null;
const hasLocalDB = process.env.LOCAL_DB_HOST && process.env.LOCAL_DB_PASSWORD;

if (hasLocalDB) {
  localPool = new Pool({
    host: process.env.LOCAL_DB_HOST || 'localhost',
    port: parseInt(process.env.LOCAL_DB_PORT || '5432'),
    database: process.env.LOCAL_DB_NAME || 'syngtc_rdc',
    user: process.env.LOCAL_DB_USER || 'postgres',
    password: String(process.env.LOCAL_DB_PASSWORD || ''),
  });
}

// Configuration Supabase (sera demandée interactivement)
let supabasePool: Pool | null = null;

interface MigrationStats {
  users: number;
  criminals: number;
  cases: number;
  alerts: number;
  actionLogs: number;
}

/**
 * Teste la connexion à une base de données
 */
async function testConnection(pool: Pool, name: string): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    console.log(`✅ Connexion à ${name} réussie`);
    return true;
  } catch (error: any) {
    console.error(`❌ Erreur de connexion à ${name}:`, error.message);
    return false;
  }
}

/**
 * Exporte les données d'une table
 */
async function exportTable(pool: Pool, tableName: string): Promise<any[]> {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at`);
    console.log(`  ✓ ${tableName}: ${result.rows.length} enregistrements`);
    return result.rows;
  } catch (error: any) {
    console.error(`  ✗ Erreur lors de l'export de ${tableName}:`, error.message);
    return [];
  }
}

/**
 * Importe les données dans Supabase
 */
async function importTable(
  pool: Pool,
  tableName: string,
  data: any[],
  skipColumns: string[] = []
): Promise<number> {
  if (data.length === 0) {
    return 0;
  }

  try {
    // Obtenir les colonnes de la table
    const columnsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position
    `, [tableName]);

    const columns = columnsResult.rows
      .map((row) => row.column_name)
      .filter((col) => !skipColumns.includes(col));

    if (columns.length === 0) {
      console.log(`  ⚠ Aucune colonne trouvée pour ${tableName}`);
      return 0;
    }

    let imported = 0;

    for (const row of data) {
      try {
        // Filtrer les colonnes qui existent dans les données
        const validColumns = columns.filter((col) => row[col] !== undefined);
        const values = validColumns.map((col) => row[col]);
        const placeholders = validColumns.map((_, i) => `$${i + 1}`).join(', ');

        // Construire la requête INSERT avec ON CONFLICT DO NOTHING
        const query = `
          INSERT INTO ${tableName} (${validColumns.join(', ')})
          VALUES (${placeholders})
          ON CONFLICT DO NOTHING
        `;

        await pool.query(query, values);
        imported++;
      } catch (error: any) {
        // Ignorer les erreurs de contrainte unique (doublons)
        if (!error.message.includes('duplicate key') && !error.message.includes('unique constraint')) {
          console.error(`    ⚠ Erreur lors de l'import d'un enregistrement:`, error.message);
        }
      }
    }

    console.log(`  ✓ ${tableName}: ${imported}/${data.length} importés`);
    return imported;
  } catch (error: any) {
    console.error(`  ✗ Erreur lors de l'import de ${tableName}:`, error.message);
    return 0;
  }
}

/**
 * Fonction principale de migration
 */
async function migrate() {
  console.log('\n🚀 Script de migration vers Supabase\n');
  console.log('=' .repeat(50));

  // 1. Demander les informations Supabase
  console.log('\n📋 Configuration Supabase\n');
  const supabaseHost = await question('Host Supabase (ex: db.xxxxx.supabase.co): ');
  const supabasePort = await question('Port (défaut: 5432): ') || '5432';
  const supabaseDatabase = await question('Database (défaut: postgres): ') || 'postgres';
  const supabaseUser = await question('User (défaut: postgres): ') || 'postgres';
  const supabasePassword = await question('Password: ');

  if (!supabaseHost || !supabasePassword) {
    console.error('❌ Host et Password sont requis');
    process.exit(1);
  }

  // 2. Créer la connexion Supabase
  supabasePool = new Pool({
    host: supabaseHost.trim(),
    port: parseInt(supabasePort),
    database: supabaseDatabase.trim(),
    user: supabaseUser.trim(),
    password: String(supabasePassword).trim(),
    ssl: {
      rejectUnauthorized: false, // Nécessaire pour Supabase
    },
    connectionTimeoutMillis: 10000, // Timeout de 10 secondes
  });

  // 3. Tester les connexions
  console.log('\n🔌 Test des connexions\n');
  
  let localConnected = true;
  if (localPool) {
    localConnected = await testConnection(localPool, 'Base locale');
  } else {
    console.log('ℹ️  Base locale non configurée (LOCAL_DB_HOST et LOCAL_DB_PASSWORD non définis)');
    console.log('   Le script va uniquement tester la connexion Supabase.\n');
  }
  
  const supabaseConnected = await testConnection(supabasePool, 'Supabase');

  if (!supabaseConnected) {
    console.error('\n❌ Impossible de se connecter à Supabase');
    console.error('   Vérifiez que le Host est correct et que votre connexion internet fonctionne.');
    process.exit(1);
  }

  if (localPool && !localConnected) {
    console.error('\n⚠️  Impossible de se connecter à la base locale');
    console.error('   Le script va uniquement tester la connexion Supabase.');
    const continueWithoutLocal = await question('\nContinuer sans base locale ? (oui/non): ');
    if (continueWithoutLocal.toLowerCase() !== 'oui' && continueWithoutLocal.toLowerCase() !== 'o') {
      console.log('❌ Migration annulée');
      process.exit(0);
    }
    localPool = null; // Désactiver la base locale
  }

  // 4. Export des données (si base locale disponible)
  let users: any[] = [];
  let criminals: any[] = [];
  let cases: any[] = [];
  let alerts: any[] = [];
  let actionLogs: any[] = [];

  if (localPool) {
    console.log('\n📤 Export des données depuis la base locale\n');
    console.log('-'.repeat(50));

    users = await exportTable(localPool, 'users');
    criminals = await exportTable(localPool, 'criminals');
    cases = await exportTable(localPool, 'cases');
    alerts = await exportTable(localPool, 'alerts');
    actionLogs = await exportTable(localPool, 'action_logs');
  } else {
    console.log('\n📤 Aucune base locale configurée - Pas d\'export de données\n');
  }

  // 5. Confirmation
  if (localPool && (users.length > 0 || criminals.length > 0 || cases.length > 0)) {
    console.log('\n⚠️  ATTENTION: Cette opération va importer les données dans Supabase.');
    console.log('   Les doublons seront ignorés (ON CONFLICT DO NOTHING).\n');
    const confirm = await question('Continuer ? (oui/non): ');

    if (confirm.toLowerCase() !== 'oui' && confirm.toLowerCase() !== 'o') {
      console.log('❌ Migration annulée');
      process.exit(0);
    }
  } else {
    console.log('\nℹ️  Aucune donnée à migrer depuis la base locale.');
    console.log('   Le script va uniquement tester la connexion Supabase.\n');
  }

  if (localPool) {
    const stats: MigrationStats = {
      users: users.length,
      criminals: criminals.length,
      cases: cases.length,
      alerts: alerts.length,
      actionLogs: actionLogs.length,
    };

    console.log('\n📊 Résumé de l\'export:');
    console.log(`   - Users: ${stats.users}`);
    console.log(`   - Criminals: ${stats.criminals}`);
    console.log(`   - Cases: ${stats.cases}`);
    console.log(`   - Alerts: ${stats.alerts}`);
    console.log(`   - Action Logs: ${stats.actionLogs}`);
  }

  // 6. Import dans Supabase
  if (users.length > 0 || criminals.length > 0 || cases.length > 0) {
    console.log('\n📥 Import des données dans Supabase\n');
    console.log('-'.repeat(50));

    // Import dans l'ordre des dépendances
    await importTable(supabasePool, 'users', users, ['id']); // Garder les IDs existants
    await importTable(supabasePool, 'criminals', criminals);
    await importTable(supabasePool, 'cases', cases);
    await importTable(supabasePool, 'alerts', alerts);
    await importTable(supabasePool, 'action_logs', actionLogs);
  } else {
    console.log('\n✅ Connexion Supabase réussie !');
    console.log('   Aucune donnée à importer.\n');
  }

  // 7. Vérification finale
  console.log('\n✅ Migration terminée !\n');
  console.log('📊 Vérification dans Supabase:');

  const verifyUsers = await supabasePool.query('SELECT COUNT(*) FROM users');
  const verifyCriminals = await supabasePool.query('SELECT COUNT(*) FROM criminals');
  const verifyCases = await supabasePool.query('SELECT COUNT(*) FROM cases');

  console.log(`   - Users: ${verifyUsers.rows[0].count}`);
  console.log(`   - Criminals: ${verifyCriminals.rows[0].count}`);
  console.log(`   - Cases: ${verifyCases.rows[0].count}`);

  console.log('\n✨ Migration réussie !\n');

  // Fermer les connexions
  if (localPool) {
    await localPool.end();
  }
  await supabasePool.end();
  rl.close();
}

// Exécuter la migration
migrate().catch((error) => {
  console.error('\n❌ Erreur lors de la migration:', error);
  process.exit(1);
});

