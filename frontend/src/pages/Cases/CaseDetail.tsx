import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface CaseDetailProps {
  caseId: string;
}

const CaseDetail: React.FC<CaseDetailProps> = ({ caseId }) => {
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      fetchCase();
    }
  }, [caseId]);

  const fetchCase = async () => {
    try {
      const response = await axios.get(`/api/cases/${caseId}`);
      setCaseData(response.data.case);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!caseData) {
    return <Typography>Cas introuvable</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Informations du cas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Numéro de cas
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {caseData.numero_cas}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Statut judiciaire
              </Typography>
              <Chip label={caseData.statut_judiciaire} size="small" sx={{ mt: 0.5 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Date d'arrestation
              </Typography>
              <Typography variant="body1">
                {new Date(caseData.date_arrestation).toLocaleString('fr-FR')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Lieu d'arrestation
              </Typography>
              <Typography variant="body1">{caseData.lieu_arrestation}</Typography>
            </Grid>
            {caseData.latitude && caseData.longitude && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Coordonnées GPS
                </Typography>
                <Typography variant="body1">
                  {caseData.latitude}, {caseData.longitude}
                </Typography>
              </Grid>
            )}
            {caseData.description && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{caseData.description}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Informations du criminel
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Nom complet
              </Typography>
              <Typography variant="body1">
                {caseData.nom} {caseData.prenom}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Numéro criminel
              </Typography>
              <Typography variant="body1">{caseData.numero_criminel}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Informations système
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Poste de police
              </Typography>
              <Typography variant="body1">{caseData.poste_police}</Typography>
            </Grid>
            {caseData.agent_arrestant && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Agent arrêtant
                </Typography>
                <Typography variant="body1">{caseData.agent_arrestant}</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Enregistré le
              </Typography>
              <Typography variant="body1">
                {new Date(caseData.created_at).toLocaleString('fr-FR')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseDetail;

