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
                  <span class="result-icon">{{ result.icon }}</span>
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
      font-size: 1.25rem;
      flex-shrink: 0;
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
}
