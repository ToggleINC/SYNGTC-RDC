/**
 * Configuration Supabase typée (API REST)
 * 
 * ⚠ IMPORTANT :
 * Ce fichier nécessite que les types générés par Supabase
 * soient présents dans : src/types/supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase'; // <-- IMPORT DES TYPES
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables Supabase manquantes dans backend/.env :');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  console.error('\n📝 Ajoutez ces variables dans backend/.env');
  process.exit(1);
}

/**
 * 🔥 Client Supabase typé + service_role
 */
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * 🔍 Test de connexion simple
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .select('*', { head: true });

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return false;
    }

    console.log('✅ Connexion Supabase OK.');
    return true;
  } catch (err: any) {
    console.error('❌ Erreur test Supabase:', err.message);
    return false;
  }
}

export default supabase;
