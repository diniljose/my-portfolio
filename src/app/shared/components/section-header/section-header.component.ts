import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-header" [class.center]="center">
      <span class="section-label text-caption text-accent">{{ label }}</span>
      <h2 class="text-h2">{{ title }}</h2>
      @if (subtitle) {
        <p class="text-body text-secondary mt-sm">{{ subtitle }}</p>
      }
    </div>
  `,
  styles: [`
    .section-header {
      margin-bottom: 2.5rem;

      &.center {
        text-align: center;
      }
    }

    .section-label {
      display: inline-block;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.08em;
      margin-bottom: 0.5rem;
    }
  `],
})
export class SectionHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() label = '';
  @Input() subtitle = '';
  @Input() center = false;
}
