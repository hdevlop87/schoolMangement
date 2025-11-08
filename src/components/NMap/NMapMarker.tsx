"use client";

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

const createIcon = (color: string, size: number = 32) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `)}`,
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
  popupAnchor: [0, -size],
});

interface NMapMarkerProps {
  position: [number, number];
  color?: string;
  size?: number;
  title?: string;
  content?: React.ReactNode;
  icon?: Icon;
  onClick?: () => void;
}

const NMapMarker: React.FC<NMapMarkerProps> = ({
  position,
  color = '#6b7280',
  size = 32,
  title,
  content,
  icon,
  onClick
}) => {
  const markerIcon = icon || createIcon(color, size);

  return (
    <Marker
      position={position}
      icon={markerIcon}
      eventHandlers={{
        click: onClick
      }}
    >
      {(title || content) && (
        <Popup>
          <div className="min-w-48">
            {title && (
              <h3 className="font-semibold mb-2">{title}</h3>
            )}
            {content}
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default NMapMarker;