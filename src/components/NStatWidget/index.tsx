"use client";

import React from 'react';
import { colorClasses, cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface NStatWidgetProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  subtitle?: string;
  unit?: string;
  color?: keyof typeof colorClasses;
  variant?: 'default' | 'compact';
  className?: string;
}

const NStatWidget = ({
  icon: Icon,
  title,
  value,
  subtitle,
  unit,
  color = "blue",
  variant = "default",
  className,
}: NStatWidgetProps) => {
  const classes = colorClasses[color] || colorClasses.blue;

  if (variant === 'compact') {
    return (
      <div className={cn(
        "bg-foreground/10 rounded-lg p-3 flex flex-col justify-center items-center",
        className
      )}>
        <div className="flex items-center space-x-2 mb-1">
          <Icon className={cn("w-4 h-4", classes.text)} />
          <Label className="text-xs text-muted-foreground">{title}</Label>
        </div>
        <p className="text-lg font-semibold text-foreground">
          {value}{unit && ` ${unit}`}
        </p>
      </div>
    );
  }

  // Default variant (original design)
  return (
    <div className={cn(
      "bg-card rounded-xl p-4 border shadow-sm transition-all duration-300",
      classes.border,
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-lg", classes.bg)}>
          <Icon className={cn("w-5 h-5", classes.text)} />
        </div>
        {unit && (
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {unit}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs font-medium text-muted-foreground">{title}</div>
        {subtitle && (
          <div className={cn("text-xs", classes.textDark)}>{subtitle}</div>
        )}
      </div>
    </div>
  );
};

export default NStatWidget;

// Alternative: Separate components approach
export const NStatWidgetCompact = ({
  icon: Icon,
  title,
  value,
  unit,
  color = "blue",
  className,
}: Omit<NStatWidgetProps, 'variant' | 'subtitle'>) => {
  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={cn(
      "bg-foreground/10 rounded-lg p-3 flex flex-col justify-center items-center",
      className
    )}>
      <div className="flex items-center space-x-2 mb-1">
        <Icon className={cn("w-4 h-4", classes.text)} />
        <Label className="text-xs text-muted-foreground">{title}</Label>
      </div>
      <p className="text-lg font-semibold text-foreground">
        {value}{unit && ` ${unit}`}
      </p>
    </div>
  );
};

// Usage Examples:
/*
// Default variant (original)
<NStatWidget
  icon={Activity}
  title="Operations Completed"
  value={totalOperationsCompleted}
  subtitle={`${efficiency}% efficiency`}
  unit="Total"
  color="blue"
  variant="default" // or omit since it's default
/>

// Compact variant
<NStatWidget
  icon={DollarSign}
  title="Hourly Rate"
  value={formatCurrency(hourlyRate)}
  color="green"
  variant="compact"
/>

// Or using separate component
<NStatWidgetCompact
  icon={Calendar}
  title="Experience"
  value={yearsOfService}
  unit="years"
  color="blue"
/>

// Grid layout example for compact widgets
<div className="grid grid-cols-2 gap-4">
  <NStatWidget
    icon={DollarSign}
    title="Hourly Rate"
    value={formatCurrency(operator.hourlyRate)}
    color="green"
    variant="compact"
  />
  <NStatWidget
    icon={Calendar}
    title="Experience"
    value={yearsOfService}
    unit="years"
    color="blue"
    variant="compact"
  />
</div>
*/