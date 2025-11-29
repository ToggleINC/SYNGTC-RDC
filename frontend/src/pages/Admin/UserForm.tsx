import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  poste: string;
  region: string;
  telephone: string;
}

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ open, onClose, user }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: 'agent',
    poste: '',
    region: 'Kinshasa',
    telephone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        poste: user.poste,
        region: user.region,
        telephone: user.telephone || '',
      });
    } else {
      setFormData({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        role: 'agent',
        poste: '',
        region: 'Kinshasa',
        telephone: '',
      });
    }
  }, [user, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Mise à jour
        const payload: any = {
          nom: formData.nom,
          prenom: formData.prenom,
          role: formData.role,
          poste: formData.poste,
          region: formData.region,
          telephone: formData.telephone || undefined,
        };

        if (formData.email !== user.email) {
          payload.email = formData.email;
        }

        if (formData.password) {
          payload.password = formData.password;
        }

        await axios.put(`/api/users/${user.id}`, payload);
        enqueueSnackbar('Utilisateur mis à jour avec succès', { variant: 'success' });
      } else {
        // Création
        if (!formData.password) {
          enqueueSnackbar('Le mot de passe est requis', { variant: 'error' });
          setLoading(false);
          return;
        }

        await axios.post('/api/users', formData);
        enqueueSnackbar('Utilisateur créé avec succès', { variant: 'success' });
      }
      onClose();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors de l\'enregistrement',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid #e0e0e0',
          fontWeight: 600,
          color: '#2d3436',
        }}
      >
        {user ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#636e72',
            '&:hover': {
              bgcolor: '#f5f6fa',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <form onSubmit={handleSubmit} id="user-form">
          <Grid container spacing={2.5}>
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
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required={!user}
                fullWidth
                id="password"
                label={user ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                id="role"
                label="Rôle"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="agent">Agent</MenuItem>
                <MenuItem value="superviseur">Superviseur</MenuItem>
                <MenuItem value="admin_pnc">Admin PNC</MenuItem>
                <MenuItem value="admin_anr">Admin ANR</MenuItem>
                <MenuItem value="admin_ministere">Admin Ministère</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="poste"
                label="Poste"
                name="poste"
                value={formData.poste}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                id="region"
                label="Région"
                name="region"
                value={formData.region}
                onChange={handleChange}
              >
                <MenuItem value="Kinshasa">Kinshasa</MenuItem>
                <MenuItem value="Lubumbashi">Lubumbashi</MenuItem>
                <MenuItem value="Goma">Goma</MenuItem>
                <MenuItem value="Kisangani">Kisangani</MenuItem>
                <MenuItem value="Mbuji-Mayi">Mbuji-Mayi</MenuItem>
                <MenuItem value="Bukavu">Bukavu</MenuItem>
              </TextField>
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
          </Grid>
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e0e0e0',
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
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
          form="user-form"
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
          {loading ? 'Enregistrement...' : user ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;

