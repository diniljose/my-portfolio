import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TimelineComponent } from '../../shared/components/timeline/timeline.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, TimelineComponent],
  template: `
    <section class="section">
      <div class="container container-sm">
        <app-section-header
          label="Experience"
          title="Work History"
          subtitle="My professional journey">
        </app-section-header>

        <app-timeline [items]="profileService.experience()"></app-timeline>
      </div>
    </section>
  `,
})
export class ExperienceComponent {
  profileService = inject(ProfileService);
}
