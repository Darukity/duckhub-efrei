// src/app/features/auth/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'auth_users';
const CURRENT_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(this.restoreCurrent());
  user = computed(() => this._user());

  constructor() {
    // seed initial users if none exist
    if (this.loadUsers().length === 0) {
      this.saveUsers([
        {
          id: '1',
          username: 'admin',
          email: 'admin@duckhub.dev',
          roles: ['admin'],
          password: 'admin123',
          token: 'mock-token-admin',
        },
        {
          id: '2',
          username: 'ducklover',
          email: 'duck@duckhub.dev',
          roles: ['user'],
          password: 'quackquack',
          token: 'mock-token-duck',
        },
      ]);
    }
  }

  login(username: string, password: string): boolean {
    const found = this.loadUsers().find(
      (u) => u.username === username && u.password === password
    );
    if (!found) return false;

    const { password: _pw, ...user } = found; // exclude password
    this._user.set(user);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    return true;
  }

  register(username: string, email: string, password: string): boolean {
    const users = this.loadUsers();
    if (users.some((u) => u.username === username)) return false;

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      username,
      email,
      roles: ['user'],
      password,
      token: 'mock-token-' + username,
    };

    users.push(newUser);
    this.saveUsers(users);

    // auto-login
    return this.login(username, password);
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem(CURRENT_KEY);
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }

  isAdmin(): boolean {
    return this._user()?.roles.includes('admin') ?? false;
  }

  /** --- helpers exposés aux guards/interceptor --- */
  getCurrentUser(): User | null {
    return this._user();
  }

  getToken(): string | null {
    return this._user()?.token ?? null;
  }

  // --- private helpers ---
  private loadUsers(): StoredUser[] {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private restoreCurrent(): User | null {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
