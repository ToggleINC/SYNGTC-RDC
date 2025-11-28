import express from 'express';
import { query, validationResult } from 'express-validator';
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

// Obtenir les zones rouges (hotspots)
router.get(
  '/hotspots',
  [
    query('region').optional().trim(),
    query('date_debut').optional().isISO8601(),
    query('date_fin').optional().isISO8601(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const { region, date_debut, date_fin } = req.query;

      let query = supabase
        .from('criminals')
        .select('quartier, latitude, longitude, created_at')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (region) {
        query = query.eq('region', region as string);
      }

      if (date_debut) {
        query = query.gte('created_at', date_debut as string);
      }

      if (date_fin) {
        query = query.lte('created_at', date_fin as string);
      }

      const { data: criminals, error } = await query;

      if (error) {
        throw error;
      }

      // Grouper par quartier côté client
      const quartierMap: { [key: string]: { count: number; latSum: number; lngSum: number } } = {};
      
      criminals?.forEach((c) => {
        if (c.quartier) {
          if (!quartierMap[c.quartier]) {
            quartierMap[c.quartier] = { count: 0, latSum: 0, lngSum: 0 };
          }
          quartierMap[c.quartier].count++;
          quartierMap[c.quartier].latSum += parseFloat(c.latitude);
          quartierMap[c.quartier].lngSum += parseFloat(c.longitude);
        }
      });

      const hotspots = Object.entries(quartierMap)
        .filter(([_, data]) => data.count >= 3)
        .map(([quartier, data]) => ({
          quartier,
          nombre_cas: data.count,
          location: {
            latitude: data.latSum / data.count,
            longitude: data.lngSum / data.count,
          },
          niveau_danger: 
            data.count >= 20 ? 'eleve' :
            data.count >= 10 ? 'modere' : 'faible',
        }))
        .sort((a, b) => b.nombre_cas - a.nombre_cas)
        .slice(0, 50);

      res.json({ hotspots });
    } catch (error: any) {
      console.error('Erreur hotspots:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des zones rouges' });
    }
  }
);

// Obtenir la cartographie complète
router.get('/map', async (req: AuthRequest, res) => {
  try {
    const { region, quartier, type_infraction } = req.query;

    // Récupérer les criminels avec coordonnées GPS
    let criminalsQuery = supabase
      .from('criminals')
      .select('id, numero_criminel, nom, prenom, quartier, latitude, longitude, type_infraction, niveau_dangerosite, danger_score, created_at')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(1000);

    if (region) {
      criminalsQuery = criminalsQuery.eq('region', region as string);
    }

    if (quartier) {
      criminalsQuery = criminalsQuery.ilike('quartier', `%${quartier}%`);
    }

    const { data: criminalsData, error: criminalsError } = await criminalsQuery.order('created_at', { ascending: false });

    if (criminalsError) {
      console.error('Erreur récupération criminels:', criminalsError);
    }

    // Récupérer les cas avec coordonnées GPS
    let casesQuery = supabase
      .from('cases')
      .select(`
        id, numero_cas, latitude, longitude, lieu_arrestation, type_infraction,
        statut_judiciaire, date_arrestation, criminal_id,
        criminals(nom, prenom)
      `)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(500);

    if (quartier) {
      casesQuery = casesQuery.ilike('lieu_arrestation', `%${quartier}%`);
    }

    const { data: casesData, error: casesError } = await casesQuery.order('date_arrestation', { ascending: false });

    if (casesError) {
      console.error('Erreur récupération cas:', casesError);
    }

    // Transformer les données des criminels
    const criminalsDataTransformed = (criminalsData || []).map((row: any) => ({
      id: row.id,
      numero_criminel: row.numero_criminel,
      nom: `${row.nom} ${row.prenom}`,
      quartier: row.quartier,
      location: {
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
      },
      type_infraction: safeJsonParse(row.type_infraction, []),
      niveau_dangerosite: row.niveau_dangerosite,
      danger_score: parseFloat(row.danger_score || 0),
      date: row.created_at,
      type: 'criminal',
    }));

    // Transformer les données des cas
    const casesDataTransformed = (casesData || []).map((row: any) => {
      const criminalData = row.criminals || (Array.isArray(row.criminals) ? row.criminals[0] : null);
      return {
        id: row.id,
        numero_criminel: row.numero_cas,
        nom: criminalData ? `${criminalData.nom} ${criminalData.prenom}` : 'Inconnu',
        quartier: row.lieu_arrestation,
        location: {
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude),
        },
        type_infraction: safeJsonParse(row.type_infraction, []),
        niveau_dangerosite: row.statut_judiciaire,
        danger_score: 0,
        date: row.date_arrestation,
        type: 'case',
      };
    });

    res.json({ mapData: [...criminalsDataTransformed, ...casesDataTransformed] });
  } catch (error: any) {
    console.error('Erreur cartographie:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la cartographie' });
  }
});

// Statistiques par région
router.get('/stats/regions', async (req: AuthRequest, res) => {
  try {
    // Récupérer tous les criminels
    const { data: criminals, error } = await supabase
      .from('criminals')
      .select('region, niveau_dangerosite, is_recidivist, danger_score');

    if (error) {
      throw error;
    }

    // Calculer les statistiques côté client
    const regionMap: { [key: string]: { total: number; danger_eleve: number; recidivistes: number; scoreSum: number; count: number } } = {};

    criminals?.forEach((c) => {
      if (c.region) {
        if (!regionMap[c.region]) {
          regionMap[c.region] = { total: 0, danger_eleve: 0, recidivistes: 0, scoreSum: 0, count: 0 };
        }
        regionMap[c.region].total++;
        if (c.niveau_dangerosite === 'eleve') {
          regionMap[c.region].danger_eleve++;
        }
        if (c.is_recidivist) {
          regionMap[c.region].recidivistes++;
        }
        if (c.danger_score) {
          regionMap[c.region].scoreSum += parseFloat(c.danger_score);
          regionMap[c.region].count++;
        }
      }
    });

    const stats = Object.entries(regionMap)
      .map(([region, data]) => ({
        region,
        total_criminels: data.total,
        danger_eleve: data.danger_eleve,
        recidivistes: data.recidivistes,
        score_moyen: data.count > 0 ? data.scoreSum / data.count : 0,
      }))
      .sort((a, b) => b.total_criminels - a.total_criminels);

    res.json({ stats });
  } catch (error: any) {
    console.error('Erreur statistiques:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

export default router;
