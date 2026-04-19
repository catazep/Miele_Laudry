export type UserRole = 'user' | 'admin';

export interface User {
  // we're gonna use id as username for simplicity
  id: string;
  password: string;
  role: UserRole;
}
