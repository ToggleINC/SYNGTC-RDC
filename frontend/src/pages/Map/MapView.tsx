import React, { useEffect, useState, useCallback } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import MapBounds from './MapBounds';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import type { LatLngExpression } from 'leaflet';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

const DefaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView: React.FC = () => {
  const [mapData, setMapData] = useState<any[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMapData = useCallback(async () => {
    try {
      const response = await axios.get('/api/locations/map');
      const data = response.data.mapData || [];
      console.log('Données reçues de l\'API:', data);
      console.log('Nombre de criminels:', data.filter((item: any) => item.type === 'criminal').length);
      console.log('Nombre de cas:', data.filter((item: any) => item.type === 'case').length);
      
      // Vérifier les coordonnées
      data.forEach((item: any) => {
        if (item.location) {
          console.log(`Coordonnées ${item.type} ${item.id}:`, {
            lat: item.location.latitude,
            lng: item.location.longitude,
            latType: typeof item.location.latitude,
            lngType: typeof item.location.longitude,
            latParsed: parseFloat(item.location.latitude),
            lngParsed: parseFloat(item.location.longitude),
          });
        } else {
          console.warn(`Item ${item.id} n'a pas de location:`, item);
        }
      });
      
      setMapData(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHotspots = useCallback(async () => {
    try {
      const response = await axios.get('/api/locations/hotspots');
      setHotspots(response.data.hotspots);
    } catch (error) {
      console.error('Erreur hotspots:', error);
    }
  }, []);

  useEffect(() => {
    fetchMapData();
    fetchHotspots();
  }, [fetchMapData, fetchHotspots]);

  // Calculer le centre de la carte basé sur les marqueurs disponibles
  const calculateMapCenter = (): LatLngExpression => {
    const validItems = mapData.filter((item: any) => 
      item.location && 
      !isNaN(parseFloat(item.location.latitude)) && 
      !isNaN(parseFloat(item.location.longitude))
    );

    if (validItems.length === 0) {
      // Centre par défaut: Kinshasa
      return [-4.3276, 15.3136];
    }

    // Calculer le centre moyen de tous les marqueurs
    const avgLat = validItems.reduce((sum: number, item: any) => 
      sum + parseFloat(item.location.latitude), 0) / validItems.length;
    const avgLng = validItems.reduce((sum: number, item: any) => 
      sum + parseFloat(item.location.longitude), 0) / validItems.length;

    console.log('Centre calculé de la carte:', avgLat, avgLng);
    return [avgLat, avgLng];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const center = calculateMapCenter();
  
  // Afficher un résumé des données
  console.log('Résumé MapView:', {
    totalItems: mapData.length,
    criminals: mapData.filter((item: any) => item.type === 'criminal').length,
    cases: mapData.filter((item: any) => item.type === 'case').length,
    itemsWithValidCoords: mapData.filter((item: any) => 
      item.location && 
      !isNaN(parseFloat(item.location.latitude)) && 
      !isNaN(parseFloat(item.location.longitude))
    ).length,
    center: center,
  });

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3436', mb: 3 }}>
        Cartographie Criminelle
      </Typography>

      <Paper
        elevation={0}
        sx={{
          height: '600px',
          borderRadius: 3,
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {mapData.length === 0 && !loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Aucun marqueur à afficher
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Assurez-vous que les criminels et cas ont des coordonnées GPS
            </Typography>
          </Box>
        )}
        <MapContainer
          center={center}
          zoom={mapData.length > 0 ? 13 : 12}
          style={{ height: '100%', width: '100%' }}
          key={`map-${mapData.length}-${Array.isArray(center) ? center[0] : center.lat}-${Array.isArray(center) ? center[1] : center.lng}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Ajuster automatiquement la vue pour afficher tous les marqueurs */}
          <MapBounds items={mapData.filter((item: any) => item.location && item.location.latitude && item.location.longitude)} />

          {/* Zones rouges (hotspots) */}
          {hotspots.map((hotspot, idx) => (
            <Circle
              key={`hotspot-${idx}`}
              center={[hotspot.location.latitude, hotspot.location.longitude] as LatLngExpression}
              radius={500}
              pathOptions={{
                color: hotspot.niveau_danger === 'eleve' ? 'red' : 'orange',
                fillColor: hotspot.niveau_danger === 'eleve' ? 'red' : 'orange',
                fillOpacity: 0.3,
              }}
            >
              <Popup>
                <Typography variant="subtitle2">{hotspot.quartier}</Typography>
                <Typography variant="body2">
                  {hotspot.nombre_cas} cas enregistrés
                </Typography>
              </Popup>
            </Circle>
          ))}

          {/* Marqueurs des criminels */}
          {mapData
            .filter((item) => {
              const isValid = item.type === 'criminal' && 
                             item.location && 
                             item.location.latitude && 
                             item.location.longitude &&
                             !isNaN(parseFloat(item.location.latitude)) &&
                             !isNaN(parseFloat(item.location.longitude));
              if (isValid) {
                console.log('Marqueur criminel valide:', {
                  id: item.id,
                  lat: item.location.latitude,
                  lng: item.location.longitude,
                  nom: item.nom
                });
              }
              return isValid;
            })
            .slice(0, 100)
            .map((item) => {
              const lat = parseFloat(item.location.latitude);
              const lng = parseFloat(item.location.longitude);
              console.log('Création marqueur criminel à:', lat, lng, 'Type lat:', typeof lat, 'Type lng:', typeof lng);
              
              // Vérifier que les coordonnées sont valides
              if (isNaN(lat) || isNaN(lng)) {
                console.error('Coordonnées invalides pour criminel:', item.id, lat, lng);
                return null;
              }
              
              return (
                <Marker
                  key={`criminal-${item.id}`}
                  position={[lat, lng] as LatLngExpression}
                  icon={DefaultIcon}
                >
                  <Popup>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Criminel: {item.nom}
                    </Typography>
                    <Typography variant="body2">
                      {item.numero_criminel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.quartier}
                    </Typography>
                    <Typography variant="body2">
                      Score: {item.danger_score}
                    </Typography>
                  </Popup>
                </Marker>
              );
            })}

          {/* Marqueurs des cas */}
          {mapData
            .filter((item) => {
              const isValid = item.type === 'case' && 
                             item.location && 
                             item.location.latitude && 
                             item.location.longitude &&
                             !isNaN(parseFloat(item.location.latitude)) &&
                             !isNaN(parseFloat(item.location.longitude));
              if (isValid) {
                console.log('Marqueur cas valide:', {
                  id: item.id,
                  lat: item.location.latitude,
                  lng: item.location.longitude,
                  numero: item.numero_criminel
                });
              }
              return isValid;
            })
            .slice(0, 100)
            .map((item) => {
              const lat = parseFloat(item.location.latitude);
              const lng = parseFloat(item.location.longitude);
              console.log('Création marqueur cas à:', lat, lng, 'Type lat:', typeof lat, 'Type lng:', typeof lng);
              
              // Vérifier que les coordonnées sont valides
              if (isNaN(lat) || isNaN(lng)) {
                console.error('Coordonnées invalides pour cas:', item.id, lat, lng);
                return null;
              }
              
              return (
                <Marker
                  key={`case-${item.id}`}
                  position={[lat, lng] as LatLngExpression}
                  icon={DefaultIcon}
                >
                  <Popup>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                      Cas: {item.numero_criminel}
                    </Typography>
                    <Typography variant="body2">
                      Criminel: {item.nom}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lieu: {item.quartier}
                    </Typography>
                    <Typography variant="body2">
                      Statut: {item.niveau_dangerosite}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                      {new Date(item.date).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default MapView;

