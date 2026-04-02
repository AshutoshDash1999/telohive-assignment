export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isGuest?: boolean;
}

export interface SessionData {
  user: AuthUser;
}
