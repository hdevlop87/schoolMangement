import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'planned' |'pending' |'completed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  
  const statusConfig = {
    active: { icon: "🟢", variant: "default" as const },
    inactive: { icon: "🔴", variant: "destructive" as const },
    pending: { icon: "🟡", variant: "secondary" as const },
    planned: { icon: "🟡", variant: "secondary" as const },
    cancelled: { icon: "🔴", variant: "destructive" as const },
    completed: { icon: "🔴", variant: "default" as const }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="gap-1 ">
      <span className="text-xs">{config.icon}</span>
      {status}
    </Badge>
  );
}