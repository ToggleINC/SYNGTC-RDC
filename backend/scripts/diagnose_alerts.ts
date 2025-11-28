import dotenv from 'dotenv';
import path from 'path';

// Charger le .env depuis le dossier backend
dotenv.config({ path: path.join(__dirname, '../.env') });

import { supabase } from '../src/config/supabase';

async function diagnose() {
    console.log('🔍 Starting Alerts Table Diagnosis...');

    // 1. Check if we can read from the table
    console.log('1. Testing READ access...');
    const { data: readData, error: readError } = await supabase
        .from('alerts')
        .select('*')
        .limit(1);

    if (readError) {
        console.error('❌ READ Failed:', readError);
    } else {
        console.log('✅ READ Successful. Rows found:', readData?.length);
    }

    // 2. Check table structure by trying to insert a minimal record
    console.log('\n2. Testing WRITE access (minimal record)...');
    const testAlert = {
        type: 'other',
        titre: 'Test Alert',
        description: 'This is a diagnostic test alert',
        priorite: 'faible',
        created_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
        .from('alerts')
        .insert(testAlert)
        .select()
        .single();

    if (insertError) {
        console.error('❌ WRITE Failed:', insertError);
        console.error('   Possible causes: Missing columns, constraint violations, or table does not exist.');
    } else {
        console.log('✅ WRITE Successful. Created Alert ID:', insertData.id);

        // Clean up
        console.log('\n3. Cleaning up test record...');
        const { error: deleteError } = await supabase
            .from('alerts')
            .delete()
            .eq('id', insertData.id);

        if (deleteError) {
            console.error('❌ Cleanup Failed:', deleteError);
        } else {
            console.log('✅ Cleanup Successful');
        }
    }
}

diagnose().catch(console.error);
