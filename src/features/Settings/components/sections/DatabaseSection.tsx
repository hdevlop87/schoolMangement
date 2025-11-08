'use client'

import React, { useState } from 'react';
import { Database, Trash2, Upload, Eye, EyeOff, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useLanguage';
import { useDialogStore } from '@/stores/MultiDialogStore';
import SeedConfirmation from '@/components/NSeedConfirmation';
import { useSeedDemo, useSeedSystem, useClearAllData } from '../../hooks/useSettings';
import NCard from '@/components/NCard';

const DatabaseSection: React.FC = () => {
  const { t } = useTranslation();
  const { openDialog } = useDialogStore();
  const seedDemo = useSeedDemo();
  const seedSystem = useSeedSystem();
  const clearAllData = useClearAllData();
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_SEED_API_KEY || 'sk-************************';

  const handleSeedDemoClick = () => {
    openDialog({
      children: <SeedConfirmation />,
      primaryButton: {
        text: t('settings.seed.confirm'),
        variant: 'destructive',
        loading: seedDemo.isLoading,
        form: 'seed-form',
        onConfirm: async () => {
          await seedDemo.mutateAsync();
        }
      }
    });
  };

  const handleSeedSystemClick = () => {
    openDialog({
      children: (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-200">
            <Database className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{t('settings.system.confirmTitle')}</h3>
            <p className="text-muted-foreground mb-2">
              {t('settings.system.confirmDescription')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('common.confirmAction')}
            </p>
          </div>
        </div>
      ),
      primaryButton: {
        text: t('settings.system.confirm'),
        variant: 'default',
        loading: seedSystem.isLoading,
        onConfirm: async () => {
          await seedSystem.mutateAsync();
        }
      }
    });
  };

  const handleClearDataClick = () => {
    openDialog({
      children: (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-200">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{t('settings.clear.confirmTitle')}</h3>
            <p className="text-muted-foreground mb-2">
              {t('settings.clear.confirmDescription')}
            </p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-left">
              <p className="text-sm font-medium text-destructive mb-1">
                ⚠️ {t('common.warning')}
              </p>
              <p className="text-sm text-destructive/80">
                {t('settings.clear.warningMessage')}
              </p>
            </div>
          </div>
        </div>
      ),
      primaryButton: {
        text: t('settings.clear.confirm'),
        variant: 'destructive',
        loading: clearAllData.isLoading,
        onConfirm: async () => {
          await clearAllData.mutateAsync();
        }
      }
    });
  };

  return (
    <NCard
      title={t('settings.database.title') || 'Database & API'}
      icon={Database}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {t('settings.database.description') || 'Manage database operations and API credentials'}
          </p>

          <div className="space-y-3">
            <Button
              variant="destructive"
              className="w-full"
              disabled={seedDemo.isLoading}
              onClick={handleSeedDemoClick}
            >
              <Database className="h-4 w-4 mr-2" />
              {t('settings.seed.button') || 'Seed Demo Data'}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              disabled={seedSystem.isLoading}
              onClick={handleSeedSystemClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('settings.system.button') || 'Seed System Defaults'}
            </Button>

            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={clearAllData.isLoading}
              onClick={handleClearDataClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('settings.clear.button') || 'Clear All Data'}
            </Button>
          </div>
        </div>

        <hr />

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            {t('settings.security.apiKey') || 'API Key'}
          </Label>
          <div className="flex gap-2">
            <Input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('settings.security.apiKeyDescription') || 'Your API key for external integrations'}
          </p>
        </div>
      </div>
    </NCard>
  );
};

export default DatabaseSection;