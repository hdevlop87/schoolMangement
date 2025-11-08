import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useLanguage';

export type StatusType =
  | 'active' | 'inactive' | 'pending' | 'cancelled' | 'maintenance' | 'retired'
  | 'approved' | 'rejected' | 'processing' | 'completed' | 'draft' | 'published'
  | 'planned' | 'suspended' | 'deleted' | 'archived' | 'revoked' | 'expired';

const colorThemes = {
  success: {
    bg: 'bg-green-200 text-green-800 hover:bg-green-200',
    text: 'text-green-600',
    dot: 'bg-green-600'
  },
  warning: {
    bg: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-200',
    text: 'text-yellow-600',
    dot: 'bg-yellow-600'
  },
  processing: {
    bg: 'bg-orange-200 text-orange-800 hover:bg-orange-200',
    text: 'text-orange-600',
    dot: 'bg-orange-600'
  },
  info: {
    bg: 'bg-blue-200 text-blue-800 hover:bg-blue-200',
    text: 'text-blue-600',
    dot: 'bg-blue-600'
  },
  neutral: {
    bg: 'bg-gray-200 text-gray-800 hover:bg-gray-200',
    text: 'text-gray-600',
    dot: 'bg-gray-600'
  },
  danger: {
    bg: 'bg-red-200 text-red-800 hover:bg-red-200',
    text: 'text-red-600',
    dot: 'bg-red-600'
  }
};

const statusThemeMap: Record<string, keyof typeof colorThemes> = {
  // Success states
  active: 'success',
  approved: 'success',
  completed: 'success',
  published: 'success',
  
  // Info states
  planned: 'info',
  
  // Warning states
  pending: 'warning',
  maintenance: 'warning',
  draft: 'warning',
  suspended: 'warning',
  expired: 'warning',
  
  // Processing states
  processing: 'processing',
  
  // Neutral states
  inactive: 'neutral',
  retired: 'neutral',
  archived: 'neutral',
  
  // Danger states
  cancelled: 'danger',
  rejected: 'danger',
  deleted: 'danger',
  revoked: 'danger'
};

interface StatusIndicatorProps {
  status: string;
  variant?: 'badge' | 'minimal'| 'text';
  size?: 'sm' | 'default' | 'lg';
  customLabel?: string;
}

export const NStatusBadge: React.FC<StatusIndicatorProps> = ({
  status,
  variant = 'badge',
  size = 'default',
  customLabel
}) => {
  const { t } = useTranslation();

  const getStatusLabel = (status: string) => {
    const translationKey = `status.${status}`;
    const translation = t(translationKey);
    if (translation === translationKey) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    return translation;
  };

  const theme = statusThemeMap[status] || 'neutral';
  const colors = colorThemes[theme];
  const label = customLabel || getStatusLabel(status);

  const sizeConfig = {
    sm: {
      text: 'text-xs',
      padding: 'px-2 py-1',
      dot: 'w-2 h-2',
      gap: 'gap-1.5'
    },
    default: {
      text: 'text-sm',
      padding: 'px-2.5 py-1',
      dot: 'w-2.5 h-2.5',
      gap: 'gap-2'
    },
    lg: {
      text: 'text-base',
      padding: 'px-3 py-1.5',
      dot: 'w-3 h-3',
      gap: 'gap-2.5'
    }
  };

  const { text: textSize, padding, dot: dotSize, gap } = sizeConfig[size];

    if (variant === 'text') {
    return (
      <span className={`${colors.text} ${textSize} font-medium`}>
        {label}
      </span>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center ${gap}`}>
        <div className={`${dotSize} rounded-full ${colors.dot}`} />
        <span className={`${colors.text} ${textSize} font-medium`}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <Badge
      className={`
        ${colors.bg}
        ${textSize}
        ${padding}
        font-medium
        transition-colors
        duration-200
      `}
    >
      {label}
    </Badge>
  );
};

export const getStatusTextColor = (status: string) => {
  const theme = statusThemeMap[status] || 'neutral';
  return colorThemes[theme].text;
};

