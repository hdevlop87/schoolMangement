"use client";

import React from 'react';
import { Popup } from 'react-leaflet';

interface NMapPopupProps {
  position: [number, number];
  title?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  closeButton?: boolean;
  autoClose?: boolean;
  closeOnEscapeKey?: boolean;
}

const NMapPopup: React.FC<NMapPopupProps> = ({
  position,
  title,
  content,
  children,
  className = '',
  closeButton = true,
  autoClose = true,
  closeOnEscapeKey = true
}) => {
  return (
    <Popup
      position={position}
      closeButton={closeButton}
      autoClose={autoClose}
      closeOnEscapeKey={closeOnEscapeKey}
    >
      <div className={`min-w-48 ${className}`}>
        {title && (
          <h3 className="font-semibold mb-2">{title}</h3>
        )}
        {content}
        {children}
      </div>
    </Popup>
  );
};

export default NMapPopup;