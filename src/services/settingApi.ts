import { api } from './http';

// Basic CRUD Operations
export const getSettingsApi = async () => {
  const res = await api.get('/settings');
  return res.data;
};

export const getSettingByIdApi = async (id) => {
  const res = await api.get(`/settings/${id}`);
  return res.data;
};

export const deleteSettingApi = async (id) => {
  const res = await api.delete(`/settings/${id}`);
  return res.data;
};

export const getSettingCountApi = async () => {
  const res = await api.get('/settings/count');
  return res.data;
};

// User Settings Management
export const getMySettingsApi = async () => {
  const res = await api.get('/settings/me');
  return res.data;
};

export const updateMySettingsApi = async (data) => {
  const res = await api.put('/settings/me', data);
  return res.data;
};

export const resetMySettingsApi = async () => {
  const res = await api.post('/settings/me/reset');
  return res.data;
};

// Language Preferences
export const getMyLanguageApi = async () => {
  const res = await api.get('/settings/me/language');
  return res.data;
};

export const updateMyLanguageApi = async (language) => {
  const res = await api.put('/settings/me/language', { language });
  return res.data;
};

// Theme Preferences
export const getMyThemeApi = async () => {
  const res = await api.get('/settings/me/theme');
  return res.data;
};

export const updateMyThemeApi = async (theme) => {
  const res = await api.put('/settings/me/theme', { theme });
  return res.data;
};

// Notification Preferences
export const getMyNotificationPreferencesApi = async () => {
  const res = await api.get('/settings/me/notifications');
  return res.data;
};

export const updateMyNotificationPreferencesApi = async (data) => {
  const res = await api.put('/settings/me/notifications', data);
  return res.data;
};

// Security Preferences
export const getMySecurityPreferencesApi = async () => {
  const res = await api.get('/settings/me/security');
  return res.data;
};

export const updateMySecurityPreferencesApi = async (data) => {
  const res = await api.put('/settings/me/security', data);
  return res.data;
};

// System Preferences
export const getMySystemPreferencesApi = async () => {
  const res = await api.get('/settings/me/system');
  return res.data;
};

export const updateMySystemPreferencesApi = async (data) => {
  const res = await api.put('/settings/me/system', data);
  return res.data;
};

// School Settings (Admin only)
export const getMySchoolSettingsApi = async () => {
  const res = await api.get('/settings/me/school');
  return res.data;
};

export const updateMySchoolSettingsApi = async (data) => {
  const res = await api.put('/settings/me/school', data);
  return res.data;
};

// Academic Preferences
export const getMyAcademicPreferencesApi = async () => {
  const res = await api.get('/settings/me/academic');
  return res.data;
};

export const updateMyAcademicPreferencesApi = async (data) => {
  const res = await api.put('/settings/me/academic', data);
  return res.data;
};

// Admin User Management
export const getUserSettingsApi = async (userId) => {
  const res = await api.get(`/settings/user/${userId}`);
  return res.data;
};

export const updateUserSettingsApi = async (userId, data) => {
  const res = await api.put(`/settings/user/${userId}`, data);
  return res.data;
};

export const deleteUserSettingsApi = async (userId) => {
  const res = await api.delete(`/settings/user/${userId}`);
  return res.data;
};

// Admin Bulk Operations
export const deleteAllSettingsApi = async () => {
  const res = await api.delete('/settings');
  return res.data;
};

export const seedDemoSettingsApi = async (data) => {
  const res = await api.post('/settings/seed', data);
  return res.data;
};

// Analytics APIs
export const getLanguageDistributionApi = async () => {
  const res = await api.get('/settings/analytics/language-distribution');
  return res.data;
};

export const getThemeDistributionApi = async () => {
  const res = await api.get('/settings/analytics/theme-distribution');
  return res.data;
};

export const getNotificationAnalyticsApi = async () => {
  const res = await api.get('/settings/analytics/notification-analytics');
  return res.data;
};

export const getSettingsWithUsersApi = async () => {
  const res = await api.get('/settings/analytics/settings-with-users');
  return res.data;
};