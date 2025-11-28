import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Chip,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Backup as BackupIcon,
  GetApp as GetAppIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

interface Backup {
  filename: string;
  date: string;
  filepath: string;
  size: number;
  created: string;
}

const BackupList: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/backup/list');
      setBackups(response.data.backups);
    } catch (error: any) {
      console.error('Erreur récupération backups:', error);
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors de la récupération des backups',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBackup = async () => {
    setGenerating(true);
    try {
      const response = await axios.post('/api/backup/generate');
      enqueueSnackbar('Backup généré avec succès', { variant: 'success' });
      fetchBackups();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors de la génération du backup',
        { variant: 'error' }
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (date: string, filename: string) => {
    try {
      const response = await axios.get(`/api/backup/download/${date}/${filename}`, {
        responseType: 'blob',
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      enqueueSnackbar('Téléchargement démarré', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors du téléchargement',
        { variant: 'error' }
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3436' }}>
          Gestion des Backups
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchBackups}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <BackupIcon />}
            onClick={handleGenerateBackup}
            disabled={generating}
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
            {generating ? 'Génération...' : 'Générer Backup'}
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Les backups quotidiens sont générés automatiquement à 23h59 chaque jour. 
        Vous pouvez également générer un backup manuel à tout moment.
      </Alert>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e0e0e0',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Nom du fichier</TableCell>
                <TableCell>Taille</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : backups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 4 }}>
                      <GetAppIcon sx={{ fontSize: 48, color: '#b2bec3', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Aucun backup disponible
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Cliquez sur "Générer Backup" pour créer votre premier backup
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                backups.map((backup, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Chip
                        label={backup.date}
                        size="small"
                        sx={{
                          bgcolor: '#f5f6fa',
                          color: '#2d3436',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {backup.filename}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(backup.size)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(backup.created).toLocaleString('fr-FR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(backup.date, backup.filename)}
                        color="primary"
                        sx={{
                          '&:hover': {
                            bgcolor: '#00b89415',
                          },
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default BackupList;

