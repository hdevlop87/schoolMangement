'use client'

import React from 'react';
import { AlertTriangle, Database } from 'lucide-react';
import { useDialogStore } from '@/stores/MultiDialogStore';
import { useTranslation } from '@/hooks/useLanguage';

const SeedConfirmation: React.FC = () => {
    const { handleConfirm } = useDialogStore();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        handleConfirm();
    }

    return (
        <form id="seed-form" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full ">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Database className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{t('settings.seed.confirmTitle')}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">
                        {t('settings.seed.confirmDescription')}
                    </p>
                    
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-left">
                        <p className="text-sm font-medium text-destructive mb-2">
                            {t('settings.seed.warningTitle')}
                        </p>
                        <ul className="text-sm text-destructive space-y-1">
                            <li>• {t('settings.seed.warningPoint1')}</li>
                            <li>• {t('settings.seed.warningPoint2')}</li>
                            <li>• {t('settings.seed.warningPoint3')}</li>
                        </ul>
                    </div>

                    <p className="text-sm text-muted-foreground font-medium">
                        {t('common.confirmAction')}
                    </p>
                </div>
            </div>
        </form>
    );
};

export default SeedConfirmation;