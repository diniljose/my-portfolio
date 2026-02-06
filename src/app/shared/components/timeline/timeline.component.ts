import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../../../core/models';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline">
      @for (item of items; track item.id; let i = $index; let last = $last) {
        <div class="timeline-item animate-fade-in-up stagger-{{ i + 1 }}">
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            @if (!last) {
              <div class="marker-line"></div>
            }
          </div>
          <div class="timeline-content card-flat">
            <div class="timeline-header">
              <div>
                <h3 class="text-h4">{{ item.role }}</h3>
                <p class="text-body-sm text-secondary">
                  {{ item.company }} · {{ item.location }}
                </p>
              </div>
              <span class="chip-outline timeline-date">
                {{ formatDate(item.startDate) }} — {{ item.endDate ? formatDate(item.endDate) : 'Present' }}
              </span>
            </div>
            <p class="text-body-sm text-secondary mt-sm">{{ item.description }}</p>
            @if (item.achievements.length > 0) {
              <ul class="achievements mt-md">
                @for (achievement of item.achievements; track achievement) {
                  <li class="text-body-sm">
                    <span class="achievement-marker">▸</span>
                    {{ achievement }}
                  </li>
                }
              </ul>
            }
            @if (item.technologies.length > 0) {
              <div class="tech-tags mt-md">
                @for (tech of item.technologies; track tech) {
                  <span class="chip">{{ tech }}</span>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .timeline {
      position: relative;
    }

    .timeline-item {
      display: flex;
      gap: 1.5rem;
      padding-bottom: 2rem;

      &:last-child {
        padding-bottom: 0;
      }
    }

    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      padding-top: 1.5rem;
    }

    .marker-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 4px var(--accent-subtle);
      z-index: 1;
    }

    .marker-line {
      width: 2px;
      flex: 1;
      background: var(--border-subtle);
      margin-top: 0.5rem;
    }

    .timeline-content {
      flex: 1;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .timeline-date {
      white-space: nowrap;
      flex-shrink: 0;
    }

    .achievements {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .achievements li {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .achievement-marker {
      color: var(--accent);
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    @media (max-width: 640px) {
      .timeline-marker {
        display: none;
      }

      .timeline-header {
        flex-direction: column;
      }
    }
  `],
})
export class TimelineComponent {
  @Input({ required: true }) items: Experience[] = [];

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
