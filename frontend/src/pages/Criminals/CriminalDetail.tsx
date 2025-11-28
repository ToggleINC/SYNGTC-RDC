import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

const CriminalDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [criminal, setCriminal] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/criminals/${id}`);
      setCriminal(response.data.criminal);
      setCases(response.data.cases || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!criminal) {
    return <Typography>Criminel introuvable</Typography>;
  }

  const getDangerColor = (niveau: string) => {
    switch (niveau) {
      case 'eleve':
        return 'error';
      case 'modere':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/criminels')}
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
            Retour aux criminels
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3436' }}>
            {criminal.nom} {criminal.prenom}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/criminels/${id}/modifier`)}
          sx={{
            bgcolor: '#00b894',
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#00a085',
            },
          }}
        >
          Modifier
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Informations personnelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Numéro criminel
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {criminal.numero_criminel}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Date de naissance
                </Typography>
                <Typography variant="body1">
                  {criminal.date_naissance
                    ? new Date(criminal.date_naissance).toLocaleDateString('fr-FR')
                    : 'Non renseignée'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Adresse
                </Typography>
                <Typography variant="body1">
                  {criminal.adresse}, {criminal.quartier}
                  {criminal.avenue && `, ${criminal.avenue}`}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Informations criminelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type d'infraction
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(() => {
                    let types: string[] = [];
                    if (Array.isArray(criminal.type_infraction)) {
                      types = criminal.type_infraction;
                    } else if (typeof criminal.type_infraction === 'string') {
                      try {
                        types = JSON.parse(criminal.type_infraction);
                      } catch {
                        // Si ce n'est pas du JSON valide, diviser par virgule
                        types = criminal.type_infraction.split(',').map((s: string) => s.trim()).filter(Boolean);
                      }
                    }
                    return types.map((type: string, idx: number) => (
                      <Chip key={idx} label={type} />
                    ));
                  })()}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Niveau de dangerosité
                </Typography>
                <Chip
                  label={criminal.niveau_dangerosite}
                  color={getDangerColor(criminal.niveau_dangerosite)}
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Score de dangerosité (IA)
                </Typography>
                <Typography variant="h6" color="error">
                  {criminal.danger_score}/100
                </Typography>
              </Grid>
              {criminal.bande && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Bande
                  </Typography>
                  <Typography variant="body1">{criminal.bande}</Typography>
                </Grid>
              )}
              {criminal.gang && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Gang
                  </Typography>
                  <Typography variant="body1">{criminal.gang}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 3,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Historique des cas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {cases.length === 0 ? (
              <Typography color="text.secondary">Aucun cas enregistré</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Numéro</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Lieu</TableCell>
                      <TableCell>Statut</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cases.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell>{caseItem.numero_cas}</TableCell>
                        <TableCell>
                          {new Date(caseItem.date_arrestation).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>{caseItem.lieu_arrestation}</TableCell>
                        <TableCell>
                          <Chip label={caseItem.statut_judiciaire} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Informations système
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Enregistré le
                </Typography>
                <Typography variant="body1">
                  {new Date(criminal.created_at).toLocaleString('fr-FR')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Récidiviste
                </Typography>
                <Chip
                  label={criminal.is_recidivist ? 'Oui' : 'Non'}
                  color={criminal.is_recidivist ? 'error' : 'default'}
                  size="small"
                />
              </Box>
              {criminal.latitude && criminal.longitude && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Coordonnées GPS
                  </Typography>
                  <Typography variant="body1">
                    {criminal.latitude}, {criminal.longitude}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CriminalDetail;

