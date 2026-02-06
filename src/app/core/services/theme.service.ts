import { Injectable, signal, effect, computed } from '@angular/core';
import { ThemePreset, ThemeMode, ThemeConfig } from '../models';

const THEME_KEY = 'folio-theme';

interface ThemeTokens {
  [key: string]: string;
}

const THEME_PRESETS: Record<ThemePreset, { dark: ThemeTokens; light: ThemeTokens }> = {
  midnight: {
    dark: {
      '--bg-primary': '#0a0a0f',
      '--bg-secondary': '#12121a',
      '--bg-tertiary': '#1a1a2e',
      '--bg-card': 'rgba(26, 26, 46, 0.6)',
      '--bg-glass': 'rgba(26, 26, 46, 0.4)',
      '--border-color': 'rgba(99, 102, 241, 0.15)',
      '--border-subtle': 'rgba(255, 255, 255, 0.06)',
      '--text-primary': '#f0f0f5',
      '--text-secondary': '#a0a0b8',
      '--text-tertiary': '#6b6b80',
      '--accent': '#818cf8',
      '--accent-hover': '#6366f1',
      '--accent-subtle': 'rgba(129, 140, 248, 0.12)',
      '--accent-gradient': 'linear-gradient(135deg, #818cf8, #6366f1, #4f46e5)',
      '--success': '#34d399',
      '--warning': '#fbbf24',
      '--error': '#f87171',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.4)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.5)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.6)',
      '--shadow-glow': '0 0 40px rgba(129, 140, 248, 0.08)',
    },
    light: {
      '--bg-primary': '#fafafa',
      '--bg-secondary': '#f5f5f7',
      '--bg-tertiary': '#eeeef0',
      '--bg-card': 'rgba(255, 255, 255, 0.8)',
      '--bg-glass': 'rgba(255, 255, 255, 0.6)',
      '--border-color': 'rgba(99, 102, 241, 0.2)',
      '--border-subtle': 'rgba(0, 0, 0, 0.06)',
      '--text-primary': '#111118',
      '--text-secondary': '#555566',
      '--text-tertiary': '#888899',
      '--accent': '#6366f1',
      '--accent-hover': '#4f46e5',
      '--accent-subtle': 'rgba(99, 102, 241, 0.08)',
      '--accent-gradient': 'linear-gradient(135deg, #6366f1, #4f46e5, #4338ca)',
      '--success': '#10b981',
      '--warning': '#f59e0b',
      '--error': '#ef4444',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.08)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.1)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.12)',
      '--shadow-glow': '0 0 40px rgba(99, 102, 241, 0.06)',
    },
  },
  pearl: {
    dark: {
      '--bg-primary': '#0f0f0f',
      '--bg-secondary': '#171717',
      '--bg-tertiary': '#1f1f1f',
      '--bg-card': 'rgba(31, 31, 31, 0.6)',
      '--bg-glass': 'rgba(31, 31, 31, 0.4)',
      '--border-color': 'rgba(212, 212, 216, 0.12)',
      '--border-subtle': 'rgba(255, 255, 255, 0.05)',
      '--text-primary': '#fafafa',
      '--text-secondary': '#a1a1aa',
      '--text-tertiary': '#71717a',
      '--accent': '#e4e4e7',
      '--accent-hover': '#d4d4d8',
      '--accent-subtle': 'rgba(228, 228, 231, 0.08)',
      '--accent-gradient': 'linear-gradient(135deg, #e4e4e7, #a1a1aa)',
      '--success': '#34d399',
      '--warning': '#fbbf24',
      '--error': '#f87171',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.5)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.6)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.7)',
      '--shadow-glow': '0 0 40px rgba(255, 255, 255, 0.03)',
    },
    light: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8f8f8',
      '--bg-tertiary': '#f0f0f0',
      '--bg-card': 'rgba(255, 255, 255, 0.9)',
      '--bg-glass': 'rgba(255, 255, 255, 0.7)',
      '--border-color': 'rgba(0, 0, 0, 0.1)',
      '--border-subtle': 'rgba(0, 0, 0, 0.04)',
      '--text-primary': '#09090b',
      '--text-secondary': '#52525b',
      '--text-tertiary': '#a1a1aa',
      '--accent': '#18181b',
      '--accent-hover': '#27272a',
      '--accent-subtle': 'rgba(24, 24, 27, 0.06)',
      '--accent-gradient': 'linear-gradient(135deg, #18181b, #3f3f46)',
      '--success': '#10b981',
      '--warning': '#f59e0b',
      '--error': '#ef4444',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.06)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.08)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.1)',
      '--shadow-glow': 'none',
    },
  },
  sunset: {
    dark: {
      '--bg-primary': '#0f0a0a',
      '--bg-secondary': '#1a1212',
      '--bg-tertiary': '#261a1a',
      '--bg-card': 'rgba(38, 26, 26, 0.6)',
      '--bg-glass': 'rgba(38, 26, 26, 0.4)',
      '--border-color': 'rgba(251, 146, 60, 0.15)',
      '--border-subtle': 'rgba(255, 255, 255, 0.06)',
      '--text-primary': '#fef2f2',
      '--text-secondary': '#c0a0a0',
      '--text-tertiary': '#806060',
      '--accent': '#fb923c',
      '--accent-hover': '#f97316',
      '--accent-subtle': 'rgba(251, 146, 60, 0.12)',
      '--accent-gradient': 'linear-gradient(135deg, #fb923c, #f97316, #ea580c)',
      '--success': '#34d399',
      '--warning': '#fbbf24',
      '--error': '#f87171',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.4)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.5)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.6)',
      '--shadow-glow': '0 0 40px rgba(251, 146, 60, 0.06)',
    },
    light: {
      '--bg-primary': '#fffbf5',
      '--bg-secondary': '#fff5eb',
      '--bg-tertiary': '#ffedd5',
      '--bg-card': 'rgba(255, 255, 255, 0.85)',
      '--bg-glass': 'rgba(255, 255, 255, 0.6)',
      '--border-color': 'rgba(251, 146, 60, 0.2)',
      '--border-subtle': 'rgba(0, 0, 0, 0.05)',
      '--text-primary': '#1c1917',
      '--text-secondary': '#57534e',
      '--text-tertiary': '#a8a29e',
      '--accent': '#ea580c',
      '--accent-hover': '#c2410c',
      '--accent-subtle': 'rgba(234, 88, 12, 0.08)',
      '--accent-gradient': 'linear-gradient(135deg, #fb923c, #ea580c)',
      '--success': '#10b981',
      '--warning': '#f59e0b',
      '--error': '#ef4444',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.08)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.1)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.12)',
      '--shadow-glow': '0 0 40px rgba(234, 88, 12, 0.05)',
    },
  },
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _preset = signal<ThemePreset>('midnight');
  private _mode = signal<ThemeMode>('dark');

  readonly preset = this._preset.asReadonly();
  readonly mode = this._mode.asReadonly();
  readonly isDark = computed(() => this._mode() === 'dark');

  readonly config = computed<ThemeConfig>(() => ({
    preset: this._preset(),
    mode: this._mode(),
  }));

  constructor() {
    this.loadSavedTheme();
    effect(() => {
      this.applyTheme(this._preset(), this._mode());
      this.saveTheme();
    });
  }

  setPreset(preset: ThemePreset): void {
    this._preset.set(preset);
  }

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
  }

  toggleMode(): void {
    this._mode.set(this._mode() === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(preset: ThemePreset, mode: ThemeMode): void {
    const tokens = THEME_PRESETS[preset][mode];
    const root = document.documentElement;

    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.setAttribute('data-theme', preset);
    root.setAttribute('data-mode', mode);
  }

  private loadSavedTheme(): void {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) {
        const config: ThemeConfig = JSON.parse(saved);
        this._preset.set(config.preset);
        this._mode.set(config.mode);
      } else {
        // Respect OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this._mode.set(prefersDark ? 'dark' : 'light');
      }
    } catch {
      // Use defaults
    }
  }

  private saveTheme(): void {
    localStorage.setItem(THEME_KEY, JSON.stringify(this.config()));
  }
}
