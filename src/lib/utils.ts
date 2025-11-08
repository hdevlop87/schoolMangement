import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from 'zod'
import { format } from 'date-fns'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const dateField = (message?, required = false) => {
  const errorMessage = message !== undefined ? message : "Invalid date";

  const baseSchema = z.union([z.string(), z.date()])
    .refine(val => {
      if (!required && (!val || val === "")) return true;
      return !isNaN(new Date(val).getTime());
    }, {
      message: errorMessage
    })
    .transform(val => val && val !== "" ? new Date(val) : undefined);

  return required ? baseSchema : baseSchema.optional();
};

export const formatDate = (date, t) => {
  if (!date) return t('common.notAvailable');
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch (error) {
    return t('common.invalidDate');
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '--:--';
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeRange = (startTime?, endTime?) => {
  if (!startTime) return '';

  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = endTime ? formatTime(endTime) : '';

  return formattedEndTime ? `${formattedStartTime} - ${formattedEndTime}` : formattedStartTime;
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount || amount === '' || isNaN(Number(amount))) return '--';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(parseFloat(amount.toString()));
  } catch (error) {
    return '--';
  }
};

export const formatDuration = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const formatArea = (area, t) => {
  if (!area) return t('common.notAvailable');
  return `${parseFloat(area).toFixed(2)}`;
};

export const formatCoordinates = (location, t) => {
  if (!location || !location.lat || !location.lng) {
    return t('common.notAvailable');
  }
  return `${parseFloat(location.lat).toFixed(4)}, ${parseFloat(location.lng).toFixed(4)}`;
};

export const getPriorityColor = (priority) => {
  const map = {
    high: 'bg-red-600',
    critical: 'bg-red-700',
    medium: 'bg-yellow-600',
    low: 'bg-green-600',
  };
  return map[priority] || 'bg-gray-600';
};

export const getStatusColor = (status) => {
  const map = {
    active: 'text-green-400',
    completed: 'text-blue-400',
    planned: 'text-yellow-400',
    scheduled: 'text-orange-400',
    acknowledged: 'text-orange-400',
    maintenance: 'text-orange-400',
    inactive: 'text-gray-400',
    suspended: 'text-red-400',
    retired: 'text-red-400',
  };
  return map[status] || 'text-gray-400';
};

export const colorClasses = {
  blue: {
    text: "text-blue-500",
    textDark: "text-blue-600",
    border: "hover:border-blue-500/50",
    bg: "bg-blue-500/10",
  },
  green: {
    text: "text-green-500",
    textDark: "text-green-600",
    border: "hover:border-green-500/50",
    bg: "bg-green-500/10",
  },
  purple: {
    text: "text-purple-500",
    textDark: "text-purple-600",
    border: "hover:border-purple-500/50",
    bg: "bg-purple-500/10",
  },
  yellow: {
    text: "text-yellow-500",
    textDark: "text-yellow-600",
    border: "hover:border-yellow-500/50",
    bg: "bg-yellow-500/10",
  },
  teal: {
    text: "text-teal-500",
    textDark: "text-teal-600",
    border: "hover:border-teal-500/50",
    bg: "bg-teal-500/10",
  },
  indigo: {
    text: "text-indigo-500",
    textDark: "text-indigo-600",
    border: "hover:border-indigo-500/50",
    bg: "bg-indigo-500/10",
  },
  pink: {
    text: "text-pink-500",
    textDark: "text-pink-600",
    border: "hover:border-pink-500/50",
    bg: "bg-pink-500/10",
  },
  gray: {
    text: "text-gray-500",
    textDark: "text-gray-600",
    border: "hover:border-gray-500/50",
    bg: "bg-gray-500/10",
  },
};

// ========================================
// FEE CALCULATION UTILITIES
// ========================================

export const calculateTotalAmount = (feeAmount, schedule, discountAmount) => {
  const amount = Number(feeAmount) || 0;
  const discount = Number(discountAmount) || 0;

  const paymentPeriods = {
    monthly: 10,
    quarterly: 4,
    semester: 2,
    annually: 1,
    oneTime: 1,
  } as const;

  const periods = paymentPeriods[schedule];
  const totalBeforeDiscount = amount * periods;
  return Number(Math.max(0, totalBeforeDiscount - discount));
};

export const calculateTotalFees = (fees) => {
  return fees.reduce((sum, fee) => {
    const amount = parseFloat(fee.amount?.toString() || '0') || 0;
    const discount = parseFloat(fee.discountAmount?.toString() || '0') || 0;
    return sum + (amount - discount);
  }, 0).toFixed(2);
}

export const calculateOriginalAmount = (totalAmount, discountAmount) => {
  const parsedTotal = parseFloat(totalAmount?.toString() || '0') || 0;
  const parsedDiscount = parseFloat(discountAmount?.toString() || '0') || 0;
  return (parsedTotal + parsedDiscount).toFixed(2);
}

export const getCurrentAcademicYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const startYear = currentMonth >= 9 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;

  return `${startYear}-${endYear}`;
};

export const getAcademicYearDateRange = (): { startDate; endDate } => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const startYear = currentMonth >= 9 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;

  return {
    startDate: `${startYear}-09-01`,
    endDate: `${endYear}-06-30`
  };
};

export const getInstallmentInfo = (
  schedule: string,
  netAmount: number
): { installmentCount: number; installmentAmount: number } => {
  let installmentCount = 1;
  let installmentAmount = netAmount;

  switch (schedule) {
    case 'monthly':
      installmentCount = 12;
      installmentAmount = Math.round((netAmount / 12) * 100) / 100;
      break;
    case 'quarterly':
      installmentCount = 4;
      installmentAmount = Math.round((netAmount / 4) * 100) / 100;
      break;
    case 'semester':
      installmentCount = 2;
      installmentAmount = Math.round((netAmount / 2) * 100) / 100;
      break;
    case 'annually':
    case 'oneTime':
      installmentCount = 1;
      installmentAmount = netAmount;
      break;
  }

  return { installmentCount, installmentAmount };
};

