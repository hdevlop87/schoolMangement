import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

interface MapComponentProps {
  center: [number, number];
  position: [number, number] | null;
  onLocationSelect: (lat: number, lng: number) => void;
  disabled: boolean;
  height: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  position,
  onLocationSelect,
  disabled,
  height
}) => {
  return (
    <div
      style={{ height }}
      className="border rounded-lg overflow-hidden w-full"
    >
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {!disabled && (
          <MapClickHandler onLocationSelect={onLocationSelect} />
        )}

        {position && (
          <Marker position={position} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;