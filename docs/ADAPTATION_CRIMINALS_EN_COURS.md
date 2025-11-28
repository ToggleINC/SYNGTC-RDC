# Adaptation criminals.ts - En Cours

## 📋 Fichier criminals.ts

Ce fichier est le plus volumineux et complexe avec **17 appels à `pool.query`** à adapter.

### Routes à Adapter :

1. ✅ DELETE `/all` - Supprimer tous les criminels
2. ⏳ POST `/` - Créer un criminel
3. ⏳ GET `/search` - Rechercher des criminels
4. ⏳ GET `/:id` - Obtenir un criminel par ID
5. ⏳ PUT `/:id` - Mettre à jour un criminel
6. ⏳ DELETE `/:id` - Supprimer un criminel

### Complexités :

- Requêtes avec filtres dynamiques multiples
- Recherche textuelle (ILIKE)
- Filtres sur champs JSON (type_infraction)
- JOINs avec users pour récupérer created_by
- Calculs de danger_score
- Gestion des récidivistes

---

**Note** : L'adaptation est en cours. Le fichier sera complété progressivement.

