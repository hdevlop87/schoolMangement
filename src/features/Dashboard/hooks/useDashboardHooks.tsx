'use client'

import { useQuery } from '@tanstack/react-query';
import { getWidgetsApi, getStudentsByGenderApi } from '@/services/dashboardApi';

export const useDashboardWidgets = (enabled = true) => {
  return useQuery({
    queryKey: ['dashboard', 'widgets'],
    queryFn: getWidgetsApi,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    select: (response) => response?.data,
  });
};

export const useStudentsByGender = (enabled = true) => {
  return useQuery({
    queryKey: ['dashboard', 'students-by-gender'],
    queryFn: getStudentsByGenderApi,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    select: (response) => response?.data,
  });
};
