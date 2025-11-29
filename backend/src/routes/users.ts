import express from 'express';
import { body, validationResult, query } from 'express-validator';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Tous les endpoints nécessitent une authentification
router.use(authenticate);

// Obtenir tous les utilisateurs (admin seulement)
router.get(
  '/',
  authorize('admin_pnc', 'admin_anr', 'admin_ministere'),
  async (req: AuthRequest, res) => {
    try {
      const { page = 1, limit = 20, role, region, search } = req.query;

      let query = supabase
        .from('users')
        .select('id, email, nom, prenom, role, poste, region, telephone, is_active, created_at', { count: 'exact' });

      if (search) {
        query = query.or(`nom.ilike.%${search}%,prenom.ilike.%${search}%,email.ilike.%${search}%`);
      }

      if (role) {
        query = query.eq('role', role as string);
      }

      if (region) {
        query = query.eq('region', region as string);
      }

      const offset = (Number(page) - 1) * Number(limit);
      const { data: users, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) {
        throw error;
      }

      res.json({
        users: users || [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Erreur récupération utilisateurs:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  }
);

// Obtenir un utilisateur par ID
router.get('/:id', authorize('admin_pnc', 'admin_anr', 'admin_ministere'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, nom, prenom, role, poste, region, telephone, is_active, created_at')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Erreur récupération:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

// Créer un utilisateur (admin seulement)
router.post(
  '/',
  authorize('admin_pnc', 'admin_anr', 'admin_ministere'),
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('nom').notEmpty().trim(),
    body('prenom').notEmpty().trim(),
    body('role').isIn(['agent', 'superviseur', 'admin_pnc', 'admin_anr', 'admin_ministere']),
    body('poste').notEmpty().trim(),
    body('region').notEmpty().trim(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, nom, prenom, role, poste, region, telephone } = req.body;

      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Créer l'utilisateur
      const { data: user, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: hashedPassword,
          nom,
          prenom,
          role,
          poste,
          region,
          telephone: telephone || null,
          created_at: new Date(),
        })
        .select('id, email, nom, prenom, role, poste, region, telephone, is_active, created_at')
        .single();

      if (insertError || !user) {
        console.error('Erreur création utilisateur:', insertError);
        return res.status(500).json({ error: 'Erreur lors de la création' });
      }

      // Logger l'action
      await supabase
        .from('action_logs')
        .insert({
          user_id: String(req.user!.id),
          action_type: 'CREATE',
          entity_type: 'user',
          entity_id: String(user.id),
          details: { email }, // Supabase convertit automatiquement en JSONB
          created_at: new Date(),
        });

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user,
      });
    } catch (error: any) {
      console.error('Erreur création utilisateur:', error);
      res.status(500).json({ error: 'Erreur lors de la création' });
    }
  }
);

// Mettre à jour un utilisateur (admin seulement)
router.put(
  '/:id',
  authorize('admin_pnc', 'admin_anr', 'admin_ministere'),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { email, nom, prenom, role, poste, region, telephone, is_active, password } = req.body;

      // Vérifier que l'utilisateur existe
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      // Construire l'objet de mise à jour
      const updateData: any = {
        updated_at: new Date(),
      };

      const allowedFields = ['nom', 'prenom', 'role', 'poste', 'region', 'telephone', 'is_active'];
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      // Si changement de mot de passe
      if (password) {
        updateData.password_hash = await bcrypt.hash(password, 12);
      }

      // Si changement d'email, vérifier qu'il n'existe pas déjà
      if (email) {
        const { data: emailCheck } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .neq('id', id)
          .single();

        if (emailCheck) {
          return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }
        updateData.email = email;
      }

      if (Object.keys(updateData).length === 1) { // Seulement updated_at
        return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
      }

      const { data: user, error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select('id, email, nom, prenom, role, poste, region, telephone, is_active, created_at')
        .single();

      if (updateError || !user) {
        console.error('Erreur mise à jour:', updateError);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
      }

      // Logger l'action
      await supabase
        .from('action_logs')
        .insert({
          user_id: String(req.user!.id),
          action_type: 'UPDATE',
          entity_type: 'user',
          entity_id: String(id),
          details: req.body, // Supabase convertit automatiquement en JSONB
          created_at: new Date(),
        });

      res.json({
        message: 'Utilisateur mis à jour avec succès',
        user,
      });
    } catch (error: any) {
      console.error('Erreur mise à jour:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  }
);

// Supprimer un utilisateur (admin seulement)
router.delete('/:id', authorize('admin_pnc', 'admin_anr', 'admin_ministere'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Ne pas permettre de supprimer son propre compte
    if (id === req.user!.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    // Vérifier que l'utilisateur existe
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Supprimer l'utilisateur
    const { error: deleteError } = await supabase
      .from('users')
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
        entity_type: 'user',
        entity_id: String(id),
        details: { deleted: true }, // Supabase convertit automatiquement en JSONB
        created_at: new Date(),
      });

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;
