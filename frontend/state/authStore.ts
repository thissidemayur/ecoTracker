import { create } from "zustand";
import { IUser } from "../types/authApi.type"; // Importing the interface we defined earlier

/**
 * @interface AuthState
 * @description The data and actions available in the Global Auth Store
 */
interface AuthState {
  // --- Data ---
  user: IUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticating: boolean; 
  isAuthenticated: boolean;

  // --- Actions ---
  setAccessToken: (token: string | null) => void;
  setUser: (userData: IUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setAuthenticating: (isAuthenticating: boolean) => void;
  clearAuth: () => void;
  updateUser: (userData: IUser) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial State
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticating: false,
  isAuthenticated: false,

  setAccessToken: (token: string | null) => {
    set({
      accessToken: token,
      isAuthenticated: !!token,
      isLoading: false,
    });
  },

  setUser: (userData: IUser | null) => {
    set({
      user: userData,
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  updateUser: (userData) => set({ user: userData,isLoading:false }),

  setAuthenticating: (isAuthenticating: boolean) => set({ isAuthenticating ,isLoading:false}),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isAuthenticating: false,
      isLoading: false,
    }),
}));

