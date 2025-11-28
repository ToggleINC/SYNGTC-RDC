import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    poste: string;
    region: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        error: 'Accès refusé. Token manquant.' 
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret'
    ) as any;

    // Vérifier que l'utilisateur existe toujours
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role, poste, region, is_active')
      .eq('id', decoded.userId)
      .limit(1)
      .single();

    if (error || !users) {
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    const user = users;

    if (!user.is_active) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      poste: user.poste,
      region: user.region,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Accès refusé. Permissions insuffisantes.' 
      });
    }

    next();
  };
};

