export interface User {
  id: string;
  username: string;
  email: string;
  roles: ('user' | 'admin')[];
  token?: string;
}
