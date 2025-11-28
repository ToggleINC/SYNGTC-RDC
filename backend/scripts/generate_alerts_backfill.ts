import dotenv from 'dotenv';
import path from 'path';

// Charger le .env depuis le dossier backend
dotenv.config({ path: path.join(__dirname, '../.env') });

import { supabase } from '../src/config/supabase';

async function generateAlertsForExistingCriminals() {
    console.log('🔍 Recherche des criminels dangereux existants...');

    // Récupérer tous les criminels avec niveau de dangerosité élevé ou score >= 80
    const { data: criminals, error: fetchError } = await supabase
        .from('criminals')
        .select('*')
        .or('niveau_dangerosite.eq.eleve,danger_score.gte.80');

    if (fetchError) {
        console.error('❌ Erreur lors de la récupération des criminels:', fetchError);
        return;
    }

    if (!criminals || criminals.length === 0) {
        console.log('ℹ️  Aucun criminel dangereux trouvé');
        return;
    }

    console.log(`📊 ${criminals.length} criminel(s) dangereux trouvé(s)`);

    let created = 0;
    let skipped = 0;

    for (const criminal of criminals) {
        // Vérifier si une alerte existe déjà pour ce criminel
        const { data: existingAlert } = await supabase
            .from('alerts')
            .select('id')
            .eq('type', 'dangerous_criminal')
            .eq('criminal_id', criminal.id)
            .single();

        if (existingAlert) {
            console.log(`⏭️  Alerte déjà existante pour ${criminal.nom} ${criminal.prenom}`);
            skipped++;
            continue;
        }

        // Créer l'alerte
        const { error: insertError } = await supabase
            .from('alerts')
            .insert({
                type: 'dangerous_criminal',
                titre: 'Nouveau criminel dangereux',
                description: `Un criminel dangereux (${criminal.nom} ${criminal.prenom}) a été enregistré avec un score de ${criminal.danger_score}`,
                priorite: 'elevee',
                criminal_id: criminal.id,
                created_at: criminal.created_at || new Date().toISOString(),
            });

        if (insertError) {
            console.error(`❌ Erreur création alerte pour ${criminal.nom} ${criminal.prenom}:`, insertError);
        } else {
            console.log(`✅ Alerte créée pour ${criminal.nom} ${criminal.prenom} (score: ${criminal.danger_score})`);
            created++;
        }
    }

    console.log(`\n📈 Résumé: ${created} alerte(s) créée(s), ${skipped} ignorée(s)`);
}

generateAlertsForExistingCriminals().catch(console.error);
