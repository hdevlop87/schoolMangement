'use client'

import React from 'react';
import { Shield, Key, Clock, AlertTriangle, Users } from 'lucide-react';
import FormInput from '@/components/NForm/FormInput';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
const SecuritySection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 font-semibold text-sm">
        <Shield className="h-4 w-4" />
        <Label className='text-lg'> {t('settings.security.title')} </Label>
      </div>

      <div className="flex flex-col gap-3">
        <FormInput
          type="switch"
          name="twoFactorAuth"
          label={t('settings.security.twoFactorAuth') }
          icon={Key}
          iconColor="#3b82f6"
          variant="ghost"
        />

        <FormInput
          type="switch"
          name="sessionTimeout"
          label={t('settings.security.sessionTimeout') }
          icon={Clock}
          iconColor="#f97316"
          variant="ghost"
        />

        <FormInput
          type="switch"
          name="passwordExpiry"
          label={t('settings.security.passwordExpiry')}
          icon={AlertTriangle}
          iconColor="#ef4444"
          variant="ghost"
        />

        <FormInput
          type="switch"
          name="loginNotifications"
          label={t('settings.security.loginNotifications')}
          icon={Shield}
          iconColor="#10b981"
          variant="ghost"
        />

        <FormInput
          type="switch"
          name="parentAccessEnabled"
          label={t('settings.security.parentAccessEnabled')}
          icon={Users}
          iconColor="#a855f7"
          variant="ghost"
        />
      </div>
    </div>
  );
};

export default SecuritySection;