"use client";

import { create } from "zustand";

import type { LoginInput, RegisterInput } from "@/lib/validation/auth";
import type { AuthUser, SessionData } from "@/types/auth";

const AUTH_STORAGE_KEY = "th:auth:session:v1";
const AUTH_COOKIE_KEY = "th_mock_auth";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

interface LoginGuestPayload {
  provider: "google" | "microsoft" | "apple";
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  rememberMe: boolean;
  initialize: () => void;
  loginWithCredentials: (input: LoginInput) => void;
  loginAsGuest: (payload: LoginGuestPayload) => void;
  registerAndLogin: (input: RegisterInput) => void;
  logout: () => void;
}

function writeSessionToStorage(session: SessionData, rememberMe: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(session);
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);

  if (rememberMe) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    return;
  }

  window.sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
}

function readSessionFromStorage():
  | {
      session: SessionData;
      rememberMe: boolean;
    }
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const localValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (localValue) {
    try {
      return {
        session: JSON.parse(localValue) as SessionData,
        rememberMe: true,
      };
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  const sessionValue = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (sessionValue) {
    try {
      return {
        session: JSON.parse(sessionValue) as SessionData,
        rememberMe: false,
      };
    } catch {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  return null;
}

function clearStoredSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function setAuthCookie(isAuthenticated: boolean): void {
  if (typeof document === "undefined") {
    return;
  }

  if (isAuthenticated) {
    document.cookie = `${AUTH_COOKIE_KEY}=1; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
    return;
  }

  document.cookie = `${AUTH_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function createUserFromEmail(email: string): Pick<AuthUser, "firstName" | "lastName"> {
  const [rawName] = email.split("@");
  const normalized = rawName.replace(/[._-]+/g, " ").trim();
  const [firstPart = "User", secondPart = ""] = normalized.split(" ");

  return {
    firstName:
      firstPart.slice(0, 1).toUpperCase() + firstPart.slice(1).toLowerCase(),
    lastName:
      secondPart.slice(0, 1).toUpperCase() + secondPart.slice(1).toLowerCase(),
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  rememberMe: false,
  initialize: () => {
    const stored = readSessionFromStorage();
    if (!stored) {
      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
        rememberMe: false,
      });
      setAuthCookie(false);
      return;
    }

    set({
      user: stored.session.user,
      isAuthenticated: true,
      isHydrated: true,
      rememberMe: stored.rememberMe,
    });
    setAuthCookie(true);
  },
  loginWithCredentials: (input) => {
    const identity = createUserFromEmail(input.email);
    const session: SessionData = {
      user: {
        id: `user-${Date.now()}`,
        email: input.email,
        firstName: identity.firstName,
        lastName: identity.lastName,
      },
    };

    writeSessionToStorage(session, input.rememberMe);
    setAuthCookie(true);
    set({
      user: session.user,
      isAuthenticated: true,
      isHydrated: true,
      rememberMe: input.rememberMe,
    });
  },
  loginAsGuest: ({ provider }) => {
    const session: SessionData = {
      user: {
        id: `guest-${Date.now()}`,
        email: "guest@telohive.local",
        firstName: "Guest",
        lastName: provider.charAt(0).toUpperCase() + provider.slice(1),
        isGuest: true,
      },
    };

    writeSessionToStorage(session, false);
    setAuthCookie(true);
    set({
      user: session.user,
      isAuthenticated: true,
      isHydrated: true,
      rememberMe: false,
    });
  },
  registerAndLogin: (input) => {
    const session: SessionData = {
      user: {
        id: `user-${Date.now()}`,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
      },
    };

    writeSessionToStorage(session, true);
    setAuthCookie(true);
    set({
      user: session.user,
      isAuthenticated: true,
      isHydrated: true,
      rememberMe: true,
    });
  },
  logout: () => {
    clearStoredSession();
    setAuthCookie(false);
    set({
      user: null,
      isAuthenticated: false,
      isHydrated: true,
      rememberMe: false,
    });
  },
}));

export function getUserInitials(user: AuthUser | null): string {
  if (!user) {
    return "U";
  }

  const firstInitial = user.firstName.slice(0, 1).toUpperCase();
  const lastInitial = user.lastName.slice(0, 1).toUpperCase();

  return `${firstInitial}${lastInitial}`.trim() || "U";
}
