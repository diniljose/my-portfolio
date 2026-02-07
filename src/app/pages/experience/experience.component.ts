import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { Experience } from '../../core/models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink],
  template: `
    <section class="section">
      <div class="container container-md">
        <app-section-header
          label="Experience"
          title="Work History"
          subtitle="My professional journey building enterprise applications">
        </app-section-header>

        <div class="experience-list">
          @for (item of profileService.experience(); track item.id; let i = $index; let last = $last) {
            <div class="experience-card animate-fade-in-up stagger-{{ i + 1 }}">
              <div class="exp-layout">
                <!-- Left: Text Content -->
                <div class="exp-content">
                  <!-- Header -->
                  <div class="exp-header">
                    <div class="exp-marker">
                      <div class="marker-dot"></div>
                      @if (!last) {
                        <div class="marker-line"></div>
                      }
                    </div>
                    <div class="exp-title-area">
                      <div class="exp-title-row">
                        <div>
                          <h3 class="exp-role">{{ item.role }}</h3>
                          <p class="exp-company">{{ item.company }}</p>
                          <p class="exp-location">{{ item.location }}</p>
                        </div>
                        <span class="exp-date">
                          {{ formatDate(item.startDate) }} — {{ item.endDate ? formatDate(item.endDate) : 'Present' }}
                        </span>
                      </div>
                      <p class="exp-description">{{ item.description }}</p>
                    </div>
                  </div>

                  <!-- Achievements -->
                  @if (item.achievements.length > 0) {
                    <div class="exp-achievements">
                      <ul class="achievements-list">
                        @for (achievement of item.achievements; track achievement) {
                          <li>
                            <span class="achievement-icon">→</span>
                            <span>{{ achievement }}</span>
                          </li>
                        }
                      </ul>
                    </div>
                  }

                  <!-- Tech Stack -->
                  @if (item.technologies.length > 0) {
                    <div class="exp-tech">
                      @for (tech of item.technologies; track tech) {
                        <span class="tech-tag">{{ tech }}</span>
                      }
                    </div>
                  }
                </div>

                <!-- Right: Visual Demo (Sidebar) -->
                <div class="exp-visual">
                  @switch (getDemoType(item)) {
                    @case ('government') {
                      <!-- Real-time APIs -->
                      <div class="visual-card">
                        <div class="visual-label">Real-time APIs</div>
                        <div class="api-flow-compact">
                          <div class="node-row">
                            <div class="node client"><span>REST</span></div>
                            <div class="connector"><span class="dot-flow"></span></div>
                            <div class="node ws active"><span>WS</span></div>
                            <div class="connector reverse"><span class="dot-flow"></span></div>
                            <div class="node soap"><span>SOAP</span></div>
                          </div>
                        </div>
                      </div>
                      <!-- Security -->
                      <div class="visual-card">
                        <div class="visual-label">Security Layers</div>
                        <div class="security-stack">
                          <div class="sec-item" [class.on]="demoState()"><span>🔑</span> OAuth</div>
                          <div class="sec-item" [class.on]="!demoState()"><span>🎫</span> JWT</div>
                          <div class="sec-item on"><span>👥</span> RBAC</div>
                        </div>
                      </div>
                      <!-- DB Perf -->
                      <div class="visual-card">
                        <div class="visual-label">DB Perf +30%</div>
                        <div class="mini-bars">
                          <div class="mini-bar"><div class="fill before" style="width:55%"></div><span>Before</span></div>
                          <div class="mini-bar"><div class="fill after" style="width:85%"></div><span>After</span></div>
                        </div>
                      </div>
                    }
                    @case ('healthcare') {
                      <!-- Performance -->
                      <div class="visual-card">
                        <div class="visual-label">Performance +40%</div>
                        <div class="perf-ring-small">
                          <svg viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--bg-tertiary)" stroke-width="3"/>
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="80, 100" stroke-linecap="round" transform="rotate(-90 18 18)"/>
                          </svg>
                          <span class="ring-val">85</span>
                        </div>
                      </div>
                      <!-- Cloud -->
                      <div class="visual-card">
                        <div class="visual-label">AWS Stack</div>
                        <div class="cloud-mini">
                          <div class="cloud-row"><span class="cloud-icon" [class.pulse]="demoState()">⚖️</span> LB</div>
                          <div class="cloud-row"><span class="cloud-icon" [class.pulse]="!demoState()">🖥️</span> EC2</div>
                          <div class="cloud-row"><span class="cloud-icon">🗄️</span> RDS</div>
                        </div>
                      </div>
                      <!-- CI/CD -->
                      <div class="visual-card">
                        <div class="visual-label">CI/CD -40% Deploy</div>
                        <div class="pipeline-mini">
                          <span class="stage" [class.active]="pipelineStage() >= 1">📝</span>
                          <span class="arrow">→</span>
                          <span class="stage" [class.active]="pipelineStage() >= 2">🔨</span>
                          <span class="arrow">→</span>
                          <span class="stage" [class.active]="pipelineStage() >= 3">🧪</span>
                          <span class="arrow">→</span>
                          <span class="stage" [class.active]="pipelineStage() >= 4">🚀</span>
                        </div>
                      </div>
                    }
                    @default {
                      <div class="visual-card">
                        <div class="visual-label">Tech Stack</div>
                        <div class="tech-mini-cloud">
                          @for (tech of item.technologies.slice(0, 4); track tech) {
                            <span class="tech-mini">{{ tech }}</span>
                          }
                        </div>
                      </div>
                    }
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .experience-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .experience-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .experience-card:hover {
      border-color: var(--accent);
    }

    /* Layout: Text left, Visual right */
    .exp-layout {
      display: grid;
      grid-template-columns: 1fr 160px;
      gap: 1.5rem;
    }

    /* Left Content */
    .exp-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .exp-header {
      display: flex;
      gap: 1rem;
    }

    .exp-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .marker-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-subtle);
    }

    .marker-line {
      width: 2px;
      flex: 1;
      min-height: 30px;
      background: var(--border-subtle);
      margin-top: 0.5rem;
    }

    .exp-title-area {
      flex: 1;
    }

    .exp-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
    }

    .exp-role {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 0.125rem;
    }

    .exp-company {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--accent);
    }

    .exp-location {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .exp-date {
      padding: 0.25rem 0.625rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 100px;
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .exp-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    /* Achievements */
    .achievements-list {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .achievements-list li {
      display: flex;
      gap: 0.5rem;
      font-size: 0.8125rem;
      line-height: 1.5;
      color: var(--text-secondary);
    }

    .achievement-icon {
      color: var(--accent);
      font-weight: 600;
      flex-shrink: 0;
    }

    /* Tech Stack */
    .exp-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-subtle);
    }

    .tech-tag {
      padding: 0.1875rem 0.5rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 100px;
      font-size: 0.6875rem;
      color: var(--text-secondary);
    }

    /* Right Visual Sidebar */
    .exp-visual {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-left: 1rem;
      border-left: 1px solid var(--border-subtle);
    }

    .visual-card {
      background: var(--bg-secondary);
      border-radius: 8px;
      padding: 0.625rem;
    }

    .visual-label {
      font-size: 0.5625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin-bottom: 0.5rem;
    }

    /* API Flow Compact */
    .api-flow-compact .node-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2px;
    }

    .api-flow-compact .node {
      padding: 0.25rem 0.375rem;
      background: var(--bg-tertiary);
      border-radius: 4px;
      font-size: 0.5rem;
      font-weight: 600;
      color: var(--text-tertiary);
    }

    .api-flow-compact .node.active {
      background: var(--accent);
      color: #fff;
    }

    .api-flow-compact .node.soap {
      background: #8b5cf6;
      color: #fff;
    }

    .api-flow-compact .connector {
      flex: 1;
      height: 2px;
      background: var(--border-subtle);
      position: relative;
      min-width: 8px;
    }

    .dot-flow {
      position: absolute;
      top: -2px;
      left: 0;
      width: 4px;
      height: 4px;
      background: var(--accent);
      border-radius: 50%;
      animation: flowDot 1s linear infinite;
    }

    .connector.reverse .dot-flow {
      animation: flowDotReverse 1s linear infinite;
    }

    @keyframes flowDot {
      from { left: 0; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      to { left: 100%; opacity: 0; }
    }

    @keyframes flowDotReverse {
      from { left: 100%; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      to { left: 0; opacity: 0; }
    }

    /* Security Stack */
    .security-stack {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .sec-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.375rem;
      background: var(--bg-tertiary);
      border-radius: 4px;
      font-size: 0.5625rem;
      color: var(--text-tertiary);
      transition: all 0.3s ease;
    }

    .sec-item.on {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }

    .sec-item span:first-child {
      font-size: 0.625rem;
    }

    /* Mini Bars */
    .mini-bars {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .mini-bar {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .mini-bar .fill {
      height: 6px;
      border-radius: 3px;
      background: var(--bg-tertiary);
    }

    .mini-bar .fill.after {
      background: linear-gradient(90deg, var(--accent), #10b981);
    }

    .mini-bar span {
      font-size: 0.5rem;
      color: var(--text-tertiary);
      flex-shrink: 0;
    }

    /* Perf Ring */
    .perf-ring-small {
      position: relative;
      width: 48px;
      height: 48px;
      margin: 0 auto;
    }

    .perf-ring-small svg {
      width: 100%;
      height: 100%;
    }

    .ring-val {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.75rem;
      font-weight: 700;
      color: #10b981;
    }

    /* Cloud Mini */
    .cloud-mini {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .cloud-row {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.5625rem;
      color: var(--text-secondary);
    }

    .cloud-icon {
      font-size: 0.75rem;
      transition: transform 0.3s ease;
    }

    .cloud-icon.pulse {
      animation: iconPulse 1s ease-in-out infinite;
    }

    @keyframes iconPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    /* Pipeline Mini */
    .pipeline-mini {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2px;
    }

    .pipeline-mini .stage {
      font-size: 0.875rem;
      opacity: 0.3;
      transition: opacity 0.3s ease;
    }

    .pipeline-mini .stage.active {
      opacity: 1;
    }

    .pipeline-mini .arrow {
      font-size: 0.5rem;
      color: var(--text-tertiary);
    }

    /* Tech Mini Cloud */
    .tech-mini-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .tech-mini {
      padding: 0.125rem 0.375rem;
      background: rgba(var(--accent-rgb), 0.1);
      border-radius: 4px;
      font-size: 0.5rem;
      color: var(--accent);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .exp-layout {
        grid-template-columns: 1fr;
      }

      .exp-visual {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding-left: 0;
        padding-top: 1rem;
        border-left: none;
        border-top: 1px solid var(--border-subtle);
      }

      .visual-card {
        flex: 1;
        min-width: 100px;
      }
    }

    @media (max-width: 640px) {
      .experience-card {
        padding: 1.25rem;
      }

      .exp-header {
        flex-direction: column;
        gap: 0.75rem;
      }

      .exp-marker {
        display: none;
      }

      .exp-title-row {
        flex-direction: column;
        gap: 0.5rem;
      }

      .exp-date {
        align-self: flex-start;
      }

      .exp-visual {
        flex-direction: column;
      }

      .visual-card {
        min-width: auto;
      }
    }
  `],
})
export class ExperienceComponent implements OnInit, OnDestroy {
  profileService = inject(ProfileService);
  
  demoState = signal(false);
  pipelineStage = signal(1);
  private demoInterval: ReturnType<typeof setInterval> | null = null;
  private pipelineInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.demoInterval = setInterval(() => {
        this.demoState.set(!this.demoState());
      }, 2000);

      this.pipelineInterval = setInterval(() => {
        const current = this.pipelineStage();
        this.pipelineStage.set(current >= 4 ? 1 : current + 1);
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.demoInterval) clearInterval(this.demoInterval);
    if (this.pipelineInterval) clearInterval(this.pipelineInterval);
  }

  getDemoType(item: Experience): string {
    const company = item.company.toLowerCase();
    const id = item.id?.toLowerCase() || '';
    
    if (company.includes('ministry') || company.includes('ebla') || id === 'ebla') {
      return 'government';
    }
    if (company.includes('fedo') || id === 'fedo') {
      return 'healthcare';
    }
    return 'default';
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
