"use client";

import React from 'react';
import { Phone, Calendar, CreditCard, Shield } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import { NSectionInfo } from '@/components/NSectionCard';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import {NStatusBadge} from '@/components/NStatusBadge';

const DriverCard = ({ data }) => {
   const { t } = useTranslation();
   const driver = data;

   return (
      <div className="flex items-start gap-4">
         <div className="shrink-0">
            <AvatarCell src={driver?.image} name={driver.name} size="lg" showName={false} />
         </div>

         <div className="flex-1 flex flex-col gap-2">

            <div className='flex flex-col'>
               <Label className="text-md font-bold">
                  {driver.name}
               </Label>

               <Label className="text-sm font-medium text-primary">
                  {driver.licenseNumber}
               </Label>
            </div>

            <div className="space-y-2">

               <NSectionInfo
                  icon={Phone}
                  label={t('drivers.table.phone')}
                  value={driver.phone}
               />

               <NSectionInfo
                  icon={CreditCard}
                  label={t('drivers.table.licenseType')}
                  value={driver.licenseType}
               />

               <NSectionInfo
                  icon={Shield}
                  label={t('drivers.table.licenseExpiry')}
                  value={new Date(driver.licenseExpiry).toLocaleDateString()}
               />

               <NSectionInfo
                  icon={Calendar}
                  label={t('drivers.table.hireDate')}
                  value={new Date(driver.hireDate).toLocaleDateString()}
               />



            </div>
         </div>
      </div>
   );
};

export default DriverCard;