import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../core/services';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (searchService.isOpen()) {
      <div class="overlay" (click)="searchService.close()" (keydown.escape)="searchService.close()">
        <div class="palette" (click)="$event.stopPropagation()">
          <div class="palette-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              #searchInput
              type="text"
              class="palette-input"
              placeholder="Search projects, skills, experience..."
              [ngModel]="searchService.query()"
              (ngModelChange)="searchService.setQuery($event)"
              (keydown.escape)="searchService.close()"
              (keydown.arrowdown)="onArrowDown($event)"
              (keydown.arrowup)="onArrowUp($event)"
              (keydown.enter)="onEnter()"
              autofocus />
            <kbd class="kbd">ESC</kbd>
          </div>

          @if (searchService.results().length > 0) {
            <div class="palette-results">
              @for (result of searchService.results(); track result.route; let i = $index) {
                <a
                  [routerLink]="result.route"
                  class="result-item"
                  [class.focused]="i === focusedIndex()"
                  (click)="searchService.close()"
                  (mouseenter)="focusedIndex.set(i)">
                  <span class="result-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" [innerHTML]="getResultIcon(result.icon)"></svg>
                  </span>
                  <div class="result-content">
                    <span class="result-title">{{ result.title }}</span>
                    <span class="result-subtitle">{{ result.subtitle }}</span>
                  </div>
                  <span class="result-type chip-outline">{{ result.type }}</span>
                </a>
              }
            </div>
          } @else if (searchService.query().length >= 2) {
            <div class="palette-empty">
              <p class="text-body-sm text-tertiary">No results for "{{ searchService.query() }}"</p>
            </div>
          } @else {
            <div class="palette-empty">
              <p class="text-body-sm text-tertiary">Start typing to search...</p>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 15vh;
      animation: fadeIn 0.15s ease;
    }

    .palette {
      width: min(560px, 90vw);
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      animation: scaleIn 0.15s ease;
    }

    .palette-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .search-icon {
      color: var(--text-tertiary);
      flex-shrink: 0;
    }

    .palette-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 1rem;
      font-family: inherit;

      &::placeholder {
        color: var(--text-tertiary);
      }
    }

    .kbd {
      font-size: 0.6875rem;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      background: var(--bg-tertiary);
      color: var(--text-tertiary);
      border: 1px solid var(--border-subtle);
      font-family: inherit;
    }

    .palette-results {
      max-height: 320px;
      overflow-y: auto;
      padding: 0.5rem;
    }

    .result-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 10px;
      text-decoration: none;
      color: var(--text-primary);
      transition: background 0.15s ease;
      cursor: pointer;

      &:hover, &.focused {
        background: var(--accent-subtle);
      }
    }

    .result-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: var(--accent);

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .result-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .result-title {
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-subtitle {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-type {
      flex-shrink: 0;
    }

    .palette-empty {
      padding: 2rem;
      text-align: center;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
  `],
})
export class CommandPaletteComponent implements AfterViewInit {
  searchService = inject(SearchService);
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  focusedIndex = signal(0);

  ngAfterViewInit(): void {
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 50);
  }

  onArrowDown(event: Event): void {
    event.preventDefault();
    const max = this.searchService.results().length - 1;
    this.focusedIndex.set(Math.min(this.focusedIndex() + 1, max));
  }

  onArrowUp(event: Event): void {
    event.preventDefault();
    this.focusedIndex.set(Math.max(this.focusedIndex() - 1, 0));
  }

  onEnter(): void {
    const results = this.searchService.results();
    if (results[this.focusedIndex()]) {
      this.searchService.close();
    }
  }

  getResultIcon(icon: string): string {
    const icons: Record<string, string> = {
      project: '<path d=\"M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z\"/>',
      skill: '<path d=\"M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z\"/>',
      experience: '<path d=\"M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z\"/>'
    };
    return icons[icon] || icons['project'];
  }
}
