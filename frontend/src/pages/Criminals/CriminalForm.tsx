import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useSnackbar } from 'notistack';

interface CriminalFormProps {
  id?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

const CriminalForm: React.FC<CriminalFormProps> = ({ id: propId, onClose, onSuccess }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [infractions, setInfractions] = useState<string[]>([]);

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      nom: '',
      prenom: '',
      date_naissance: '',
      lieu_naissance: '',
      adresse: '',
      quartier: '',
      avenue: '',
      type_infraction: [] as string[],
      niveau_dangerosite: 'faible',
      parrainage: '',
      bande: '',
      gang: '',
      armes_saisies: [] as string[],
      objets_saisis: [] as string[],
      latitude: '',
      longitude: '',
      notes: '',
    },
  });

  const typeInfractionOptions = [
    'kuluna',
    'braquage',
    'vol_arme',
    'vol_simple',
    'violence',
    'trafic_drogue',
    'vandalisme',
    'homicide',
    'kidnapping',
  ];

  const safeParseJson = (value: any, defaultValue: any = []): any => {
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

  const fetchCriminal = useCallback(async () => {
    try {
      const response = await axios.get(`/api/criminals/${id}`);
      const criminal = response.data.criminal;
      Object.keys(criminal).forEach((key) => {
        if (key === 'type_infraction' || key === 'armes_saisies' || key === 'objets_saisis') {
          setValue(key, safeParseJson(criminal[key]));
        } else {
          setValue(key as any, criminal[key] || '');
        }
      });
      setInfractions(safeParseJson(criminal.type_infraction));
    } catch (error) {
      enqueueSnackbar('Erreur de chargement', { variant: 'error' });
    }
  }, [id, setValue, enqueueSnackbar]);

  useEffect(() => {
    if (id) {
      fetchCriminal();
    } else {
      // Réinitialiser le formulaire pour une nouvelle création
      setInfractions([]);
      reset();
    }
  }, [id, fetchCriminal, reset]);

  const onSubmit = async (data: any) => {
    // Validation côté client
    if (infractions.length === 0) {
      enqueueSnackbar('Veuillez sélectionner au moins un type d\'infraction', { variant: 'error' });
      return;
    }

    if (!data.nom || !data.prenom || !data.adresse || !data.quartier) {
      enqueueSnackbar('Veuillez remplir tous les champs obligatoires', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...data,
        type_infraction: infractions,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
      };

      let response;
      if (id) {
        response = await axios.put(`/api/criminals/${id}`, payload);
      } else {
        response = await axios.post('/api/criminals', payload);
      }

      // Vérifier si l'opération a été sauvegardée offline
      if (response.data?.offline) {
        enqueueSnackbar(
          response.data.message || 'Criminel sauvegardé hors ligne. Synchronisation automatique à la reconnexion.',
          { variant: 'info' }
        );
        // Ne pas naviguer, permettre à l'utilisateur de continuer à travailler
      } else {
        if (id) {
          enqueueSnackbar('Criminel mis à jour', { variant: 'success' });
        } else {
          enqueueSnackbar('Criminel enregistré', { variant: 'success' });
        }
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/criminels');
        }
      }
    } catch (error: any) {
      // Si l'erreur n'a pas été gérée par l'intercepteur
      if (!error.response?.data?.offline) {
        // Afficher les erreurs de validation de manière détaillée
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          const errorMessages = error.response.data.errors
            .map((err: any) => `${err.param || err.field}: ${err.msg || err.message}`)
            .join(', ');
          enqueueSnackbar(`Erreurs de validation: ${errorMessages}`, { variant: 'error' });
        } else {
          enqueueSnackbar(
            error.response?.data?.error || 'Erreur lors de l\'enregistrement',
            { variant: 'error' }
          );
        }
        console.error('Erreur détaillée:', error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Afficher le bouton retour seulement si c'est une page standalone (pas dans une modal)
  const isStandalone = !onClose && !onSuccess;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        {isStandalone && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(id ? `/criminels/${id}` : '/criminels')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              borderColor: '#636e72',
              color: '#636e72',
              '&:hover': {
                borderColor: '#2d3436',
                color: '#2d3436',
                bgcolor: '#f5f6fa',
              },
            }}
          >
            Retour
          </Button>
        )}
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3436' }}>
          {id ? 'Modifier' : 'Nouveau'} Criminel
        </Typography>
      </Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid #e0e0e0',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Controller
                name="nom"
                control={control}
                rules={{ required: 'Nom requis' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Nom"
                    autoFocus
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="prenom"
                control={control}
                rules={{ required: 'Prénom requis' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Prénom"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="date_naissance"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date de naissance"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0], // Ne pas permettre les dates futures
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="lieu_naissance"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Lieu de naissance" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="adresse"
                control={control}
                rules={{ required: 'Adresse requise' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Adresse"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="quartier"
                control={control}
                rules={{ required: 'Quartier requis' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Quartier"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="avenue"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Avenue" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type d'infraction</InputLabel>
                <Select
                  value=""
                  onChange={(e) => {
                    if (!infractions.includes(e.target.value)) {
                      setInfractions([...infractions, e.target.value]);
                    }
                  }}
                >
                  {typeInfractionOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {infractions.map((inf, idx) => (
                  <Chip
                    key={idx}
                    label={inf}
                    onDelete={() => setInfractions(infractions.filter((_, i) => i !== idx))}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="niveau_dangerosite"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Niveau de dangerosité</InputLabel>
                    <Select {...field} label="Niveau de dangerosité">
                      <MenuItem value="faible">Faible</MenuItem>
                      <MenuItem value="modere">Modéré</MenuItem>
                      <MenuItem value="eleve">Élevé</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="bande"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Bande" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="gang"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Gang" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="parrainage"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Parrainage" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="latitude"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Latitude (GPS)"
                    type="text"
                    fullWidth
                    helperText="Coordonnées GPS (ex: -4.3276 pour Kinshasa)"
                    inputProps={{
                      inputMode: 'decimal',
                      pattern: '-?[0-9]*\\.?[0-9]*',
                    }}
                    onChange={(e) => {
                      // Permettre seulement les nombres (y compris négatifs) et les points décimaux
                      const value = e.target.value;
                      if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="longitude"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Longitude (GPS)"
                    type="text"
                    fullWidth
                    helperText="Coordonnées GPS (ex: 15.3136)"
                    inputProps={{
                      inputMode: 'decimal',
                      pattern: '-?[0-9]*\\.?[0-9]*',
                    }}
                    onChange={(e) => {
                      // Permettre seulement les nombres (y compris négatifs) et les points décimaux
                      const value = e.target.value;
                      if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes"
                    multiline
                    rows={4}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/criminels')}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    borderColor: '#e0e0e0',
                    color: '#636e72',
                    '&:hover': {
                      borderColor: '#b2bec3',
                      bgcolor: '#f5f6fa',
                    },
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || infractions.length === 0}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                    bgcolor: '#00b894',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#00a085',
                    },
                    '&:disabled': {
                      bgcolor: '#b2bec3',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : id ? 'Modifier' : 'Créer Criminel'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CriminalForm;

