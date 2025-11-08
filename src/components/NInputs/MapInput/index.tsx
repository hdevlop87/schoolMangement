"use client";

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { MapPin, Trash2, LocateFixed } from 'lucide-react';
import { MapInputProps } from '../type';
import BaseInput from '../Box';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useLanguage';

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});


const MapInput: React.FC<MapInputProps> = ({
  value,
  onChange,
  placeholder = "Click on map to select location",
  height = "300px",
  disabled = false,
  showClearButton = true,
  className = "",
  variant = 'default',
  status = 'default',
  ...props
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Default center
  const defaultCenter: [number, number] = [48.71291, 44.52693];
  
  // Convert value to position format
  const position: [number, number] | null = value ? [value.lat, value.lng] : null;

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (disabled) return;
    onChange({ lat, lng });
  }, [disabled, onChange]);

  const getCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange({ lat: latitude, lng: longitude });
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Error getting location');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const clearLocation = () => {
    onChange(null);
  };

  return (
    <BaseInput variant={variant} status={status} className={cn('flex-col gap-2 p-3', className)}>
      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={disabled || isLoading}
        >
          <LocateFixed className="h-4 w-4 mr-2" />
          {isLoading ? 'Locating...' : 'Current Location'}
        </Button>
        
        {showClearButton && position && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearLocation}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Map */}
      <DynamicMap
        center={defaultCenter}
        position={position}
        onLocationSelect={handleMapClick}
        disabled={disabled}
        height={height}
      />

      {/* Coordinates Display */}
      {position ? (
        <div className="text-sm text-muted-foreground text-center">
          Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center">
          {placeholder}
        </div>
      )}
      
      {!disabled && (
        <div className="text-xs text-muted-foreground">
          Click anywhere on the map to set location
        </div>
      )}
    </BaseInput>
  );
};

export default MapInput;