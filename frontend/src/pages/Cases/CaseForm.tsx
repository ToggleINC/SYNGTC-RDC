import React, { useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useSnackbar } from 'notistack';

interface CaseFormProps {
  id?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ id, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [criminals, setCriminals] = useState<any[]>([]);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      criminal_id: '',
      date_arrestation: new Date().toISOString().slice(0, 16), // Format datetime-local
      lieu_arrestation: '',
      description: '',
      latitude: '',
      longitude: '',
    },
  });

  React.useEffect(() => {
    fetchCriminals();
    if (id) {
      fetchCase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCriminals = async () => {
    try {
      const response = await axios.get('/api/criminals/search', { params: { limit: 100 } });
      setCriminals(response.data.criminals);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchCase = async () => {
    try {
      const response = await axios.get(`/api/cases/${id}`);
      const caseData = response.data.case;
      // Remplir le formulaire avec les données du cas
      setValue('criminal_id', caseData.criminal_id);
      setValue('date_arrestation', new Date(caseData.date_arrestation).toISOString().slice(0, 16));
      setValue('lieu_arrestation', caseData.lieu_arrestation);
      setValue('description', caseData.description || '');
      setValue('latitude', caseData.latitude || '');
      setValue('longitude', caseData.longitude || '');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const url = id ? `/api/cases/${id}` : '/api/cases';
      const method = id ? 'put' : 'post';
      const response = await axios[method](url, {
        ...data,
        type_infraction: ['kuluna'], // À améliorer avec sélection multiple
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
      });

      // Vérifier si l'opération a été sauvegardée offline
      if (response.data?.offline) {
        enqueueSnackbar(
          response.data.message || 'Cas sauvegardé hors ligne. Synchronisation automatique à la reconnexion.',
          { variant: 'info' }
        );
        // Ne pas naviguer, permettre à l'utilisateur de continuer à travailler
      } else {
        enqueueSnackbar(id ? 'Cas modifié avec succès' : 'Cas enregistré', { variant: 'success' });
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/cas');
        }
      }
    } catch (error: any) {
      // Si l'erreur n'a pas été gérée par l'intercepteur
      if (!error.response?.data?.offline) {
        enqueueSnackbar(
          error.response?.data?.error || 'Erreur',
          { variant: 'error' }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cas')}
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
          Retour aux cas
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3436' }}>
          Nouveau Cas
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
            <Grid item xs={12}>
              <Controller
                name="criminal_id"
                control={control}
                rules={{ required: 'Criminel requis' }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth required error={!!fieldState.error}>
                    <InputLabel>Criminel</InputLabel>
                    <Select {...field} label="Criminel">
                      {criminals.map((criminal) => (
                        <MenuItem key={criminal.id} value={criminal.id}>
                          {criminal.numero_criminel} - {criminal.nom} {criminal.prenom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="date_arrestation"
                control={control}
                rules={{ required: 'Date requise' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Date d'arrestation"
                    type="datetime-local"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="lieu_arrestation"
                control={control}
                rules={{ required: 'Lieu requis' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Lieu d'arrestation"
                    fullWidth
                    required
                    error={!!fieldState.error}
                  />
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
                    label="Latitude"
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
                    label="Longitude"
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
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
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
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    } else {
                      navigate('/cas');
                    }
                  }}
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
                  disabled={loading}
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
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Créer Cas'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CaseForm;

