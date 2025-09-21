import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

interface MockUser extends User {
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(this.restore());
  user = computed(() => this._user());

  // Fake DB of users (could also be persisted in localStorage)
  private mockUsers: MockUser[] = [
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
  ];

  login(username: string, password: string): boolean {
    const found = this.mockUsers.find((u) => u.username === username && u.password === password);
    if (!found) return false;

    const user: User = {
      id: found.id,
      username: found.username,
      email: found.email,
      roles: found.roles,
      token: found.token,
    };

    this._user.set(user);
    localStorage.setItem('auth_user', JSON.stringify(user));
    return true;
  }

  register(username: string, email: string, password: string): boolean {
    if (this.mockUsers.some((u) => u.username === username)) {
      return false; // already exists
    }
    const newUser: MockUser = {
      id: crypto.randomUUID(),
      username,
      email,
      roles: ['user'],
      password,
      token: 'mock-token-' + username,
    };
    this.mockUsers.push(newUser);
    return this.login(username, password);
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('auth_user');
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }

  isAdmin(): boolean {
    return this._user()?.roles.includes('admin') ?? false;
  }

  private restore(): User | null {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  }
}
