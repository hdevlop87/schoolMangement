"use client";

import React from 'react';
import { CreditCard, CheckCircle, Clock, AlertCircle, Zap, DollarSign, User } from 'lucide-react';
import { NSectionInfo } from '@/components/NSectionCard';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';

const FeeCard = ({ data }: any) => {
  const { t } = useTranslation();
  const fee = data;

  const scheduleMap: Record<string, string> = {
    'monthly': t('fees.schedule.monthly'),
    'quarterly': t('fees.schedule.quarterly'),
    'semester': t('fees.schedule.semester'),
    'annually': t('fees.schedule.annually'),
    'oneTime': t('fees.schedule.oneTime'),
  };

  const statusMap: Record<string, { icon: any; color: string; text: string }> = {
    'paid': { icon: CheckCircle, color: 'text-green-600', text: t('fees.status.paid') || 'Paid' },
    'pending': { icon: Clock, color: 'text-yellow-600', text: t('fees.status.pending') || 'Pending' },
    'overdue': { icon: AlertCircle, color: 'text-red-600', text: t('fees.status.overdue') || 'Overdue' },
    'partial': { icon: Zap, color: 'text-blue-600', text: t('fees.status.partial') || 'Partial' },
  };

  const currentStatus = statusMap[fee.status];

  return (
    <div className="flex flex-col gap-3">
      {/* Fee Type Title */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center dark:bg-primary">
          <DollarSign className="w-5 h-5 text-primary dark:text-white" />
        </div>
        <Label className="text-md font-bold text-foreground block">
          {fee.feeType.name}
        </Label>
      </div>

      {/* Student, Schedule Information & Status */}
      <div className="space-y-2">
        <NSectionInfo
          icon={User}
          iconColor="text-muted-foreground"
          label={t('fees.table.student')}
          value={fee.student.name}
        />

        <NSectionInfo
          icon={CreditCard}
          iconColor="text-muted-foreground"
          label={t('fees.table.schedule')}
          value={scheduleMap[fee.schedule] || fee.schedule}
        />

        <NSectionInfo
          icon={currentStatus.icon}
          iconColor={currentStatus.color}
          label={t('fees.table.status')}
          value={currentStatus.text}
          valueColor={currentStatus.color}
        />
      </div>

      {/* Financial Summary - Highlighted Box */}
      <div className="border-l-4 border-blue-500 bg-blue-50 px-4 py-3 rounded">
        <div className="space-y-2">
          {/* Total Amount */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-600">
              {t('fees.table.totalAmount')}:
            </Label>
            <Label className="text-sm font-bold text-gray-900">
              {Number(fee.totalAmount).toFixed(2)} {t('common.currency')}
            </Label>
          </div>

          {/* Paid Amount */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-600">
              {t('fees.table.paidAmount')}:
            </Label>
            <Label className="text-sm font-bold text-green-600">
              {Number(fee.paidAmount).toFixed(2)} {t('common.currency')}
            </Label>
          </div>

          {/* Balance Due */}
          <div className="flex items-center justify-between pt-2 border-t border-blue-200">
            <Label className="text-sm font-semibold text-gray-700">
              {t('fees.table.balanceDue') || 'Balance Due'}:
            </Label>
            <Label className="text-sm font-bold text-red-600">
              {Number(fee.totalAmount - fee.paidAmount).toFixed(2)} {t('common.currency')}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeCard;