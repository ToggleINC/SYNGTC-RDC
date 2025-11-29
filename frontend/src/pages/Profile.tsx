import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Profile: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    region: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      const userData = response.data.user;
      setFormData({
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        email: userData.email || '',
        telephone: userData.telephone || '',
        poste: userData.poste || '',
        region: userData.region || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      enqueueSnackbar('Erreur lors de la récupération du profil', { variant: 'error' });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Si changement de mot de passe
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Les nouveaux mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }

        if (formData.newPassword.length < 8) {
          setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
          setLoading(false);
          return;
        }

        // Vérifier le mot de passe actuel
        try {
          await axios.post('/api/auth/login', {
            email: formData.email,
            password: formData.currentPassword,
          });
        } catch {
          setError('Mot de passe actuel incorrect');
          setLoading(false);
          return;
        }
      }

      // Mettre à jour le profil
      const updateData: any = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone || undefined,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      await axios.put('/api/auth/me', updateData);

      enqueueSnackbar('Profil mis à jour avec succès', { variant: 'success' });

      // Réinitialiser les champs de mot de passe
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erreur lors de la mise à jour');
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors de la mise à jour',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
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
          Retour au tableau de bord
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3436' }}>
          Mon Profil
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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2d3436' }}>
                Informations personnelles
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="nom"
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="prenom"
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                helperText="L'email ne peut pas être modifié"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="telephone"
                label="Téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="poste"
                label="Poste"
                name="poste"
                value={formData.poste}
                disabled
                helperText="Le poste ne peut pas être modifié"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="region"
                label="Région"
                name="region"
                value={formData.region}
                disabled
                helperText="La région ne peut pas être modifiée"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 600, color: '#2d3436' }}>
                Changer le mot de passe
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="currentPassword"
                label="Mot de passe actuel"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Remplir uniquement si vous souhaitez changer le mot de passe"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="newPassword"
                label="Nouveau mot de passe"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="confirmPassword"
                label="Confirmer le nouveau mot de passe"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
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
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile;

