import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { offlineService } from './offlineService';

// Intercepteur de requête
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si erreur réseau et que nous sommes offline
    if (
      (error.code === 'ERR_NETWORK' || !navigator.onLine) &&
      originalRequest &&
      !originalRequest._retry &&
      (originalRequest.method === 'POST' || originalRequest.method === 'PUT')
    ) {
      originalRequest._retry = true;

      // Déterminer le type d'opération et l'entité
      const url = originalRequest.url || '';
      const method = (originalRequest.method || 'GET').toUpperCase();

      let entity: 'criminal' | 'case' = 'criminal';
      let type: 'CREATE' | 'UPDATE' = 'CREATE';

      if (url.includes('/criminals')) {
        entity = 'criminal';
        type = method === 'POST' ? 'CREATE' : 'UPDATE';
      } else if (url.includes('/cases')) {
        entity = 'case';
        type = method === 'POST' ? 'CREATE' : 'UPDATE';
      } else {
        // Pas une opération que nous gérons offline
        return Promise.reject(error);
      }

      // Sauvegarder dans IndexedDB
      try {
        const operationId = await offlineService.saveOperation(
          type,
          entity,
          originalRequest.data,
          url,
          method as 'POST' | 'PUT'
        );

        // Retourner une réponse simulée pour que le code continue
        return Promise.resolve({
          data: {
            success: true,
            offline: true,
            operationId,
            message: 'Opération sauvegardée hors ligne. Synchronisation automatique à la reconnexion.',
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: originalRequest,
        } as any);
      } catch (saveError) {
        console.error('Erreur sauvegarde offline:', saveError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

