import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { supabase } from '../config/supabase';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { calculateDangerScore } from '../services/dangerScore';

const router = express.Router();

// Helper function pour parser en toute sécurité les champs JSON
const safeJsonParse = (value: any, defaultValue: any = []): any => {
  if (!value) return defaultValue;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch {
      // Si ce n'est pas du JSON valide, essayer de diviser par virgule
      if (value.includes(',')) {
        return value.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      return [value.trim()].filter(Boolean);
    }
  }
  return defaultValue;
};

// Tous les endpoints nécessitent une authentification
router.use(authenticate);

// Supprimer tous les criminels (Admin seulement - pour développement/test)
router.delete(
  '/all',
  authorize('admin_ministere', 'admin_pnc', 'admin_anr'),
  async (req: AuthRequest, res) => {
    try {
      // Supprimer d'abord les cas associés (cascade)
      await supabase.from('cases').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Supprimer les criminels
      const { data: deletedCriminals, error: deleteError } = await supabase
        .from('criminals')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
        .select('id');

      if (deleteError) {
        throw deleteError;
      }

      const count = deletedCriminals?.length || 0;

      // Logger l'action
      await supabase
        .from('action_logs')
        .insert({
          user_id: String(req.user!.id),
          action_type: 'DELETE_ALL',
          entity_type: 'criminal',
          details: { count }, // Supabase convertit automatiquement en JSONB
          created_at: new Date().toISOString(),
        });

      res.json({
        message: `${count} criminel(s) supprimé(s) avec succès`,
        count,
      });
    } catch (error: any) {
      console.error('Erreur suppression criminels:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }
);

// Enregistrer un nouveau criminel
router.post(
  '/',
  [
    body('nom').notEmpty().trim(),
    body('prenom').notEmpty().trim(),
    body('date_naissance').optional().isISO8601(),
    body('lieu_naissance').optional().trim(),
    body('adresse').notEmpty().trim(),
    body('quartier').notEmpty().trim(),
    body('type_infraction')
      .custom((value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        if (typeof value === 'string') {
          const parsed = value.includes(',') ? value.split(',').map(s => s.trim()) : [value.trim()];
          return parsed.length > 0 && parsed.every(s => s.length > 0);
        }
        return false;
      })
      .withMessage('Au moins un type d\'infraction est requis'),
    body('niveau_dangerosite').isIn(['faible', 'modere', 'eleve']),
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
        nom,
        prenom,
        date_naissance,
        lieu_naissance,
        adresse,
        quartier,
        avenue,
        type_infraction: typeInfractionRaw,
        niveau_dangerosite,
        parrainage,
        bande,
        gang,
        armes_saisies: armesSaisiesRaw,
        objets_saisis: objetsSaisiesRaw,
        latitude,
        longitude,
        photo_url,
        empreintes_url,
        notes,
      } = req.body;

      // Helper pour parser les champs tableaux
      const parseArrayField = (value: any): string[] => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            return value.split(',').map((s: string) => s.trim()).filter(Boolean);
          }
        }
        return [];
      };

      const type_infraction = parseArrayField(typeInfractionRaw);
      const armes_saisies = parseArrayField(armesSaisiesRaw);
      const objets_saisis = parseArrayField(objetsSaisiesRaw);

      if (type_infraction.length === 0) {
        return res.status(400).json({ error: 'Au moins un type d\'infraction est requis' });
      }

      // Générer un numéro criminel unique (format plus court: CR-XXXXXX)
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const numero_criminel = `CR-${random}`;

      // Calculer le score de dangerosité initial
      let dangerScore = 0;
      try {
        dangerScore = calculateDangerScore({
          niveau_dangerosite,
          type_infraction,
          armes_saisies,
          historique: [],
        });
      } catch (err) {
        console.error('Erreur calcul score dangerosité:', err);
        // Fallback score si erreur
        dangerScore = niveau_dangerosite === 'eleve' ? 70 : (niveau_dangerosite === 'modere' ? 50 : 20);
      }

      // Insérer le criminel
      // Note: Supabase gère automatiquement la conversion en JSONB pour les tableaux/objets
      const { data: criminal, error: insertError } = await supabase
        .from('criminals')
        .insert({
          numero_criminel,
          nom: nom.trim(),
          prenom: prenom.trim(),
          date_naissance: date_naissance || null,
          lieu_naissance: lieu_naissance ? lieu_naissance.trim() : null,
          adresse: adresse.trim(),
          quartier: quartier.trim(),
          avenue: avenue ? avenue.trim() : null,
          type_infraction, // Supabase convertit automatiquement en JSONB
          niveau_dangerosite,
          parrainage: parrainage ? parrainage.trim() : null,
          bande: bande ? bande.trim() : null,
          gang: gang ? gang.trim() : null,
          armes_saisies, // Supabase convertit automatiquement en JSONB
          objets_saisis, // Supabase convertit automatiquement en JSONB
          latitude: latitude ? parseFloat(latitude.toString()) : null,
          longitude: longitude ? parseFloat(longitude.toString()) : null,
          photo_url: photo_url || null,
          empreintes_url: empreintes_url || null,
          danger_score: dangerScore,
          notes: notes ? notes.trim() : null,
          created_by: req.user!.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError || !criminal) {
        console.error('Erreur création criminel:', insertError);

        // Gérer les erreurs spécifiques Supabase
        if (insertError?.code === '23505') {
          return res.status(400).json({ error: 'Ce numéro criminel existe déjà' });
        } else if (insertError?.code === '23503') {
          return res.status(400).json({ error: 'Référence invalide dans les données' });
        } else if (insertError?.code === '23502') {
          return res.status(400).json({ error: 'Champ requis manquant' });
        }

        return res.status(500).json({
          error: 'Erreur lors de l\'enregistrement',
          details: insertError // Toujours renvoyer les détails pour le débogage
        });
      }

      // Enregistrer l'action dans l'historique
      await supabase
        .from('action_logs')
        .insert({
          user_id: String(req.user!.id),
          action_type: 'CREATE',
          entity_type: 'criminal',
          entity_id: String(criminal.id),
          details: { numero_criminel }, // Supabase convertit automatiquement en JSONB
          created_at: new Date().toISOString(),
        });

      // Envoyer une alerte si dangerosité élevée
      if (niveau_dangerosite === 'eleve' || dangerScore >= 80) {
        console.log(`🚨 Criminel dangereux détecté: ${nom} ${prenom}, score: ${dangerScore}`);

        // Créer l'alerte dans la base de données
        const { data: alert, error: alertError } = await supabase
          .from('alerts')
          .insert({
            type: 'dangerous_criminal',
            titre: 'Nouveau criminel dangereux',
            description: `Un criminel dangereux (${nom} ${prenom}) a été enregistré avec un score de ${dangerScore}`,
            priorite: 'elevee',
            criminal_id: criminal.id,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (alertError) {
          console.error('❌ Erreur création alerte:', alertError);
        } else {
          console.log('✅ Alerte créée avec succès, ID:', alert?.id);
        }

        const io = req.app.get('io');
        if (io) {
          // Émettre l'alerte créée (ou les données brutes si la création a échoué)
          io.emit('new-dangerous-criminal', {
            id: alert?.id,
            criminal_id: criminal.id,
            numero_criminel,
            nom: `${nom} ${prenom}`,
            danger_score: dangerScore,
            location: { latitude, longitude },
            titre: 'Nouveau criminel dangereux',
            description: `Un criminel dangereux (${nom} ${prenom}) a été enregistré avec un score de ${dangerScore}`,
            priorite: 'elevee',
            created_at: new Date().toISOString(),
          });

          // Émettre aussi l'événement générique 'new-alert' pour la page Alertes
          if (alert) {
            io.emit('new-alert', alert);
          }
        }
      }

      res.status(201).json({
        message: 'Criminel enregistré avec succès',
        criminal: {
          ...criminal,
          type_infraction: safeJsonParse(criminal.type_infraction, []),
          armes_saisies: safeJsonParse(criminal.armes_saisies, []),
          objets_saisis: safeJsonParse(criminal.objets_saisis, []),
        },
      });
    } catch (error: any) {
      console.error('Erreur enregistrement criminel:', error);
      res.status(500).json({
        error: 'Erreur lors de l\'enregistrement',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

// Obtenir tous les criminels (alias pour /search sans paramètres)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('criminals')
      .select('*', { count: 'exact' });

    const offset = (Number(page) - 1) * Number(limit);
    const { data: criminals, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      throw error;
    }

    const criminalsParsed = (criminals || []).map((c) => ({
      ...c,
      type_infraction: safeJsonParse(c.type_infraction, []),
      armes_saisies: safeJsonParse(c.armes_saisies, []),
      objets_saisis: safeJsonParse(c.objets_saisis, []),
    }));

    res.json({
      criminals: criminalsParsed,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Erreur récupération criminels:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

// Rechercher des criminels
router.get(
  '/search',
  [
    query('q').optional().trim(),
    query('type_infraction').optional(),
    query('niveau_dangerosite').optional().isIn(['faible', 'modere', 'eleve']),
    query('quartier').optional().trim(),
    query('bande').optional().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req: AuthRequest, res) => {
    try {
      const {
        q,
        type_infraction,
        niveau_dangerosite,
        quartier,
        bande,
        page = 1,
        limit = 20,
      } = req.query;

      let query = supabase
        .from('criminals')
        .select('*', { count: 'exact' });

      // Recherche textuelle
      if (q) {
        query = query.or(`nom.ilike.%${q}%,prenom.ilike.%${q}%,numero_criminel.ilike.%${q}%`);
      }

      // Filtre type_infraction (recherche dans le JSON)
      if (type_infraction) {
        // Supabase permet de rechercher dans les champs JSON avec cs (contains)
        query = query.contains('type_infraction', [type_infraction as string]);
      }

      // Filtre niveau_dangerosite
      if (niveau_dangerosite) {
        query = query.eq('niveau_dangerosite', niveau_dangerosite as string);
      }

      // Filtre quartier
      if (quartier) {
        query = query.ilike('quartier', `%${quartier}%`);
      }

      // Filtre bande
      if (bande) {
        query = query.ilike('bande', `%${bande}%`);
      }

      // Pagination
      const offset = (Number(page) - 1) * Number(limit);
      const { data: criminals, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) {
        throw error;
      }

      const criminalsParsed = (criminals || []).map((c) => ({
        ...c,
        type_infraction: safeJsonParse(c.type_infraction, []),
        armes_saisies: safeJsonParse(c.armes_saisies, []),
        objets_saisis: safeJsonParse(c.objets_saisis, []),
      }));

      res.json({
        criminals: criminalsParsed,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Erreur recherche:', error);
      res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
  }
);

// Obtenir un criminel par ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Récupérer le criminel
    const { data: criminal, error: criminalError } = await supabase
      .from('criminals')
      .select('*')
      .eq('id', id)
      .single();

    if (criminalError || !criminal) {
      console.error('Erreur récupération criminel:', criminalError);
      return res.status(404).json({ error: 'Criminel introuvable' });
    }

    // Récupérer les informations de l'utilisateur créateur
    let createdByData = null;
    if (criminal.created_by) {
      const { data: userData } = await supabase
        .from('users')
        .select('nom, prenom, poste')
        .eq('id', criminal.created_by)
        .single();
      createdByData = userData;
    }

    // Récupérer l'historique des cas
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('*')
      .eq('criminal_id', id)
      .order('date_arrestation', { ascending: false });

    if (casesError) {
      console.error('Erreur récupération cas:', casesError);
    }

    res.json({
      criminal: {
        ...criminal,
        created_by_nom: createdByData?.nom || null,
        created_by_prenom: createdByData?.prenom || null,
        created_by_poste: createdByData?.poste || null,
        type_infraction: safeJsonParse(criminal.type_infraction, []),
        armes_saisies: safeJsonParse(criminal.armes_saisies, []),
        objets_saisis: safeJsonParse(criminal.objets_saisis, []),
      },
      cases: cases || [],
    });
  } catch (error: any) {
    console.error('Erreur récupération:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

// Mettre à jour un criminel
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier que le criminel existe
    const { data: existing } = await supabase
      .from('criminals')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Criminel introuvable' });
    }

    // Construire l'objet de mise à jour
    const updateFields: any = {
      updated_at: new Date().toISOString(),
    };

    const allowedFields = [
      'nom', 'prenom', 'date_naissance', 'lieu_naissance', 'adresse',
      'quartier', 'avenue', 'type_infraction', 'niveau_dangerosite',
      'parrainage', 'bande', 'gang', 'armes_saisies', 'objets_saisis',
      'latitude', 'longitude', 'photo_url', 'empreintes_url', 'notes',
    ];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        // Supabase gère automatiquement la conversion en JSONB pour les tableaux/objets
        // Pas besoin de JSON.stringify()
        updateFields[field] = updateData[field];
      }
    }

    // Recalculer le score de dangerosité si nécessaire
    if (updateData.niveau_dangerosite || updateData.type_infraction || updateData.armes_saisies) {
      // Récupérer le criminel actuel
      const { data: currentCriminal } = await supabase
        .from('criminals')
        .select('*')
        .eq('id', id)
        .single();

      if (currentCriminal) {
        // Récupérer les cas
        const { data: cases } = await supabase
          .from('cases')
          .select('*')
          .eq('criminal_id', id);

        const dangerScore = calculateDangerScore({
          niveau_dangerosite: updateData.niveau_dangerosite || currentCriminal.niveau_dangerosite,
          type_infraction: updateData.type_infraction || safeJsonParse(currentCriminal.type_infraction, []),
          armes_saisies: updateData.armes_saisies || safeJsonParse(currentCriminal.armes_saisies, []),
          historique: cases || [],
        });

        updateFields.danger_score = dangerScore;
      }
    }

    if (Object.keys(updateFields).length === 1) { // Seulement updated_at
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    const { data: criminal, error: updateError } = await supabase
      .from('criminals')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !criminal) {
      console.error('Erreur mise à jour:', updateError);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }

    // Logger l'action
    await supabase
      .from('action_logs')
      .insert({
        user_id: String(req.user!.id),
        action_type: 'UPDATE',
        entity_type: 'criminal',
        entity_id: String(id),
        details: updateData, // Supabase convertit automatiquement en JSONB
        created_at: new Date().toISOString(),
      });

    res.json({
      message: 'Criminel mis à jour avec succès',
      criminal: {
        ...criminal,
        type_infraction: safeJsonParse(criminal.type_infraction, []),
        armes_saisies: safeJsonParse(criminal.armes_saisies, []),
        objets_saisis: safeJsonParse(criminal.objets_saisis, []),
      },
    });
  } catch (error: any) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Supprimer un criminel
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le criminel existe et récupérer le numéro
    const { data: existing } = await supabase
      .from('criminals')
      .select('id, numero_criminel')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Criminel introuvable' });
    }

    // Supprimer le criminel (les cas seront supprimés en cascade si configuré)
    const { error: deleteError } = await supabase
      .from('criminals')
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
        entity_type: 'criminal',
        entity_id: String(id),
        details: { numero_criminel: existing.numero_criminel }, // Supabase convertit automatiquement en JSONB
        created_at: new Date().toISOString(),
      });

    res.json({ message: 'Criminel supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;
