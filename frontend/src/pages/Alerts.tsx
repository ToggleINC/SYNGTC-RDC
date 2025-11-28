import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { io } from 'socket.io-client';
import axios from 'axios';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [prioriteFilter, setPrioriteFilter] = useState('');

  useEffect(() => {
    fetchAlerts();

    // Connexion Socket.io pour les alertes en temps réel
    const socket = io('http://localhost:5000');

    socket.on('new-alert', (alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    socket.on('recidivist-alert', (data) => {
      setAlerts((prev) => [
        {
          id: Date.now(),
          type: 'recidivist',
          titre: 'Récidiviste détecté',
          description: `Le criminel ${data.criminal.numero_criminel} a été arrêté à nouveau`,
          priorite: 'elevee',
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const params: any = {};
      if (typeFilter) params.type = typeFilter;
      if (prioriteFilter) params.priorite = prioriteFilter;

      const response = await axios.get('/api/alerts', { params });
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchAlerts();
  }, [typeFilter, prioriteFilter]);

  // Filter alerts locally by search term
  const filteredAlerts = alerts.filter((alert) => {
    const searchLower = search.toLowerCase();
    return (
      alert.titre?.toLowerCase().includes(searchLower) ||
      alert.description?.toLowerCase().includes(searchLower)
    );
  });

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'critique':
        return 'error';
      case 'elevee':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3436', mb: 3 }}>
        Alertes
      </Typography>

      {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="dangerous_criminal">Criminel dangereux</MenuItem>
            <MenuItem value="recidivist">Récidiviste</MenuItem>
            <MenuItem value="gang_activity">Activité de gang</MenuItem>
            <MenuItem value="zone_rouge">Zone rouge</MenuItem>
            <MenuItem value="other">Autre</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Priorité</InputLabel>
          <Select
            value={prioriteFilter}
            label="Priorité"
            onChange={(e) => setPrioriteFilter(e.target.value)}
          >
            <MenuItem value="">Toutes</MenuItem>
            <MenuItem value="faible">Faible</MenuItem>
            <MenuItem value="moyenne">Moyenne</MenuItem>
            <MenuItem value="elevee">Élevée</MenuItem>
            <MenuItem value="critique">Critique</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          borderRadius: 3,
          border: '1px solid #e0e0e0',
        }}
      >
        <List>
          {filteredAlerts.length === 0 ? (
            <ListItem>
              <ListItemText primary="Aucune alerte" />
            </ListItem>
          ) : (
            filteredAlerts.map((alert) => (
              <ListItem key={alert.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{alert.titre}</Typography>
                      <Chip
                        label={alert.priorite}
                        color={getPriorityColor(alert.priorite)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary" component="span">
                        {alert.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="span">
                        {new Date(alert.created_at).toLocaleString('fr-FR')}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Alerts;
