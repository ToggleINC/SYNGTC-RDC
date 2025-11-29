import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Obtenir les alertes
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { type, statut, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('alerts')
      .select('*', { count: 'exact' });

    if (type) {
      query = query.eq('type', type as string);
    }

    if (statut) {
      query = query.eq('statut', statut as string);
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { data: alerts, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      throw error;
    }

    res.json({ alerts: alerts || [] });
  } catch (error: any) {
    console.error('Erreur récupération alertes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des alertes' });
  }
});

// Créer une alerte manuelle
router.post(
  '/',
  [
    body('type').isIn(['dangerous_criminal', 'recidivist', 'gang_activity', 'zone_rouge', 'other']),
    body('titre').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('priorite').isIn(['faible', 'moyenne', 'elevee', 'critique']),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, titre, description, priorite, criminal_id, location, metadata } = req.body;

      // Note: Si les colonnes location et metadata existent, Supabase gère automatiquement la conversion en JSONB
      const { data: alert, error: insertError } = await supabase
        .from('alerts')
        .insert({
          type,
          titre,
          description,
          priorite,
          criminal_id: criminal_id || null,
          // Les colonnes location et metadata peuvent ne pas exister dans le schéma Supabase actuel
          // Si elles existent, Supabase convertit automatiquement les objets en JSONB
          ...(location && { location }), // Passer l'objet directement si présent
          ...(metadata && { metadata }), // Passer l'objet directement si présent
          created_at: new Date(),
        })
        .select()
        .single();

      if (insertError || !alert) {
        console.error('Erreur création alerte:', insertError);
        return res.status(500).json({ error: 'Erreur lors de la création de l\'alerte' });
      }

      // Envoyer l'alerte via Socket.io
      const io = req.app.get('io');
      if (io) {
        io.emit('new-alert', {
          id: alert.id,
          type: alert.type,
          titre: alert.titre,
          description: alert.description,
          priorite: alert.priorite,
          created_at: alert.created_at,
        });
      }

      res.status(201).json({
        message: 'Alerte créée avec succès',
        alert,
      });
    } catch (error: any) {
      console.error('Erreur création alerte:', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'alerte' });
    }
  }
);

// Marquer une alerte comme lue
router.patch('/:id/read', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data: alert, error } = await supabase
      .from('alerts')
      .update({
        statut: 'lue',
        read_by: req.user!.id,
        read_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !alert) {
      return res.status(404).json({ error: 'Alerte introuvable' });
    }

    res.json({ message: 'Alerte marquée comme lue', alert });
  } catch (error: any) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

export default router;
