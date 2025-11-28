import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import CriminalForm from './CriminalForm';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MuiButton,
  Tooltip,
} from '@mui/material';

interface Criminal {
  id: string;
  numero_criminel: string;
  nom: string;
  prenom: string;
  quartier: string;
  type_infraction: string[];
  niveau_dangerosite: string;
  danger_score: number;
  created_at: string;
}

const CriminalList: React.FC = () => {
  const [criminals, setCriminals] = useState<Criminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [deleteAllDialog, setDeleteAllDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; criminalId: string | null; criminalName: string }>({
    open: false,
    criminalId: null,
    criminalName: '',
  });
  const [editModal, setEditModal] = useState<{ open: boolean; criminalId: string | null }>({
    open: false,
    criminalId: null,
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const isAdmin = user?.role && ['admin_pnc', 'admin_anr', 'admin_ministere'].includes(user.role);

  const fetchCriminals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/criminals/search', {
        params: {
          q: search || undefined,
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setCriminals(response.data.criminals);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error('Erreur récupération:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    fetchCriminals();
  }, [fetchCriminals]);

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

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete('/api/criminals/all');
      enqueueSnackbar(response.data.message || 'Tous les criminels ont été supprimés', {
        variant: 'success',
      });
      setDeleteAllDialog(false);
      fetchCriminals();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors de la suppression',
        { variant: 'error' }
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = (criminal: Criminal) => {
    setDeleteDialog({
      open: true,
      criminalId: criminal.id,
      criminalName: `${criminal.nom} ${criminal.prenom}`,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.criminalId) return;

    try {
      await axios.delete(`/api/criminals/${deleteDialog.criminalId}`);
      enqueueSnackbar('Criminel supprimé avec succès', { variant: 'success' });
      setDeleteDialog({ open: false, criminalId: null, criminalName: '' });
      fetchCriminals();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors de la suppression',
        { variant: 'error' }
      );
    }
  };

  const handleEdit = (criminalId: string) => {
    setEditModal({ open: true, criminalId });
  };

  const handleEditClose = () => {
    setEditModal({ open: false, criminalId: null });
    fetchCriminals();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3436', mb: 3 }}>
        Gestion des Criminels
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAdmin && total > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteAllDialog(true)}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
              }}
            >
              Tout supprimer
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setEditModal({ open: true, criminalId: null })}
            sx={{
              bgcolor: '#00b894',
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#00a085',
              },
            }}
          >
            + Nouveau Criminel
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e0e0e0',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Quartier</TableCell>
              <TableCell>Type d'infraction</TableCell>
              <TableCell>Dangerosité</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : criminals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun résultat
                </TableCell>
              </TableRow>
            ) : (
              criminals.map((criminal) => (
                <TableRow key={criminal.id} hover>
                  <TableCell>{criminal.numero_criminel}</TableCell>
                  <TableCell>
                    {criminal.nom} {criminal.prenom}
                  </TableCell>
                  <TableCell>{criminal.quartier}</TableCell>
                  <TableCell>
                    {criminal.type_infraction.slice(0, 2).map((type, idx) => (
                      <Chip key={idx} label={type} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={criminal.niveau_dangerosite}
                      color={getDangerColor(criminal.niveau_dangerosite)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{criminal.danger_score}</TableCell>
                  <TableCell>
                    {new Date(criminal.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="Voir les détails">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/criminels/${criminal.id}`)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(criminal.id)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(criminal)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <Dialog
        open={deleteAllDialog}
        onClose={() => setDeleteAllDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Supprimer tous les criminels</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer tous les criminels ? Cette action est irréversible.
            Tous les cas associés seront également supprimés.
            <br />
            <strong>Nombre de criminels à supprimer : {total}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setDeleteAllDialog(false)} disabled={deleting}>
            Annuler
          </MuiButton>
          <MuiButton
            onClick={handleDeleteAll}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleting ? 'Suppression...' : 'Supprimer tout'}
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, criminalId: null, criminalName: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Supprimer le criminel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer <strong>{deleteDialog.criminalName}</strong> ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setDeleteDialog({ open: false, criminalId: null, criminalName: '' })}>
            Annuler
          </MuiButton>
          <MuiButton
            onClick={confirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Supprimer
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Modal
        open={editModal.open}
        onClose={handleEditClose}
        title={editModal.criminalId ? 'Modifier le criminel' : 'Nouveau criminel'}
      >
        <CriminalForm
          id={editModal.criminalId || undefined}
          onSuccess={handleEditClose}
        />
      </Modal>
    </Box>
  );
};

export default CriminalList;

