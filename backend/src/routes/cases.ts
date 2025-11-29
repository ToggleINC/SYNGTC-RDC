import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { supabase } from '../config/supabase';
import { authenticate, AuthRequest } from '../middleware/auth';

// Fonction helper pour parser JSON de manière sécurisée
function safeJsonParse(value: any, defaultValue: any = []): any {
  if (!value) return defaultValue;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      if (value.includes(',')) {
        return value.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      return [value];
    } catch {
      if (value.includes(',')) {
        return value.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      return [value];
    }
  }
  return defaultValue;
}

const router = express.Router();

router.use(authenticate);

// Enregistrer un nouveau cas
router.post(
  '/',
  [
    body('criminal_id').notEmpty().isUUID(),
    body('date_arrestation').isISO8601(),
    body('lieu_arrestation').notEmpty().trim(),
    body('type_infraction').isArray().notEmpty(),
    body('latitude').optional().isFloat(),
    body('longitude').optional().isFloat(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        criminal_id,
        date_arrestation,
        lieu_arrestation,
        type_infraction,
        description,
        temoins,
        preuves,
        latitude,
        longitude,
        poste_police,
        agent_arrestant,
        statut_judiciaire,
        parquet_id,
      } = req.body;

      // Générer un numéro de cas unique (format plus court)
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substr(2, 6).toUpperCase();
      const numeroCas = `CAS-${timestamp}-${random}`;

      // Note: Supabase gère automatiquement la conversion en JSONB pour les tableaux/objets
      const { data: caseData, error: insertError } = await supabase
        .from('cases')
        .insert({
          numero_cas: numeroCas,
          criminal_id,
          date_arrestation,
          lieu_arrestation,
          type_infraction: type_infraction, // Supabase convertit automatiquement en JSONB
          description: description || null,
          temoins: temoins || [], // Supabase convertit automatiquement en JSONB
          preuves: preuves || [], // Supabase convertit automatiquement en JSONB
          latitude: latitude || null,
          longitude: longitude || null,
          poste_police: poste_police || req.user!.poste,
          agent_arrestant: agent_arrestant || `${req.user!.email}`,
          statut_judiciaire: statut_judiciaire || 'enquete',
          parquet_id: parquet_id || null,
          created_by: req.user!.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError || !caseData) {
        console.error('Erreur création cas:', insertError);
        return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du cas' });
      }

      // Mettre à jour le statut du criminel si c'est une récidive
      const { count: casesCount } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('criminal_id', criminal_id);

      const isRecidivist = (casesCount || 0) > 1;

      await supabase
        .from('action_logs')
        .insert({
          user_id: String(req.user!.id),
          action_type: 'CREATE',
          entity_type: 'case',
          entity_id: String(caseData.id),
          details: { numero_cas: numeroCas }, // Supabase convertit automatiquement en JSONB
          created_at: new Date().toISOString(),
        });

      res.status(201).json({
        message: 'Cas enregistré avec succès',
        case: {
          ...caseData,
          type_infraction: safeJsonParse(caseData.type_infraction, []),
          temoins: safeJsonParse(caseData.temoins, []),
          preuves: safeJsonParse(caseData.preuves, []),
        },
      });
    } catch (error: any) {
      console.error('Erreur enregistrement cas:', error);
      res.status(500).json({ error: 'Erreur lors de l\'enregistrement du cas' });
    }
  }
);

// Obtenir tous les cas avec filtres
router.get('/', async (req: AuthRequest, res) => {
  try {
    const {
      criminal_id,
      statut_judiciaire,
      poste_police,
      date_debut,
      date_fin,
      page = 1,
      limit = 20,
    } = req.query;

    let query = supabase
      .from('cases')
      .select(`
        *,
        criminals!cases_criminal_id_fkey(nom, prenom, numero_criminel),
        users!cases_created_by_fkey(nom)
      `, { count: 'exact' });

    if (criminal_id) {
      query = query.eq('criminal_id', criminal_id as string);
    }

    if (statut_judiciaire) {
      query = query.eq('statut_judiciaire', statut_judiciaire as string);
    }

    if (poste_police) {
      query = query.ilike('poste_police', `%${poste_police}%`);
    }

    if (date_debut) {
      query = query.gte('date_arrestation', date_debut as string);
    }

    if (date_fin) {
      query = query.lte('date_arrestation', date_fin as string);
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { data: casesData, error } = await query
      .order('date_arrestation', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      throw error;
    }

    const cases = (casesData || []).map((c: any) => ({
      ...c,
      criminal_nom: c.criminals?.nom || null,
      criminal_prenom: c.criminals?.prenom || null,
      numero_criminel: c.criminals?.numero_criminel || null,
      created_by_nom: c.users?.nom || null,
      type_infraction: safeJsonParse(c.type_infraction, []),
      temoins: safeJsonParse(c.temoins, []),
      preuves: safeJsonParse(c.preuves, []),
    }));

    res.json({ cases });
  } catch (error: any) {
    console.error('Erreur récupération cas:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

// Obtenir un cas par ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data: caseData, error } = await supabase
      .from('cases')
      .select(`
        *,
        criminals!cases_criminal_id_fkey(*),
        users!cases_created_by_fkey(nom, prenom)
      `)
      .eq('id', id)
      .single();

    if (error || !caseData) {
      return res.status(404).json({ error: 'Cas introuvable' });
    }

    res.json({
      case: {
        ...caseData,
        type_infraction: safeJsonParse(caseData.type_infraction, []),
        temoins: safeJsonParse(caseData.temoins, []),
        preuves: safeJsonParse(caseData.preuves, []),
      },
    });
  } catch (error: any) {
    console.error('Erreur récupération:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

// Supprimer un cas
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le cas existe
    const { data: existing } = await supabase
      .from('cases')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Cas introuvable' });
    }

    // Supprimer le cas
    const { error: deleteError } = await supabase
      .from('cases')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    // Logger l'action
    await supabase
      .from('action_logs')
      .insert({
        user_id: String(req.user!.id),
        action_type: 'DELETE',
        entity_type: 'case',
        entity_id: String(id),
        details: { numero_cas: id }, // Supabase convertit automatiquement en JSONB
        created_at: new Date().toISOString(),
      });

    res.json({ message: 'Cas supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Mettre à jour un cas
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier que le cas existe
    const { data: existing } = await supabase
      .from('cases')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Cas introuvable' });
    }

    // Construire l'objet de mise à jour
    const updateFields: any = {
      updated_at: new Date().toISOString(),
    };

    const allowedFields = [
      'criminal_id', 'date_arrestation', 'lieu_arrestation', 'type_infraction',
      'description', 'temoins', 'preuves', 'latitude', 'longitude',
      'poste_police', 'agent_arrestant', 'statut_judiciaire', 'parquet_id',
      'date_liberation', 'date_condamnation', 'mandat', 'recours',
    ];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        // Supabase gère automatiquement la conversion en JSONB pour les tableaux/objets
        // Pas besoin de JSON.stringify()
        updateFields[field] = updateData[field];
      }
    }

    if (Object.keys(updateFields).length === 1) { // Seulement updated_at
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    const { data: caseData, error: updateError } = await supabase
      .from('cases')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !caseData) {
      console.error('Erreur mise à jour:', updateError);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }

    // Logger l'action
    await supabase
      .from('action_logs')
      .insert({
        user_id: String(req.user!.id),
        action_type: 'UPDATE',
        entity_type: 'case',
        entity_id: String(id),
        details: updateData, // Supabase convertit automatiquement en JSONB
        created_at: new Date().toISOString(),
      });

    res.json({
      message: 'Cas mis à jour avec succès',
      case: {
        ...caseData,
        type_infraction: safeJsonParse(caseData.type_infraction, []),
        temoins: safeJsonParse(caseData.temoins, []),
        preuves: safeJsonParse(caseData.preuves, []),
      },
    });
  } catch (error: any) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Mettre à jour le statut judiciaire
router.patch('/:id/statut', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { statut_judiciaire, date_liberation, date_condamnation, mandat, recours } = req.body;

    if (!statut_judiciaire) {
      return res.status(400).json({ error: 'Statut judiciaire requis' });
    }

    const { data: caseData, error } = await supabase
      .from('cases')
      .update({
        statut_judiciaire,
        date_liberation: date_liberation || null,
        date_condamnation: date_condamnation || null,
        mandat: mandat || null,
        recours: recours || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !caseData) {
      return res.status(404).json({ error: 'Cas introuvable' });
    }

    // Si libération, envoyer une alerte
    if (statut_judiciaire === 'libere' && date_liberation) {
      const io = req.app.get('io');
      if (io) {
        const { data: criminal } = await supabase
          .from('criminals')
          .select('*')
          .eq('id', caseData.criminal_id)
          .single();

        if (criminal) {
          io.emit('criminal-released', {
            criminal_id: caseData.criminal_id,
            case_id: id,
            criminal,
            date_liberation,
          });
        }
      }
    }

    res.json({
      message: 'Statut mis à jour avec succès',
      case: caseData,
    });
  } catch (error: any) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

export default router;
