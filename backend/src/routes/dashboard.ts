import express from 'express';
import { supabase } from '../config/supabase';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Statistiques générales
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    // Statistiques globales
    const { count: totalCriminels } = await supabase
      .from('criminals')
      .select('*', { count: 'exact', head: true });

    const { count: totalCas } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true });

    const { count: recidivistes } = await supabase
      .from('criminals')
      .select('*', { count: 'exact', head: true })
      .eq('is_recidivist', true);

    const { count: dangerEleve } = await supabase
      .from('criminals')
      .select('*', { count: 'exact', head: true })
      .eq('niveau_dangerosite', 'eleve');

    // Statistiques par type d'infraction (nécessite un traitement côté client)
    const { data: criminals } = await supabase
      .from('criminals')
      .select('type_infraction');

    const infractionsMap: { [key: string]: number } = {};
    criminals?.forEach((c) => {
      const types = Array.isArray(c.type_infraction) 
        ? c.type_infraction 
        : (typeof c.type_infraction === 'string' ? JSON.parse(c.type_infraction) : []);
      types.forEach((type: string) => {
        infractionsMap[type] = (infractionsMap[type] || 0) + 1;
      });
    });

    const infractions = Object.entries(infractionsMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Statistiques par région
    const { data: regionsData } = await supabase
      .from('criminals')
      .select('region');

    const regionsMap: { [key: string]: number } = {};
    regionsData?.forEach((c) => {
      if (c.region) {
        regionsMap[c.region] = (regionsMap[c.region] || 0) + 1;
      }
    });

    const regions = Object.entries(regionsMap)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count);

    // Cas récents (7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: casRecents } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .gte('date_arrestation', sevenDaysAgo.toISOString());

    // Alertes non lues
    const { count: alertesNonLues } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('statut', 'non_lue');

    res.json({
      global: {
        total_criminels: totalCriminels || 0,
        total_cas: totalCas || 0,
        recidivistes: recidivistes || 0,
        danger_eleve: dangerEleve || 0,
        cas_7_jours: casRecents || 0,
        alertes_non_lues: alertesNonLues || 0,
      },
      par_type_infraction: infractions,
      par_region: regions,
    });
  } catch (error: any) {
    console.error('Erreur statistiques:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// Graphiques temporels
router.get('/charts/timeline', async (req: AuthRequest, res) => {
  try {
    const { period = '30' } = req.query; // jours
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(period));

    const { data: criminals, error } = await supabase
      .from('criminals')
      .select('created_at')
      .gte('created_at', daysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Grouper par date
    const timelineMap: { [key: string]: number } = {};
    criminals?.forEach((c) => {
      const date = new Date(c.created_at).toISOString().split('T')[0];
      timelineMap[date] = (timelineMap[date] || 0) + 1;
    });

    const timeline = Object.entries(timelineMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({ timeline });
  } catch (error: any) {
    console.error('Erreur timeline:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

export default router;
