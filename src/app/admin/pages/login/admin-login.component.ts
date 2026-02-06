import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1>Admin Panel</h1>
          <p class="text-secondary">Sign in to manage your portfolio</p>
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          @if (error()) {
            <div class="alert alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/>
              </svg>
              {{ error() }}
            </div>
          }

          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              [(ngModel)]="username"
              name="username"
              placeholder="Enter username"
              autocomplete="username"
              required
              [disabled]="submitting()">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Enter password"
              autocomplete="current-password"
              required
              [disabled]="submitting()">
          </div>

          <button type="submit" class="btn btn-primary btn-full" [disabled]="submitting()">
            @if (submitting()) {
              <span class="spinner"></span> Signing in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="login-footer">
          <p class="text-caption text-tertiary">Demo credentials:</p>
          <div class="credentials">
            <code>admin / admin123</code>
            <code>editor / editor123</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
      padding: 1rem;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 2.5rem;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: var(--accent-subtle);
      color: var(--accent);
      margin-bottom: 1rem;
    }

    .login-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem;
    }

    .text-secondary { color: var(--text-secondary); }
    .text-tertiary { color: var(--text-tertiary); }
    .text-caption { font-size: 0.75rem; }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-group label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .form-group input {
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;

      &:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--accent-subtle);
      }

      &::placeholder {
        color: var(--text-tertiary);
      }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--accent);
      color: white;

      &:hover:not(:disabled) {
        background: var(--accent-hover);
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-full { width: 100%; }

    .alert {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 0.8125rem;
    }

    .alert-error {
      background: rgba(248, 113, 113, 0.1);
      border: 1px solid rgba(248, 113, 113, 0.2);
      color: var(--error);
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .login-footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
      text-align: center;
    }

    .credentials {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .credentials code {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background: var(--bg-tertiary);
      border-radius: 6px;
      color: var(--text-secondary);
      font-family: 'SF Mono', 'Fira Code', monospace;
    }
  `],
})
export class AdminLoginComponent {
  private auth = inject(AdminAuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error = signal<string | null>(null);
  submitting = signal(false);

  onLogin(): void {
    this.error.set(null);
    this.submitting.set(true);

    // Simulate network delay
    setTimeout(() => {
      const result = this.auth.login(this.username, this.password);
      this.submitting.set(false);

      if (result.success) {
        this.router.navigate(['/admin']);
      } else {
        this.error.set(result.error || 'Login failed');
      }
    }, 600);
  }
}
