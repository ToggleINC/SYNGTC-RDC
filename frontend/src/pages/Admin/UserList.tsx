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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import UserForm from './UserForm';

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  poste: string;
  region: string;
  telephone: string;
  is_active: boolean;
  created_at: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users', {
        params: {
          search: search || undefined,
          role: roleFilter || undefined,
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setUsers(response.data.users);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error('Erreur récupération:', error);
      enqueueSnackbar('Erreur lors de la récupération des utilisateurs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, roleFilter, enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenForm = (user?: User) => {
    setSelectedUser(user || null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`/api/users/${userToDelete}`);
      enqueueSnackbar('Utilisateur supprimé avec succès', { variant: 'success' });
      setDeleteDialog(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors de la suppression',
        { variant: 'error' }
      );
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/users/${userId}`, { is_active: !currentStatus });
      enqueueSnackbar(
        `Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`,
        { variant: 'success' }
      );
      fetchUsers();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || 'Erreur lors de la modification',
        { variant: 'error' }
      );
    }
  };

  const getRoleLabel = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin_ministere: 'Admin National',
      admin_pnc: 'Admin PNC',
      admin_anr: 'Admin ANR',
      superviseur: 'Superviseur',
      agent: 'Agent',
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string) => {
    if (role.includes('admin')) return 'primary';
    if (role === 'superviseur') return 'info';
    return 'default';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3436', mb: 3 }}>
        Gestion des Utilisateurs
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 300 }}>
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
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Rôle</InputLabel>
            <Select
              value={roleFilter}
              label="Rôle"
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
              <MenuItem value="superviseur">Superviseur</MenuItem>
              <MenuItem value="admin_pnc">Admin PNC</MenuItem>
              <MenuItem value="admin_anr">Admin ANR</MenuItem>
              <MenuItem value="admin_ministere">Admin Ministère</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
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
          + Nouvel Utilisateur
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
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Poste</TableCell>
              <TableCell>Région</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date création</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    {user.nom} {user.prenom}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.poste}</TableCell>
                  <TableCell>{user.region}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Actif' : 'Inactif'}
                      color={user.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleActive(user.id, user.is_active)}
                      color={user.is_active ? 'default' : 'success'}
                    >
                      {user.is_active ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenForm(user)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(user.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
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

      {/* Formulaire utilisateur */}
      <UserForm
        open={openForm}
        onClose={handleCloseForm}
        user={selectedUser}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;

