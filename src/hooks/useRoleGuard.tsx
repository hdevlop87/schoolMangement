'use client'

import useAuthStore from "@/stores/AuthStore";

export const useRoleGuard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const ROLE_HIERARCHY = {
    'user': 0,
    'operator': 1,
    'mechanic': 2,
    'supervisor': 3,
    'manager': 4,
    'admin': 5,
  };

  const userRole = user?.role || null;
  const normalizedUserRole = userRole?.toLowerCase() || null;
  const userLevel = normalizedUserRole ? ROLE_HIERARCHY[normalizedUserRole] || 0 : 0;

  const hasRole = (role: string): boolean => {
    if (!isAuthenticated || !normalizedUserRole) return false;
    return normalizedUserRole === role.toLowerCase();
  };

  const hasMinRole = (minRole: string): boolean => {
    if (!isAuthenticated || !normalizedUserRole) return false;
    const requiredLevel = ROLE_HIERARCHY[minRole.toLowerCase()] || 0;
    return userLevel >= requiredLevel;
  };

  const isAdmin = (): boolean => hasMinRole('admin');
  const isManager = (): boolean => hasMinRole('manager');
  const isSupervisor = (): boolean => hasMinRole('supervisor');
  const isMechanic = (): boolean => hasMinRole('mechanic');
  const isOperator = (): boolean => hasMinRole('operator');

  const hasAnyRole = (roles: string[]): boolean => {
    if (!isAuthenticated || !normalizedUserRole) return false;
    return roles.some(role => role.toLowerCase() === normalizedUserRole);
  };

  return {
    user,
    userRole, // Return original case for display purposes
    isAuthenticated,
    hasRole,
    isAdmin,
    isManager,
    isSupervisor,
    isMechanic,
    isOperator,
    hasAnyRole,
    hasMinRole
  };
};