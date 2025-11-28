import React, { useEffect, useState } from 'react';
import { Box, Chip, IconButton, Tooltip, Badge } from '@mui/material';
import {
  CloudOff as CloudOffIcon,
  CloudDone as CloudDoneIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import { offlineService } from '../services/offlineService';
import { syncService } from '../services/syncService';
import { useSnackbar } from 'notistack';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(offlineService.getOnlineStatus());
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Écouter les changements d'état online/offline
    const unsubscribe = offlineService.onOnlineStatusChange((online) => {
      setIsOnline(online);
      if (online) {
        enqueueSnackbar('Connexion rétablie. Synchronisation en cours...', {
          variant: 'info',
        });
        handleSync();
      } else {
        enqueueSnackbar('Mode hors ligne activé', { variant: 'warning' });
      }
    });

    // Mettre à jour le compteur périodiquement
    const updatePendingCount = async () => {
      const count = await offlineService.getPendingCount();
      setPendingCount(count);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [enqueueSnackbar]);

  const handleSync = async () => {
    if (syncing || !isOnline) return;

    setSyncing(true);
    try {
      await syncService.sync();
      const count = await offlineService.getPendingCount();
      setPendingCount(count);
      if (count === 0) {
        enqueueSnackbar('Toutes les opérations ont été synchronisées', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(`${count} opération(s) en attente de synchronisation`, {
          variant: 'info',
        });
      }
    } catch (error) {
      enqueueSnackbar('Erreur lors de la synchronisation', { variant: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1300,
        display: 'flex',
        gap: 1,
        alignItems: 'center',
      }}
    >
      {!isOnline && (
        <Chip
          icon={<CloudOffIcon />}
          label="Hors ligne"
          color="warning"
          size="small"
        />
      )}

      {isOnline && pendingCount > 0 && (
        <Tooltip title={`${pendingCount} opération(s) en attente`}>
          <Badge badgeContent={pendingCount} color="error">
            <Chip
              icon={<CloudDoneIcon />}
              label="En ligne"
              color="success"
              size="small"
            />
          </Badge>
        </Tooltip>
      )}

      {isOnline && pendingCount === 0 && (
        <Chip
          icon={<CloudDoneIcon />}
          label="En ligne"
          color="success"
          size="small"
        />
      )}

      {pendingCount > 0 && (
        <Tooltip title="Synchroniser maintenant">
          <IconButton
            size="small"
            onClick={handleSync}
            disabled={syncing || !isOnline}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <SyncIcon
              sx={{
                animation: syncing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default OfflineIndicator;

