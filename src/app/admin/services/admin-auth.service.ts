import { Injectable, signal, computed } from '@angular/core';

export interface AdminUser {
  username: string;
  role: 'admin' | 'editor';
  displayName: string;
}

const AUTH_KEY = 'folio-admin-auth';
const DEMO_CREDENTIALS = [
  { username: 'admin', password: 'admin123', role: 'admin' as const, displayName: 'Administrator' },
  { username: 'editor', password: 'editor123', role: 'editor' as const, displayName: 'Editor' },
];

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private _user = signal<AdminUser | null>(null);
  private _token = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  constructor() {
    this.restoreSession();
  }

  login(username: string, password: string): { success: boolean; error?: string } {
    const match = DEMO_CREDENTIALS.find(
      c => c.username === username && c.password === password
    );

    if (!match) {
      return { success: false, error: 'Invalid credentials' };
    }

    const user: AdminUser = {
      username: match.username,
      role: match.role,
      displayName: match.displayName,
    };

    // Generate a mock JWT-like token
    const token = btoa(JSON.stringify({ user, exp: Date.now() + 86400000 }));

    this._user.set(user);
    this._token.set(token);
    this.persistSession(token);

    return { success: true };
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
  }

  private persistSession(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_KEY, token);
    }
  }

  private restoreSession(): void {
    if (typeof localStorage === 'undefined') return;
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp > Date.now()) {
        this._user.set(payload.user);
        this._token.set(token);
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
  }
}
