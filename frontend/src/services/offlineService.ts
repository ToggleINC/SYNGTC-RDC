import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PendingOperation {
  id: string;
  type: 'CREATE' | 'UPDATE';
  entity: 'criminal' | 'case';
  data: any;
  timestamp: number;
  synced: boolean;
  url: string;
  method: 'POST' | 'PUT';
}

interface OfflineDB extends DBSchema {
  operations: {
    key: string;
    value: PendingOperation;
  };
}

class OfflineService {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private isOnline: boolean = navigator.onLine;
  private listeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    this.init();
    this.setupOnlineListeners();
  }

  private async init() {
    try {
      this.db = await openDB<OfflineDB>('syngtc-offline', 1, {
        upgrade(db) {
          const operationsStore = db.createObjectStore('operations', {
            keyPath: 'id',
          });
          // Créer les index pour améliorer les performances de recherche
          // Utiliser 'any' pour contourner les restrictions de typage strict
          (operationsStore as any).createIndex('by-synced', 'synced');
          (operationsStore as any).createIndex('by-timestamp', 'timestamp');
        },
      });
    } catch (error) {
      console.error('Erreur initialisation IndexedDB:', error);
    }
  }

  private setupOnlineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      this.syncPendingOperations();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach((listener) => listener(isOnline));
  }

  public onOnlineStatusChange(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public async saveOperation(
    type: 'CREATE' | 'UPDATE',
    entity: 'criminal' | 'case',
    data: any,
    url: string,
    method: 'POST' | 'PUT'
  ): Promise<string> {
    if (!this.db) {
      await this.init();
      if (!this.db) {
        throw new Error('IndexedDB non disponible');
      }
    }

    const operation: PendingOperation = {
      id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      entity,
      data,
      timestamp: Date.now(),
      synced: false,
      url,
      method,
    };

    await this.db.put('operations', operation);
    return operation.id;
  }

  public async getPendingOperations(): Promise<PendingOperation[]> {
    if (!this.db) {
      await this.init();
      if (!this.db) {
        return [];
      }
    }

    // Récupérer toutes les opérations et filtrer celles non synchronisées
    const allOperations = await this.db.getAll('operations');
    return allOperations.filter(op => !op.synced);
  }

  public async getPendingCount(): Promise<number> {
    const operations = await this.getPendingOperations();
    return operations.length;
  }

  public async markAsSynced(operationId: string): Promise<void> {
    if (!this.db) return;

    const operation = await this.db.get('operations', operationId);
    if (operation) {
      operation.synced = true;
      await this.db.put('operations', operation);
    }
  }

  public async deleteOperation(operationId: string): Promise<void> {
    if (!this.db) return;
    await this.db.delete('operations', operationId);
  }

  public async clearSyncedOperations(): Promise<void> {
    if (!this.db) return;

    // Récupérer toutes les opérations synchronisées et les supprimer
    const allOperations = await this.db.getAll('operations');
    const synced = allOperations.filter(op => op.synced);

    const tx = this.db.transaction('operations', 'readwrite');
    await Promise.all(synced.map((op) => tx.store.delete(op.id)));
  }

  public async syncPendingOperations(): Promise<void> {
    if (!this.isOnline) {
      return;
    }

    const operations = await this.getPendingOperations();
    if (operations.length === 0) {
      return;
    }

    // Importer axios dynamiquement pour éviter les dépendances circulaires
    const axios = (await import('axios')).default;

    for (const operation of operations) {
      try {
        if (operation.method === 'POST') {
          await axios.post(operation.url, operation.data);
        } else {
          await axios.put(operation.url, operation.data);
        }

        // Marquer comme synchronisé
        await this.markAsSynced(operation.id);

        // Supprimer après un délai pour permettre le nettoyage
        setTimeout(() => {
          this.deleteOperation(operation.id);
        }, 1000);
      } catch (error: any) {
        // Si erreur réseau, garder l'opération en attente
        if (!error.response || error.code === 'ERR_NETWORK') {
          console.error('Erreur sync opération:', operation.id, error);
          // Ne pas marquer comme synced, restera en attente
        } else {
          // Erreur serveur (400, 500, etc.) - supprimer l'opération
          console.error('Erreur serveur pour opération:', operation.id, error);
          await this.deleteOperation(operation.id);
        }
      }
    }
  }
}

export const offlineService = new OfflineService();
export type { PendingOperation };

