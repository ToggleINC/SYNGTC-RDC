interface DangerScoreInput {
  niveau_dangerosite: 'faible' | 'modere' | 'eleve';
  type_infraction: string[];
  armes_saisies: string[];
  historique?: any[];
}

export function calculateDangerScore(input: DangerScoreInput): number {
  let score = 0;

  // Score de base selon le niveau de dangerosité
  switch (input.niveau_dangerosite) {
    case 'faible':
      score = 20;
      break;
    case 'modere':
      score = 50;
      break;
    case 'eleve':
      score = 70;
      break;
  }

  // Bonus pour types d'infractions graves
  const infractionsGraves = [
    'braquage',
    'vol_arme',
    'homicide',
    'violence_grave',
    'trafic_drogue',
    'kidnapping',
  ];

  input.type_infraction.forEach((infraction) => {
    if (infractionsGraves.includes(infraction.toLowerCase())) {
      score += 10;
    }
  });

  // Bonus pour armes
  if (input.armes_saisies && input.armes_saisies.length > 0) {
    const armesLourdes = ['ak47', 'pistolet', 'mitraillette', 'grenade'];
    input.armes_saisies.forEach((arme) => {
      if (armesLourdes.some((a) => arme.toLowerCase().includes(a))) {
        score += 15;
      } else {
        score += 5;
      }
    });
  }

  // Bonus pour récidive
  if (input.historique && input.historique.length > 0) {
    score += input.historique.length * 5;
    if (input.historique.length >= 3) {
      score += 20; // Récidiviste confirmé
    }
  }

  // Limiter à 100
  return Math.min(100, Math.max(0, score));
}

