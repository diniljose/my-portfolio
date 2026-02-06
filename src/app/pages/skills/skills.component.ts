import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { SkillGridComponent } from '../../shared/components/skill-grid/skill-grid.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, SkillGridComponent],
  template: `
    <section class="section">
      <div class="container">
        <app-section-header
          label="Skills"
          title="Technical Expertise"
          subtitle="Technologies and tools I work with">
        </app-section-header>

        <app-skill-grid [skills]="profileService.skills()"></app-skill-grid>
      </div>
    </section>
  `,
})
export class SkillsComponent {
  profileService = inject(ProfileService);
}
