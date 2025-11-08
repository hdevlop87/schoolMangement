import { useRoleGuard } from "@/hooks/useRoleGuard";

interface RoleGuardProps {
  children: React.ReactNode;
  role?: string;
  roles?: string[];
  adminOnly?: boolean;
  minRole?: string;
  fallback?: React.ReactNode;
}

export const RoleGuard = ({
  children,
  minRole,
  role,
  roles,
  adminOnly = false,
  fallback = null
}: RoleGuardProps) => {
  const { hasMinRole, hasRole, hasAnyRole, isAdmin } = useRoleGuard();

  // Check admin shortcut
  if (adminOnly && !isAdmin()) {
    return fallback;
  }

  // Check exact role
  if (role && !hasRole(role)) {
    return fallback;
  }

  // Check any roles
  if (roles && !hasAnyRole(roles)) {
    return fallback;
  }

  if (minRole && !hasMinRole(minRole)) return fallback;

  return <>{children}</>;
};