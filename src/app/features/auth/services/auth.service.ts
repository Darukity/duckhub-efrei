import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
interface StoredUser extends User { password: string; }

const USERS_KEY = 'auth_users';
const CURRENT_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(this.restoreCurrent());
  private router = inject(Router);

  // dérivés « live »
  user = this._user.asReadonly();
  isAuthenticated = computed(() => !!this._user());
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);
  token = computed(() => this._user()?.token ?? null);

  constructor() {
    if (this.loadUsers().length === 0) {
      this.saveUsers([
        { id: '1', username: 'admin', email: 'admin@duckhub.dev', roles: ['admin'], password: 'admin123', token: 'mock-token-admin' },
        { id: '2', username: 'ducklover', email: 'duck@duckhub.dev', roles: ['user'],  password: 'quackquack', token: 'mock-token-duck' }
      ]);
    }
    // persiste l’utilisateur courant automatiquement
    effect(() => {
      const u = this._user();
      if (u) localStorage.setItem(CURRENT_KEY, JSON.stringify(u));
      else localStorage.removeItem(CURRENT_KEY);
    });
  }

  login(username: string, password: string): boolean {
    const found = this.loadUsers().find(u => u.username === username && u.password === password);
    if (!found) return false;

    const user: User = {
      id: found.id,
      username: found.username,
      email: found.email,
      roles: found.roles,
      token: found.token,
    };
    this._user.set(user);
    return true;
  }

  register(username: string, email: string, password: string): boolean {
    const users = this.loadUsers();
    if (users.some(u => u.username === username)) return false;
    users.push({ id: crypto.randomUUID(), username, email, roles: ['user'], password, token: 'mock-token-' + username });
    this.saveUsers(users);
    return this.login(username, password);
  }

  logout(): void {
    this._user.set(null);
    this.router.navigate(['/']);
  }

  getCurrentUser() { return this._user(); }
  getToken() { return this.token(); }

  // helpers
  private loadUsers(): StoredUser[] { try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? ''); } catch { return []; } }
  private saveUsers(users: StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
  private restoreCurrent(): User | null { try { return JSON.parse(localStorage.getItem(CURRENT_KEY) ?? ''); } catch { return null; } }
}
