// stores/authStore.ts
import { create } from 'zustand';
import { setupInterceptors } from '@/services/http';

interface User {
  id: string | number;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthState {
  accessToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  user: User | null;
  isAuthenticated: boolean;
  status: string | number | null;
  message: string;
  isLoading: boolean;
  language: string | null;
}

interface AuthActions {
  getAccessToken: () => void;
  resetAuth: () => void;
  updateAuth: (authState: Partial<AuthState>) => void;
  setUser: (user: User | null) => void;
  setStatus: (status: string | null) => void;
  setMessage: (message: string) => void;
  setAccessToken: (accessToken: string | null) => void;
  setAccessTokenExpiresAt: (accessTokenExpiresAt: string | null) => void;
  setRefreshTokenExpiresAt: (refreshTokenExpiresAt: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLanguage: (language: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  accessToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  user: null,
  isAuthenticated: false,
  status: null,
  message: "",
  isLoading: false,
  language: null,

  // Actions
  resetAuth: () => {
    set({
      accessToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      user: null,
      isAuthenticated: false,
      status: null,
      message: "",
      language: null,
    });
  },

  updateAuth: (authState: Partial<AuthState>) => {
    set((state) => ({
      accessToken: authState.accessToken ?? state.accessToken,
      accessTokenExpiresAt: authState.accessTokenExpiresAt ?? state.accessTokenExpiresAt,
      refreshTokenExpiresAt: authState.refreshTokenExpiresAt ?? state.refreshTokenExpiresAt,
      user: authState.user ?? state.user,
      isAuthenticated: authState.isAuthenticated ?? state.isAuthenticated,
      status: authState.status ?? state.status,
      message: authState.message ?? state.message,
      isLoading: authState.isLoading ?? state.isLoading,
      language: authState.language ?? state.language,
    }));
  },

  getAccessToken: () => get().accessToken,

  setUser: (user: User | null) => set({ user }),
  setStatus: (status: string | null) => set({ status }),
  setMessage: (message: string) => set({ message }),
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
  setAccessTokenExpiresAt: (accessTokenExpiresAt: string | null) => set({ accessTokenExpiresAt }),
  setRefreshTokenExpiresAt: (refreshTokenExpiresAt: string | null) => set({ refreshTokenExpiresAt }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setLanguage: (language: string | null) => set({ language }),
}));

const initializeAuth = (): void => {
  const { getAccessToken, updateAuth, resetAuth } = useAuthStore.getState();
        
  setupInterceptors({
    getAccessToken,
    updateAuth,
    resetAuth,
  });
};

if (typeof window !== 'undefined') {
  initializeAuth();
}

export default useAuthStore;
export type { User, AuthState, AuthActions, AuthStore };