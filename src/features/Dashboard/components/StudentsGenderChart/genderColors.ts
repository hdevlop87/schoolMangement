// Gender color mapping constants
export const GENDER_COLORS: Record<string, string> = {
  Male: '#2B5A8E',
  Female: '#F4B942',
  Other: '#9CA3AF'
};

export const getGenderColor = (gender: string): string => {
  return GENDER_COLORS[gender] || GENDER_COLORS.Other;
};