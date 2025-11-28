/**
 * Script de migration des données vers Supabase (Version JavaScript)
 * 
 * Usage:
 *   node scripts/migrate-to-supabase.js
 */

const { Pool } = require('pg');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

// Configuration de la base locale
const localPool = new Pool({
  host: process.env.LOCAL_DB_HOST || 'localhost',
  port: parseInt(process.env.LOCAL_DB_PORT || '5432'),
  database: process.env.LOCAL_DB_NAME || 'syngtc_rdc',
  user: process.env.LOCAL_DB_USER || 'postgres',
  password: process.env.LOCAL_DB_PASSWORD || '',
});

let supabasePool = null;

async function testConnection(pool, name) {
  try {
    await pool.query('SELECT 1');
    console.log(`✅ Connexion à ${name} réussie`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur de connexion à ${name}:`, error.message);
    return false;
  }
}

async function exportTable(pool, tableName) {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at`);
    console.log(`  ✓ ${tableName}: ${result.rows.length} enregistrements`);
    return result.rows;
  } catch (error) {
    console.error(`  ✗ Erreur lors de l'export de ${tableName}:`, error.message);
    return [];
  }
}

async function importTable(pool, tableName, data, skipColumns = []) {
  if (data.length === 0) {
    return 0;
  }

  try {
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
        const validColumns = columns.filter((col) => row[col] !== undefined);
        const values = validColumns.map((col) => row[col]);
        const placeholders = validColumns.map((_, i) => `$${i + 1}`).join(', ');

        const query = `
          INSERT INTO ${tableName} (${validColumns.join(', ')})
          VALUES (${placeholders})
          ON CONFLICT DO NOTHING
        `;

        await pool.query(query, values);
        imported++;
      } catch (error) {
        if (!error.message.includes('duplicate key') && !error.message.includes('unique constraint')) {
          console.error(`    ⚠ Erreur lors de l'import d'un enregistrement:`, error.message);
        }
      }
    }

    console.log(`  ✓ ${tableName}: ${imported}/${data.length} importés`);
    return imported;
  } catch (error) {
    console.error(`  ✗ Erreur lors de l'import de ${tableName}:`, error.message);
    return 0;
  }
}

async function migrate() {
  console.log('\n🚀 Script de migration vers Supabase\n');
  console.log('='.repeat(50));

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

  supabasePool = new Pool({
    host: supabaseHost,
    port: parseInt(supabasePort),
    database: supabaseDatabase,
    user: supabaseUser,
    password: supabasePassword,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  console.log('\n🔌 Test des connexions\n');
  const localConnected = await testConnection(localPool, 'Base locale');
  const supabaseConnected = await testConnection(supabasePool, 'Supabase');

  if (!localConnected || !supabaseConnected) {
    console.error('\n❌ Impossible de se connecter aux bases de données');
    process.exit(1);
  }

  console.log('\n⚠️  ATTENTION: Cette opération va importer les données dans Supabase.');
  console.log('   Les doublons seront ignorés (ON CONFLICT DO NOTHING).\n');
  const confirm = await question('Continuer ? (oui/non): ');

  if (confirm.toLowerCase() !== 'oui' && confirm.toLowerCase() !== 'o') {
    console.log('❌ Migration annulée');
    process.exit(0);
  }

  console.log('\n📤 Export des données depuis la base locale\n');
  console.log('-'.repeat(50));

  const users = await exportTable(localPool, 'users');
  const criminals = await exportTable(localPool, 'criminals');
  const cases = await exportTable(localPool, 'cases');
  const alerts = await exportTable(localPool, 'alerts');
  const actionLogs = await exportTable(localPool, 'action_logs');

  console.log('\n📊 Résumé de l\'export:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Criminals: ${criminals.length}`);
  console.log(`   - Cases: ${cases.length}`);
  console.log(`   - Alerts: ${alerts.length}`);
  console.log(`   - Action Logs: ${actionLogs.length}`);

  console.log('\n📥 Import des données dans Supabase\n');
  console.log('-'.repeat(50));

  await importTable(supabasePool, 'users', users, ['id']);
  await importTable(supabasePool, 'criminals', criminals);
  await importTable(supabasePool, 'cases', cases);
  await importTable(supabasePool, 'alerts', alerts);
  await importTable(supabasePool, 'action_logs', actionLogs);

  console.log('\n✅ Migration terminée !\n');
  console.log('📊 Vérification dans Supabase:');

  const verifyUsers = await supabasePool.query('SELECT COUNT(*) FROM users');
  const verifyCriminals = await supabasePool.query('SELECT COUNT(*) FROM criminals');
  const verifyCases = await supabasePool.query('SELECT COUNT(*) FROM cases');

  console.log(`   - Users: ${verifyUsers.rows[0].count}`);
  console.log(`   - Criminals: ${verifyCriminals.rows[0].count}`);
  console.log(`   - Cases: ${verifyCases.rows[0].count}`);

  console.log('\n✨ Migration réussie !\n');

  await localPool.end();
  await supabasePool.end();
  rl.close();
}

migrate().catch((error) => {
  console.error('\n❌ Erreur lors de la migration:', error);
  process.exit(1);
});

