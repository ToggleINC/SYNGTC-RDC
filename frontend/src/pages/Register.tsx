import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  InputAdornment,
  IconButton,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    role: 'agent',
    poste: '',
    region: 'Kinshasa',
    telephone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        nom: formData.nom,
        prenom: formData.prenom,
        role: formData.role,
        poste: formData.poste,
        region: formData.region,
        telephone: formData.telephone || undefined,
      });

      enqueueSnackbar('Inscription réussie ! Vous pouvez maintenant vous connecter.', {
        variant: 'success',
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/assets/logo-ministere.png"
              alt="Logo Ministère"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#2d3436',
              mb: 0.5,
            }}
          >
            SYNGTC-RDC
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 1, lineHeight: 1.4, fontSize: '0.85rem' }}
          >
            Système National de Gestion et de Traçabilité des Criminels
          </Typography>
          <Typography
            variant="caption"
            align="center"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.4, fontSize: '0.75rem', display: 'block' }}
          >
            Ministère de l'Intérieur, Sécurité, Décentralisation et Affaires Coutumières - RD Congo
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 600, color: '#2d3436' }}>
            Inscription
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nom"
              label="Nom"
              name="nom"
              autoFocus
              value={formData.nom}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="prenom"
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="telephone"
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="poste"
              label="Poste"
              name="poste"
              placeholder="Ex: Commissariat Kasavubu, CIAT Kintambo"
              value={formData.poste}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
              }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Déjà un compte ? Se connecter
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;

