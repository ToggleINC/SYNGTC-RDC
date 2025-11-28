import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapBoundsProps {
  items: Array<{ location: { latitude: number; longitude: number } }>;
}

const MapBounds: React.FC<MapBoundsProps> = ({ items }) => {
  const map = useMap();

  useEffect(() => {
    if (items.length === 0) return;

    const validItems = items.filter(
      (item) =>
        item.location &&
        !isNaN(item.location.latitude) &&
        !isNaN(item.location.longitude)
    );

    if (validItems.length === 0) return;

    const bounds = L.latLngBounds(
      validItems.map((item) => [
        item.location.latitude,
        item.location.longitude,
      ])
    );

    // Ajuster la vue pour inclure tous les marqueurs avec un padding
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
    });
  }, [items, map]);

  return null;
};

export default MapBounds;

