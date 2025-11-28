import { offlineService } from './offlineService';

class SyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;

  constructor() {
    this.setupAutoSync();
  }

  private setupAutoSync() {
    // Écouter les changements d'état online/offline
    offlineService.onOnlineStatusChange((isOnline) => {
      if (isOnline) {
        // Démarrer la synchronisation immédiatement quand on revient en ligne
        this.sync();
      }
    });

    // Vérifier périodiquement s'il y a des opérations en attente
    this.syncInterval = setInterval(() => {
      if (offlineService.getOnlineStatus() && !this.isSyncing) {
        this.sync();
      }
    }, 30000); // Toutes les 30 secondes
  }

  public async sync(): Promise<void> {
    if (this.isSyncing || !offlineService.getOnlineStatus()) {
      return;
    }

    this.isSyncing = true;
    try {
      await offlineService.syncPendingOperations();
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  public async getPendingCount(): Promise<number> {
    return await offlineService.getPendingCount();
  }

  public destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

export const syncService = new SyncService();

