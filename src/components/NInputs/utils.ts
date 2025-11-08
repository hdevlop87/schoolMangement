import { cn } from "@/lib/utils";

export function getIconColorProps(iconColor?: string, baseClassName = "") {
  if (!iconColor) {
    return {
      className: cn(baseClassName, "text-muted-foreground"),
      style: {}
    };
  }
  const isTailwindClass = iconColor.startsWith('text-');

  if (isTailwindClass) {
    return {
      className: cn(baseClassName, iconColor),
      style: {}
    };
  }
  return {
    className: baseClassName,
    style: { color: iconColor }
  };
}