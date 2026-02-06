import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (profileService.profile(); as profile) {
      <section class="section resume-page">
        <div class="container container-sm">
          <!-- Print button -->
          <div class="no-print resume-toolbar">
            <button class="btn-primary" (click)="print()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect width="12" height="8" x="6" y="14"/>
              </svg>
              Print / Save as PDF
            </button>
          </div>

          <!-- Resume Content -->
          <div class="resume-content">
            <!-- Header -->
            <div class="resume-header">
              <h1 class="resume-name">{{ profile.firstName }} {{ profile.lastName }}</h1>
              <p class="resume-headline">{{ profile.headline }}</p>
              <div class="resume-contact">
                <span>{{ profile.email }}</span>
                @if (profile.phone) {
                  <span>{{ profile.phone }}</span>
                }
                <span>{{ profile.location }}</span>
              </div>
              <div class="resume-links">
                @for (social of profile.socials; track social.platform) {
                  <a [href]="social.url" target="_blank">{{ social.label || social.platform }}</a>
                }
              </div>
            </div>

            <!-- Summary -->
            <div class="resume-section">
              <h2 class="resume-section-title">Professional Summary</h2>
              <p>{{ profile.summary }}</p>
            </div>

            <!-- Experience -->
            @if (profileService.experience().length > 0) {
              <div class="resume-section">
                <h2 class="resume-section-title">Work Experience</h2>
                @for (exp of profileService.experience(); track exp.id) {
                  <div class="resume-entry">
                    <div class="resume-entry-header">
                      <div>
                        <h3 class="resume-entry-title">{{ exp.role }}</h3>
                        <p class="resume-entry-subtitle">{{ exp.company }} · {{ exp.location }}</p>
                      </div>
                      <span class="resume-entry-date">
                        {{ formatDate(exp.startDate) }} — {{ exp.endDate ? formatDate(exp.endDate) : 'Present' }}
                      </span>
                    </div>
                    <ul class="resume-achievements">
                      @for (a of exp.achievements; track a) {
                        <li>{{ a }}</li>
                      }
                    </ul>
                  </div>
                }
              </div>
            }

            <!-- Skills -->
            @if (profileService.skills().length > 0) {
              <div class="resume-section">
                <h2 class="resume-section-title">Technical Skills</h2>
                <div class="resume-skills">
                  @for (cat of skillCategories(); track cat.name) {
                    <div class="resume-skill-row">
                      <strong>{{ cat.name }}:</strong>
                      <span>{{ cat.skills.join(', ') }}</span>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Projects -->
            @if (profileService.projects().length > 0) {
              <div class="resume-section page-break">
                <h2 class="resume-section-title">Key Projects</h2>
                @for (proj of profileService.projects(); track proj.id) {
                  <div class="resume-entry">
                    <div class="resume-entry-header">
                      <h3 class="resume-entry-title">{{ proj.title }}</h3>
                      <span class="resume-entry-date">{{ proj.category }}</span>
                    </div>
                    <p class="resume-entry-subtitle">{{ proj.techStack.join(' · ') }}</p>
                    <ul class="resume-achievements">
                      @for (h of proj.highlights; track h) {
                        <li>{{ h }}</li>
                      }
                    </ul>
                  </div>
                }
              </div>
            }

            <!-- Education -->
            @if (profileService.education().length > 0) {
              <div class="resume-section">
                <h2 class="resume-section-title">Education</h2>
                @for (edu of profileService.education(); track edu.institution) {
                  <div class="resume-entry">
                    <div class="resume-entry-header">
                      <div>
                        <h3 class="resume-entry-title">{{ edu.degree }} — {{ edu.field }}</h3>
                        <p class="resume-entry-subtitle">{{ edu.institution }}</p>
                      </div>
                      <span class="resume-entry-date">{{ edu.startDate }} — {{ edu.endDate }}</span>
                    </div>
                    @if (edu.grade) {
                      <p>{{ edu.grade }}</p>
                    }
                  </div>
                }
              </div>
            }

            <!-- Certifications -->
            @if (profileService.certifications().length > 0) {
              <div class="resume-section">
                <h2 class="resume-section-title">Certifications</h2>
                <ul class="resume-cert-list">
                  @for (cert of profileService.certifications(); track cert.name) {
                    <li>{{ cert.name }} — {{ cert.issuer }} ({{ cert.date }})</li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    .resume-toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 2rem;
    }

    .resume-content {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 3rem;
    }

    .resume-header {
      text-align: center;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid var(--border-subtle);
      margin-bottom: 1.5rem;
    }

    .resume-name {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .resume-headline {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }

    .resume-contact {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 0.75rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);

      span:not(:last-child)::after {
        content: '·';
        margin-left: 1rem;
        color: var(--text-tertiary);
      }
    }

    .resume-links {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 0.5rem;
      font-size: 0.8125rem;

      a {
        color: var(--accent);
      }
    }

    .resume-section {
      margin-top: 1.5rem;
    }

    .resume-section-title {
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 1rem;
    }

    .resume-entry {
      margin-bottom: 1.25rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .resume-entry-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .resume-entry-title {
      font-size: 1rem;
      font-weight: 600;
    }

    .resume-entry-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .resume-entry-date {
      font-size: 0.8125rem;
      color: var(--text-tertiary);
      white-space: nowrap;
    }

    .resume-achievements {
      margin-top: 0.5rem;
      padding-left: 1.25rem;
      list-style: disc;

      li {
        font-size: 0.875rem;
        line-height: 1.6;
        margin-bottom: 0.25rem;
        color: var(--text-secondary);
      }
    }

    .resume-skills {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .resume-skill-row {
      font-size: 0.875rem;
      line-height: 1.6;

      strong {
        color: var(--text-primary);
        margin-right: 0.25rem;
      }

      span {
        color: var(--text-secondary);
      }
    }

    .resume-cert-list {
      list-style: disc;
      padding-left: 1.25rem;

      li {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
      }
    }

    @media print {
      .resume-content {
        border: none;
        padding: 0;
        background: none;
      }

      .resume-name {
        color: #000;
      }
    }

    @media (max-width: 640px) {
      .resume-content {
        padding: 1.5rem;
      }
    }
  `],
})
export class ResumeComponent {
  profileService = inject(ProfileService);

  print(): void {
    window.print();
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  skillCategories(): { name: string; skills: string[] }[] {
    const map = new Map<string, string[]>();
    this.profileService.skills().forEach(s => {
      const cat = s.category.charAt(0).toUpperCase() + s.category.slice(1);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(s.name);
    });
    return Array.from(map.entries()).map(([name, skills]) => ({ name, skills }));
  }
}
