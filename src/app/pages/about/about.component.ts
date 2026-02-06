import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService, SeoService } from '../../core/services';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  template: `
    @if (profileService.profile(); as profile) {
      <section class="section">
        <div class="container container-sm">
          <app-section-header
            label="About Me"
            [title]="'I\\'m ' + profile.firstName + ' ' + profile.lastName"
            [subtitle]="profile.headline">
          </app-section-header>

          <div class="about-content animate-fade-in-up">
            <div class="about-info card-flat">
              <div class="info-grid">
                <div class="info-item">
                  <span class="text-caption text-tertiary">Location</span>
                  <span class="text-body-sm">{{ profile.location }}</span>
                </div>
                <div class="info-item">
                  <span class="text-caption text-tertiary">Email</span>
                  <a [href]="'mailto:' + profile.email" class="text-body-sm">{{ profile.email }}</a>
                </div>
                @if (profile.phone) {
                  <div class="info-item">
                    <span class="text-caption text-tertiary">Phone</span>
                    <span class="text-body-sm">{{ profile.phone }}</span>
                  </div>
                }
                <div class="info-item">
                  <span class="text-caption text-tertiary">Availability</span>
                  <span class="badge" [ngClass]="profile.availability">
                    <span class="dot"></span>
                    {{ profile.availability === 'available' ? 'Open to opportunities' : profile.availability }}
                  </span>
                </div>
              </div>
            </div>

            <div class="about-text mt-xl">
              <p class="text-body text-secondary">{{ profile.summary }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Education -->
      @if (profileService.education().length > 0) {
        <section class="section">
          <div class="container container-sm">
            <app-section-header label="Education" title="Academic Background"></app-section-header>
            <div class="education-list">
              @for (edu of profileService.education(); track edu.institution; let i = $index) {
                <div class="education-card card-flat animate-fade-in-up stagger-{{ i + 1 }}">
                  <div class="edu-header">
                    <h3 class="text-h4">{{ edu.degree }}</h3>
                    <span class="chip-outline">{{ edu.startDate }} — {{ edu.endDate }}</span>
                  </div>
                  <p class="text-body-sm text-secondary">{{ edu.institution }}</p>
                  <p class="text-body-sm text-secondary">{{ edu.field }}</p>
                  @if (edu.grade) {
                    <p class="text-body-sm text-accent mt-sm">{{ edu.grade }}</p>
                  }
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- Certifications -->
      @if (profileService.certifications().length > 0) {
        <section class="section">
          <div class="container container-sm">
            <app-section-header label="Certifications" title="Professional Certifications"></app-section-header>
            <div class="grid grid-2">
              @for (cert of profileService.certifications(); track cert.name; let i = $index) {
                <div class="cert-card card-flat animate-fade-in-up stagger-{{ i + 1 }}">
                  <h4 class="text-h4">{{ cert.name }}</h4>
                  <p class="text-body-sm text-secondary">{{ cert.issuer }}</p>
                  <span class="text-caption text-tertiary mt-sm">{{ cert.date }}</span>
                </div>
              }
            </div>
          </div>
        </section>
      }
    }
  `,
  styles: [`
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .education-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
  `],
})
export class AboutComponent {
  profileService = inject(ProfileService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    const p = this.profileService.profile();
    if (p) {
      this.seoService.update({
        title: `About ${p.firstName} ${p.lastName}`,
        description: p.summary,
      });
    }
  }
}
