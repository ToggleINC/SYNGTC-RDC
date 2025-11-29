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
  Button,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Modal from '../../components/Modal';
import CaseForm from './CaseForm';
import CaseDetail from './CaseDetail';

interface Case {
  id: string;
  numero_cas: string;
  criminal_nom: string;
  criminal_prenom: string;
  date_arrestation: string;
  lieu_arrestation: string;
  statut_judiciaire: string;
}

const CaseList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [viewModal, setViewModal] = useState<{ open: boolean; caseId: string | null }>({
    open: false,
    caseId: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; caseId: string | null }>({
    open: false,
    caseId: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; caseId: string | null; caseNumber: string }>({
    open: false,
    caseId: null,
    caseNumber: '',
  });
  const [deleting, setDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: page + 1,
        limit: rowsPerPage,
      };
      if (statutFilter) params.statut_judiciaire = statutFilter;

      const response = await axios.get('/api/cases', { params });
      setCases(response.data.cases);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statutFilter]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleView = (caseId: string) => {
    setViewModal({ open: true, caseId });
  };

  const handleEdit = (caseId: string) => {
    setEditModal({ open: true, caseId });
  };

  const handleDelete = (caseItem: Case) => {
    setDeleteDialog({
      open: true,
      caseId: caseItem.id,
      caseNumber: caseItem.numero_cas,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.caseId) return;

    setDeleting(true);
    try {
      await axios.delete(`/api/cases/${deleteDialog.caseId}`);
      enqueueSnackbar('Cas supprimé avec succès', { variant: 'success' });
      setDeleteDialog({ open: false, caseId: null, caseNumber: '' });
      fetchCases();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors de la suppression',
        { variant: 'error' }
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClose = () => {
    setEditModal({ open: false, caseId: null });
    fetchCases();
  };

  // Filter cases locally by search term
  const filteredCases = cases.filter((caseItem) => {
    const searchLower = search.toLowerCase();
    return (
      caseItem.numero_cas?.toLowerCase().includes(searchLower) ||
      caseItem.criminal_nom?.toLowerCase().includes(searchLower) ||
      caseItem.criminal_prenom?.toLowerCase().includes(searchLower) ||
      caseItem.lieu_arrestation?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3436', mb: 3 }}>
        Gestion des Cas
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={statutFilter}
              label="Statut"
              onChange={(e) => setStatutFilter(e.target.value)}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="enquete">Enquête</MenuItem>
              <MenuItem value="jugement">Jugement</MenuItem>
              <MenuItem value="condamne">Condamné</MenuItem>
              <MenuItem value="libere">Libéré</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setEditModal({ open: true, caseId: null })}
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
          + Nouveau Cas
        </Button>
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
              <TableCell>Criminel</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucun cas
                </TableCell>
              </TableRow>
            ) : (
              filteredCases.map((caseItem) => (
                <TableRow key={caseItem.id} hover>
                  <TableCell>{caseItem.numero_cas}</TableCell>
                  <TableCell>
                    {caseItem.criminal_nom} {caseItem.criminal_prenom}
                  </TableCell>
                  <TableCell>
                    {new Date(caseItem.date_arrestation).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{caseItem.lieu_arrestation}</TableCell>
                  <TableCell>
                    <Chip label={caseItem.statut_judiciaire} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="Voir les détails">
                        <IconButton
                          size="small"
                          onClick={() => handleView(caseItem.id)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(caseItem.id)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(caseItem)}
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
          count={cases.length}
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
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, caseId: null, caseNumber: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Supprimer le cas</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le cas <strong>{deleteDialog.caseNumber}</strong> ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, caseId: null, caseNumber: '' })}>
            Annuler
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, caseId: null })}
        title="Détails du Cas"
        maxWidth="md"
      >
        <CaseDetail caseId={viewModal.caseId || ''} />
      </Modal>

      <Modal
        open={editModal.open}
        onClose={handleEditClose}
        title={editModal.caseId ? 'Modifier le cas' : 'Nouveau cas'}
      >
        <CaseForm
          id={editModal.caseId || undefined}
          onSuccess={handleEditClose}
        />
      </Modal>
    </Box>
  );
};

export default CaseList;

