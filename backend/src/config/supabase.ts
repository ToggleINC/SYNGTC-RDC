/**
 * Configuration Supabase via API REST
 * 
 * Ce fichier remplace la connexion PostgreSQL directe
 * car le projet Supabase est en mode "Local-Only Database"
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables Supabase manquantes dans .env:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  console.error('\n📝 Ajoutez ces variables dans backend/.env');
  console.error('   Vous les trouverez dans Supabase → Settings → API');
}

// Client Supabase avec service_role key (accès complet)
export const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Test de connexion
export async function testSupabaseConnection(): Promise<boolean> {
  // Vérifier d'abord que les variables sont définies
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variables Supabase manquantes dans backend/.env');
    console.error('   Ajoutez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
    console.error('   Vous les trouverez dans Supabase → Settings → API');
    return false;
  }

  try {
    // Test simple : compter les utilisateurs
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error.message);
      console.error('   Code:', error.code);
      console.error('   Vérifiez que SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont corrects dans backend/.env');
      return false;
    }
    
    console.log('✅ Connexion Supabase API REST réussie');
    return true;
  } catch (error: any) {
    console.error('❌ Erreur lors du test Supabase:', error.message);
    return false;
  }
}

export default supabase;

