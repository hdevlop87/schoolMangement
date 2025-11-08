"use client";

import React from 'react';
import { Car, Hash, Gauge, User } from 'lucide-react';
import { NSectionInfo } from '@/components/NSectionCard';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { NStatusBadge } from '@/components/NStatusBadge';

const VehicleCard = ({ data }: any) => {
  const { t } = useTranslation();

  if (!data) return null;

  const statusMap: Record<string, string> = {
    active: t('vehicles.status.active'),
    inactive: t('vehicles.status.inactive'),
    maintenance: t('vehicles.status.maintenance'),
    retired: t('vehicles.status.retired'),
  };

  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center dark:bg-primary">
          <Car className="w-6 h-6 text-primary dark:text-white" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <Label className="text-md font-bold">
          {data.name}
        </Label>
        <p className="text-sm text-muted-foreground -mt-1">
          {data.brand} {data.model} ({data.year})
        </p>

        <div className="space-y-2">
          <NSectionInfo
            icon={Hash}
            iconColor="text-primary"
            label={t('vehicles.card.licensePlate')}
            value={data.licensePlate}
            valueColor="text-primary uppercase font-medium"
          />

          {data.currentMileage && (
            <NSectionInfo
              icon={Gauge}
              iconColor="text-muted-foreground"
              label={t('vehicles.card.currentMileage')}
              value={`${parseFloat(data.currentMileage).toLocaleString()} km`}
              valueColor="text-muted-foreground"
            />
          )}

          {data.driver?.name && (
            <NSectionInfo
              icon={User}
              iconColor="text-muted-foreground"
              label={t('vehicles.card.driver')}
              value={data.driver.name}
              valueColor="text-foreground font-medium"
            />
          )}

          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              {t('vehicles.table.status')}:
            </Label>
            <NStatusBadge variant='text' status={data.status} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;