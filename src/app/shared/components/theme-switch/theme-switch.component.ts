import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services';
import { ThemePreset } from '../../../core/models';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-switch">
      <button
        class="btn-icon mode-toggle"
        (click)="themeService.toggleMode()"
        [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        [title]="themeService.isDark() ? 'Light mode' : 'Dark mode'">
        @if (themeService.isDark()) {
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/>
            <path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/>
            <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
          </svg>
        } @else {
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
        }
      </button>
      <div class="preset-selector">
        @for (preset of presets; track preset.id) {
          <button
            class="preset-dot"
            [class.active]="themeService.preset() === preset.id"
            [style.background]="preset.color"
            (click)="themeService.setPreset(preset.id)"
            [title]="preset.label"
            [attr.aria-label]="'Theme: ' + preset.label">
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .theme-switch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .mode-toggle svg {
      transition: transform 0.3s ease;
    }

    .mode-toggle:hover svg {
      transform: rotate(15deg);
    }

    .preset-selector {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px;
      border-radius: 100px;
      background: var(--bg-tertiary);
    }

    .preset-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.2);
      }

      &.active {
        border-color: var(--text-primary);
        transform: scale(1.15);
      }
    }

    @media (max-width: 768px) {
      .preset-selector {
        display: none;
      }
    }
  `],
})
export class ThemeSwitchComponent {
  themeService = inject(ThemeService);

  presets: { id: ThemePreset; label: string; color: string }[] = [
    { id: 'midnight', label: 'Midnight', color: '#818cf8' },
    { id: 'pearl', label: 'Pearl', color: '#a1a1aa' },
    { id: 'sunset', label: 'Sunset', color: '#fb923c' },
  ];
}
