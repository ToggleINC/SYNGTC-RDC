import express from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Inscription d'un nouvel agent
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('nom').notEmpty().trim(),
    body('prenom').notEmpty().trim(),
    body('role').isIn(['agent', 'superviseur', 'admin_pnc', 'admin_anr', 'admin_ministere']),
    body('poste').notEmpty().trim(),
    body('region').notEmpty().trim(),
  ],
  async (req, res) => {
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
        .select('id, email, nom, prenom, role, poste, region')
        .single();

      if (insertError || !user) {
        console.error('Erreur création utilisateur:', insertError);
        return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
      }

      res.status(201).json({
        message: 'Agent enregistré avec succès',
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          poste: user.poste,
          region: user.region,
        },
      });
    } catch (error: any) {
      console.error('Erreur inscription:', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  }
);

// Connexion
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Trouver l'utilisateur
      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .limit(1);

      if (fetchError || !users || users.length === 0) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const user = users[0];

      if (!user.is_active) {
        return res.status(403).json({ error: 'Compte désactivé' });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      // Générer le token JWT
      const jwtSecret: string = process.env.JWT_SECRET || 'default_secret';
      const signOptions: SignOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      };
      const token = jwt.sign(
        { userId: String(user.id), email: user.email, role: user.role },
        jwtSecret,
        signOptions
      );

      // Enregistrer la connexion (ne pas bloquer si l'insertion échoue)
      try {
        await supabase
          .from('user_sessions')
          .insert({
            user_id: String(user.id),
            ip_address: String(req.ip || req.socket.remoteAddress || 'unknown'),
            user_agent: req.headers['user-agent'] || null,
            created_at: new Date(),
          });
      } catch (sessionError) {
        // Logger l'erreur mais ne pas bloquer la connexion
        console.error('Erreur enregistrement session:', sessionError);
      }

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          poste: user.poste,
          region: user.region,
        },
      });
    } catch (error: any) {
      console.error('Erreur connexion:', error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  }
);

// Obtenir le profil de l'utilisateur connecté
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, nom, prenom, role, poste, region, telephone, created_at')
        .eq('id', String(req.user!.id))
        .single();

    if (error || !user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Erreur profil:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

// Mettre à jour le profil de l'utilisateur connecté
router.put(
  '/me',
  authenticate,
  [
    body('nom').optional().notEmpty().trim(),
    body('prenom').optional().notEmpty().trim(),
    body('telephone').optional().trim(),
    body('password').optional().isLength({ min: 8 }),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nom, prenom, telephone, password } = req.body;

      const updateData: any = {
        updated_at: new Date(),
      };

      if (nom) updateData.nom = nom;
      if (prenom) updateData.prenom = prenom;
      if (telephone !== undefined) updateData.telephone = telephone || null;
      if (password) {
        updateData.password_hash = await bcrypt.hash(password, 12);
      }

      if (Object.keys(updateData).length === 1) { // Seulement updated_at
        return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
      }

      const { data: user, error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', String(req.user!.id))
        .select('id, email, nom, prenom, role, poste, region, telephone, created_at')
        .single();

      if (updateError || !user) {
        console.error('Erreur mise à jour profil:', updateError);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
      }

      // Logger l'action
      await supabase
        .from('action_logs')
        .insert({
          user_id: String(req.user!.id),
          action_type: 'UPDATE',
          entity_type: 'user',
          entity_id: String(req.user!.id),
          details: { profile_update: true }, // Supabase convertit automatiquement en JSONB
          created_at: new Date(),
        });

      res.json({
        message: 'Profil mis à jour avec succès',
        user,
      });
    } catch (error: any) {
      console.error('Erreur mise à jour profil:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
  }
);

export default router;

