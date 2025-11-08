"use client";

import React, { useEffect } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultStatusColors = {
  active: '#10b981',
  warning: '#f59e0b',
  inactive: '#6b7280',
  error: '#ef4444',
};

const createCustomIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

interface NMapMarkerData {
  id: string;
  position: [number, number];
  status?: string;
  title?: string;
  content?: React.ReactNode;
  icon?: Icon;
  color?: string;
}

interface NMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: NMapMarkerData[];
  height?: string;
  width?: string;
  className?: string;
  tileLayerUrl?: string;
  attribution?: string;
  statusColors?: Record<string, string>;
  children?: React.ReactNode;
}

const NMap: React.FC<NMapProps> = ({
  center,
  zoom = 7,
  markers = [],
  height = '100%',
  width = '100%',
  className = '',
  tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  statusColors = defaultStatusColors,
  children
}) => {
  // Auto-center on first marker or default to Morocco
  const mapCenter = center || (markers.length > 0 ? markers[0].position : [31.7917, -7.0926]); // Morocco coordinates
  const mapZoom = zoom;

  return (
    <LeafletMapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height, width }}
      className={`z-0 ${className}`}
    >
      <MapController center={mapCenter} zoom={mapZoom} />

      <TileLayer
        url={tileLayerUrl}
        attribution={attribution}
      />

      {markers.map((marker) => {
        const markerColor = marker.color || statusColors[marker.status || ''] || statusColors.inactive;

        return (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={marker.icon || createCustomIcon(markerColor)}
          >
            {(marker.title || marker.content) && (
              <Popup>
                <div className="min-w-48">
                  {marker.title && (
                    <h3 className="font-semibold mb-2">{marker.title}</h3>
                  )}
                  {marker.content}
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}

      {children}
    </LeafletMapContainer>
  );
};

export default NMap;