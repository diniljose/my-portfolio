import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProfileService, SeoService } from '../../core/services';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProjectCardComponent],
  template: `
    @if (profileService.loading()) {
      <div class="loading-state section">
        <div class="container text-center">
          <div class="loader-modern">
            <svg class="loader-svg" viewBox="0 0 50 50">
              <circle class="loader-circle" cx="25" cy="25" r="20"></circle>
            </svg>
          </div>
          <p class="text-secondary mt-lg">Loading experience...</p>
        </div>
      </div>
    } @else if (profileService.error()) {
      <div class="error-state section">
        <div class="container text-center">
          <h2 class="text-h2">Profile not found</h2>
          <p class="text-secondary mt-sm">{{ profileService.error() }}</p>
        </div>
      </div>
    } @else {
      @if (profileService.profile(); as profile) {
      <!-- Hero Section -->
      <section class="hero" #heroSection>
        <canvas #particleCanvas class="particles-canvas"></canvas>
        
        <!-- Subtle grid background -->
        <div class="hero-grid" aria-hidden="true"></div>
        
        <!-- Gradient accent -->
        <div class="hero-gradient" aria-hidden="true"></div>

        <div class="container hero-container">
          <div class="hero-content">
            <!-- Status Badge -->
            <div class="status-badge animate-fade-in-up" [class]="profile.availability">
              <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
              </svg>
              <span>{{ profile.availability === 'available' ? 'Open to Work' : 'Currently Engaged' }}</span>
            </div>

            <!-- Name & Title -->
            <div class="hero-heading animate-fade-in-up stagger-1">
              <h1 class="hero-name font-display">
                {{ profile.firstName }}<br/>
                <span class="name-accent">{{ profile.lastName }}</span>
              </h1>
            </div>

            <!-- Role with animated typing effect styling -->
            <div class="hero-role animate-fade-in-up stagger-2">
              <div class="role-line"></div>
              <span class="role-text font-mono">{{ profile.headline }}</span>
            </div>

            <!-- Summary -->
            <p class="hero-summary animate-fade-in-up stagger-3">
              {{ profile.summary }}
            </p>

            <!-- Tech Stack -->
            <div class="tech-stack animate-fade-in-up stagger-4">
              <span class="tech-label">Tech Stack</span>
              <div class="tech-icons">
                @for (skill of topSkills; track skill; let i = $index) {
                  <div class="tech-item" [style.animation-delay]="(i * 0.08) + 's'" [title]="skill">
                    <svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M7 7h.01M7 12h.01M7 17h.01M12 7h5M12 12h5M12 17h5"/>
                    </svg>
                    <span class="tech-name">{{ skill }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="hero-cta animate-fade-in-up stagger-5">
              <a [routerLink]="['projects']" class="btn-primary-pro">
                <span>View Projects</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
              <a [routerLink]="['contact']" class="btn-outline-pro">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Get in Touch</span>
              </a>
              @if (profile.resumeUrl) {
                <a [href]="profile.resumeUrl" target="_blank" class="btn-text-pro">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                  <span>Resume</span>
                </a>
              }
            </div>

            <!-- Social Links -->
            <div class="hero-social animate-fade-in-up stagger-6">
              @for (social of profile.socials; track social.platform) {
                <a [href]="social.url" target="_blank" rel="noopener" class="social-btn" [attr.aria-label]="social.platform">
                  <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" [innerHTML]="getSocialSvgPath(social.platform)"></svg>
                </a>
              }
            </div>
          </div>

          <!-- Project Highlights Showcase -->
          <div class="hero-showcase animate-fade-in stagger-3">
            <div class="showcase-container">
              <!-- Floating Project Cards -->
              <div class="project-highlights">
                @for (highlight of projectHighlights; track highlight.name; let i = $index) {
                  <a class="highlight-card" [routerLink]="['/p', profileService.profile()?.slug, 'projects', highlight.slug]" [style.--index]="i">
                    <div class="highlight-icon" [innerHTML]="sanitize(highlight.icon)"></div>
                    <div class="highlight-info">
                      <span class="highlight-name">{{ highlight.name }}</span>
                      <span class="highlight-category">{{ highlight.category }}</span>
                    </div>
                  </a>
                }
              </div>
              <!-- Center Stats -->
              <div class="showcase-center">
                <div class="center-glow"></div>
                <div class="center-content">
                  <span class="center-value font-display">{{ profileService.projects().length }}+</span>
                  <span class="center-label">Projects</span>
                </div>
              </div>
              <!-- Tech Labels -->
              <div class="floating-techs">
                <span class="float-tech t1">Angular</span>
                <span class="float-tech t2">NestJS</span>
                <span class="float-tech t3">AWS</span>
                <span class="float-tech t4">Docker</span>
              </div>
            </div>
          </div>

          <!-- Scroll Indicator -->
          <div class="scroll-cue animate-fade-in stagger-7">
            <div class="scroll-line">
              <div class="scroll-dot"></div>
            </div>
            <span class="scroll-label font-mono">scroll</span>
          </div>
        </div>
      </section>

      <!-- Expertise Section -->
      <section class="expertise-section section">
        <div class="container">
          <div class="section-intro animate-fade-in-up">
            <span class="section-label font-mono">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
              </svg>
              Technical Expertise
            </span>
            <h2 class="section-title font-display">Skills & Technologies</h2>
            <p class="section-desc">Core competencies developed over {{ getYearsOfExperience() }}+ years of building scalable applications</p>
          </div>

          <div class="expertise-grid">
            @for (category of skillCategories; track category.name; let i = $index) {
              <div class="expertise-card animate-fade-in-up" [style.animation-delay]="(i * 0.1) + 's'">
                <div class="card-icon" [innerHTML]="sanitize(category.svgIcon)"></div>
                <h3 class="card-title">{{ category.name }}</h3>
                <ul class="card-skills">
                  @for (skill of category.skills; track skill) {
                    <li>{{ skill }}</li>
                  }
                </ul>
                <div class="card-accent"></div>
              </div>
            }
          </div>

          <div class="section-cta animate-fade-in-up">
            <a [routerLink]="['skills']" class="btn-outline-pro">
              <span>View All Skills</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Featured Projects -->
      @if (profileService.featuredProjects().length > 0) {
        <section class="projects-section section">
          <div class="container">
            <div class="section-intro animate-fade-in-up">
              <span class="section-label font-mono">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                Featured Work
              </span>
              <h2 class="section-title font-display">Selected Projects</h2>
              <p class="section-desc">Impactful solutions crafted with precision and purpose</p>
            </div>

            <div class="projects-grid">
              @for (project of profileService.featuredProjects(); track project.id; let i = $index) {
                <div class="project-item animate-fade-in-up" [style.animation-delay]="(i * 0.12) + 's'">
                  <span class="project-index font-mono">0{{ i + 1 }}</span>
                  <app-project-card
                    [project]="project"
                    [profileSlug]="profileService.currentSlug()">
                  </app-project-card>
                </div>
              }
            </div>

            <div class="section-cta animate-fade-in-up">
              <a [routerLink]="['projects']" class="btn-primary-pro">
                <span>View All Projects</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      }

      <!-- Technical Implementations Section -->
      <section class="implementations-section section">
        <div class="container">
          <div class="section-intro animate-fade-in-up">
            <span class="section-label font-mono">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              Technical Deep Dive
            </span>
            <h2 class="section-title font-display">Key Implementations</h2>
            <p class="section-desc">Complex challenges solved with innovative solutions across different domains</p>
          </div>

          <div class="implementations-grid">
            <!-- Fedo Vitals - Face Detection & Vitals -->
            <article class="impl-card animate-fade-in-up" [routerLink]="['projects', 'fedo-vitals']">
              <div class="impl-visual">
                <div class="impl-demo face-vitals-demo">
                  <div class="face-scanner-wrapper">
                    <div class="scanner-frame-box">
                      <div class="face-silhouette" [class.aligned]="faceAligned()">
                        <svg viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="18" r="8" stroke="currentColor" stroke-width="1.5"/>
                          <path d="M12 40c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                      </div>
                      <div class="scanner-corners">
                        <span class="corner-mark tl"></span>
                        <span class="corner-mark tr"></span>
                        <span class="corner-mark bl"></span>
                        <span class="corner-mark br"></span>
                      </div>
                      <div class="scan-beam"></div>
                      <div class="alignment-indicator" [class.success]="faceAligned()">
                        <span class="indicator-dot"></span>
                        <span class="indicator-text">{{ faceAligned() ? 'Aligned' : 'Align Face' }}</span>
                      </div>
                    </div>
                    <div class="vitals-readout">
                      <div class="vital-signal">
                        <svg viewBox="0 0 100 24" preserveAspectRatio="none">
                          <path d="M0,12 L10,12 L15,12 L18,4 L22,20 L26,8 L30,16 L34,12 L45,12 L50,12 L55,12 L58,6 L62,18 L66,10 L70,14 L74,12 L100,12" fill="none" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                      </div>
                      <div class="vital-metrics">
                        <div class="vital-item"><span class="vital-val">72</span><span class="vital-unit">BPM</span></div>
                        <div class="vital-item"><span class="vital-val">98</span><span class="vital-unit">SpO2</span></div>
                        <div class="vital-item"><span class="vital-val">120/80</span><span class="vital-unit">BP</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span class="impl-badge ai">AI/ML</span>
              </div>
              <div class="impl-content">
                <h3 class="impl-title">Real-time Face Detection & Vital Signs</h3>
                <div class="impl-project-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span>Fedo Vitals</span>
                </div>
                <p class="impl-desc">14-second facial video analysis using WebRTC to calculate heart rate, SpO2, and blood pressure with Web Workers for parallel signal processing.</p>
                <ul class="impl-features">
                  <li>Face alignment & distance tracking</li>
                  <li>rPPG signal extraction</li>
                  <li>Multi-threaded computation</li>
                </ul>
                <div class="impl-tech-stack">
                  <span>WebRTC</span>
                  <span>Web Workers</span>
                  <span>TensorFlow.js</span>
                </div>
              </div>
            </article>

            <!-- E-Visa - OCR Document Scanning -->
            <article class="impl-card animate-fade-in-up stagger-1" [routerLink]="['projects', 'evisa-portal']">
              <div class="impl-visual">
                <div class="impl-demo ocr-demo">
                  <div class="document-scanner">
                    <div class="passport-frame">
                      <div class="passport-header">
                        <div class="passport-title"></div>
                        <div class="passport-emblem"></div>
                      </div>
                      <div class="passport-body">
                        <div class="passport-photo"></div>
                        <div class="passport-fields">
                          <div class="field-line w-80"></div>
                          <div class="field-line w-60 highlight"></div>
                          <div class="field-line w-70"></div>
                          <div class="field-line w-50"></div>
                        </div>
                      </div>
                      <div class="passport-mrz">
                        <div class="mrz-row"></div>
                        <div class="mrz-row"></div>
                      </div>
                      <div class="scanner-beam-h"></div>
                    </div>
                    <div class="ocr-results">
                      <div class="ocr-row">
                        <span class="ocr-label">Name</span>
                        <span class="ocr-value typing">JOHN DOE</span>
                      </div>
                      <div class="ocr-row">
                        <span class="ocr-label">Passport</span>
                        <span class="ocr-value">A12345678</span>
                      </div>
                      <div class="ocr-row">
                        <span class="ocr-label">Nationality</span>
                        <span class="ocr-value">USA</span>
                      </div>
                      <div class="ocr-accuracy">
                        <span class="accuracy-label">Accuracy</span>
                        <div class="accuracy-bar"><div class="accuracy-fill"></div></div>
                        <span class="accuracy-val">99.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span class="impl-badge ocr">OCR</span>
              </div>
              <div class="impl-content">
                <h3 class="impl-title">Tesseract OCR Document Extraction</h3>
                <div class="impl-project-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span>Kuwait E-Visa Portal</span>
                </div>
                <p class="impl-desc">Identity document and passport text extraction with 99.2% accuracy. MRZ parsing and automatic field validation for visa applications.</p>
                <ul class="impl-features">
                  <li>MRZ code parsing & validation</li>
                  <li>Multi-language OCR support</li>
                  <li>Image preprocessing pipeline</li>
                </ul>
                <div class="impl-tech-stack">
                  <span>Tesseract.js</span>
                  <span>Canvas API</span>
                  <span>Sharp</span>
                </div>
              </div>
            </article>

            <!-- Exam Admin - Question Bank, Proctoring & Real-time Evaluation -->
            <article class="impl-card animate-fade-in-up stagger-2" [routerLink]="['projects', 'police-exam-system']">
              <div class="impl-visual">
                <div class="impl-demo exam-demo">
                  <div class="exam-interface">
                    <div class="exam-header-bar">
                      <div class="exam-timer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>45:30</span>
                      </div>
                      <div class="proctor-cam">
                        <div class="cam-dot"></div>
                        <span>LIVE</span>
                      </div>
                    </div>
                    <div class="exam-content">
                      <div class="question-panel">
                        <div class="q-number">Q.15</div>
                        <div class="q-options">
                          <div class="option"><span class="opt-letter">A</span><span class="opt-text"></span></div>
                          <div class="option selected"><span class="opt-letter">B</span><span class="opt-text"></span></div>
                          <div class="option"><span class="opt-letter">C</span><span class="opt-text"></span></div>
                          <div class="option"><span class="opt-letter">D</span><span class="opt-text"></span></div>
                        </div>
                      </div>
                      <div class="exam-score-mini">
                        <div class="score-ring">
                          <svg viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--bg-tertiary)" stroke-width="3"/>
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="75, 100" stroke-linecap="round" transform="rotate(-90 18 18)"/>
                          </svg>
                          <span>85%</span>
                        </div>
                        <div class="question-nav">
                          <span class="nav-dot answered"></span>
                          <span class="nav-dot answered"></span>
                          <span class="nav-dot current"></span>
                          <span class="nav-dot"></span>
                          <span class="nav-dot flagged"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span class="impl-badge exam">Exam</span>
              </div>
              <div class="impl-content">
                <h3 class="impl-title">Secure Exam Platform & Real-time Evaluation</h3>
                <div class="impl-project-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span>Police Exam System</span>
                </div>
                <p class="impl-desc">Secure online exam platform with dynamic question banks, randomized tests, real-time answer evaluation, and automated scoring with instant results.</p>
                <ul class="impl-features">
                  <li>Dynamic question bank & randomization</li>
                  <li>Real-time answer evaluation & scoring</li>
                  <li>Admin panel for candidate tracking</li>
                </ul>
                <div class="impl-tech-stack">
                  <span>Angular 13</span>
                  <span>NestJS</span>
                  <span>MongoDB</span>
                </div>
              </div>
            </article>

            <!-- Fedo HSA - Banking & Insurance -->
            <article class="impl-card animate-fade-in-up stagger-3" [routerLink]="['projects', 'fedo-hsa']">
              <div class="impl-visual">
                <div class="impl-demo banking-demo">
                  <div class="banking-interface">
                    <div class="bank-cards">
                      <div class="bank-card primary">
                        <div class="card-chip"></div>
                        <div class="card-number">•••• •••• •••• 4532</div>
                        <div class="card-details">
                          <span class="card-name">DINIL JOSE</span>
                          <span class="card-expiry">12/28</span>
                        </div>
                      </div>
                    </div>
                    <div class="transaction-flow">
                      <div class="flow-node source">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                      </div>
                      <div class="flow-path">
                        <div class="flow-particle p1"></div>
                        <div class="flow-particle p2"></div>
                        <div class="flow-particle p3"></div>
                      </div>
                      <div class="flow-node dest">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </div>
                    </div>
                    <div class="recent-tx">
                      <div class="tx-row debit"><span class="tx-desc">Insurance Premium</span><span class="tx-amt">-₹2,500</span></div>
                      <div class="tx-row credit"><span class="tx-desc">Claim Settled</span><span class="tx-amt">+₹15,000</span></div>
                    </div>
                  </div>
                </div>
                <span class="impl-badge fintech">Fintech</span>
              </div>
              <div class="impl-content">
                <h3 class="impl-title">Health Savings & Insurance APIs</h3>
                <div class="impl-project-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span>Fedo HSA</span>
                </div>
                <p class="impl-desc">India's first Health Savings Account with Neo-bank API integration. Real-time transactions, insurance premium payments, and claim processing.</p>
                <ul class="impl-features">
                  <li>UPI & NEFT/RTGS integration</li>
                  <li>Insurance claim automation</li>
                  <li>PCI-DSS compliant storage</li>
                </ul>
                <div class="impl-tech-stack">
                  <span>Neo-bank APIs</span>
                  <span>Razorpay</span>
                  <span>Redis</span>
                </div>
              </div>
            </article>

            <!-- Admin Dashboard - Analytics -->
            <article class="impl-card animate-fade-in-up stagger-4" [routerLink]="['projects', 'fedo-admin-panel']">
              <div class="impl-visual">
                <div class="impl-demo dashboard-demo">
                  <div class="dashboard-interface">
                    <div class="dash-chrome">
                      <div class="chrome-dots"><span></span><span></span><span></span></div>
                      <div class="chrome-title"></div>
                    </div>
                    <div class="dash-layout">
                      <div class="dash-nav">
                        <div class="nav-item active"></div>
                        <div class="nav-item"></div>
                        <div class="nav-item"></div>
                        <div class="nav-item"></div>
                        <div class="nav-item"></div>
                      </div>
                      <div class="dash-body">
                        <div class="dash-metrics">
                          <div class="metric-box"><div class="metric-spark up"></div></div>
                          <div class="metric-box"><div class="metric-spark down"></div></div>
                          <div class="metric-box"><div class="metric-spark up"></div></div>
                        </div>
                        <div class="dash-chart">
                          <svg viewBox="0 0 120 40" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.3"/>
                                <stop offset="100%" style="stop-color:var(--accent);stop-opacity:0"/>
                              </linearGradient>
                            </defs>
                            <path class="chart-area" d="M0,35 L15,28 L30,32 L45,20 L60,25 L75,15 L90,18 L105,8 L120,12 L120,40 L0,40 Z" fill="url(#chartGrad)"/>
                            <path class="chart-line" d="M0,35 L15,28 L30,32 L45,20 L60,25 L75,15 L90,18 L105,8 L120,12" fill="none" stroke="var(--accent)" stroke-width="2"/>
                          </svg>
                        </div>
                        <div class="dash-table">
                          <div class="table-row"><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>
                          <div class="table-row"><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span class="impl-badge analytics">Analytics</span>
              </div>
              <div class="impl-content">
                <h3 class="impl-title">Real-time Analytics Dashboard</h3>
                <div class="impl-project-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span>Fedo Admin Panel</span>
                </div>
                <p class="impl-desc">Comprehensive admin dashboard with real-time user analytics, health metrics visualization, and performance monitoring using WebSocket.</p>
                <ul class="impl-features">
                  <li>Real-time data via WebSocket</li>
                  <li>Custom chart visualizations</li>
                  <li>Role-based access control</li>
                </ul>
                <div class="impl-tech-stack">
                  <span>NgRx</span>
                  <span>D3.js</span>
                  <span>Socket.io</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Metrics Section -->
      <section class="metrics-section section">
        <div class="container">
          <div class="metrics-grid">
            <div class="metric-card animate-fade-in-up stagger-1">
              <svg class="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
                <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>
              </svg>
              <div class="metric-value font-display">{{ profileService.experience().length }}<span>+</span></div>
              <div class="metric-label">Companies</div>
            </div>
            <div class="metric-card animate-fade-in-up stagger-2">
              <svg class="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
              </svg>
              <div class="metric-value font-display">{{ profileService.projects().length }}<span>+</span></div>
              <div class="metric-label">Projects Shipped</div>
            </div>
            <div class="metric-card animate-fade-in-up stagger-3">
              <svg class="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <div class="metric-value font-display">{{ profileService.skills().length }}<span>+</span></div>
              <div class="metric-label">Technologies</div>
            </div>
            <div class="metric-card animate-fade-in-up stagger-4">
              <svg class="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <div class="metric-value font-display">{{ getYearsOfExperience() }}<span>+</span></div>
              <div class="metric-label">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact CTA -->
      <section class="contact-cta section">
        <div class="container">
          <div class="cta-wrapper animate-fade-in-up">
            <div class="cta-content">
              <span class="cta-label font-mono">Let's Collaborate</span>
              <h2 class="cta-heading font-display">Have a project in mind?</h2>
              <p class="cta-desc">I'm always interested in discussing new opportunities and innovative ideas.</p>
              <a [routerLink]="['contact']" class="btn-primary-pro btn-lg">
                <span>Start a Conversation</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </a>
            </div>
            <div class="cta-visual" aria-hidden="true">
              <div class="visual-ring"></div>
              <div class="visual-ring"></div>
              <div class="visual-ring"></div>
            </div>
          </div>
        </div>
      </section>
      }
    }
  `,
  styles: [`
    /* ═══ PROFESSIONAL HERO ═══ */
    .hero {
      position: relative;
      overflow: hidden;
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: var(--bg-primary);
    }

    .particles-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .hero-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(var(--accent-rgb), 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--accent-rgb), 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
    }

    .hero-gradient {
      position: absolute;
      top: -50%;
      right: -20%;
      width: 80%;
      height: 150%;
      background: radial-gradient(ellipse, rgba(var(--accent-rgb), 0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    .hero-container {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      min-height: 100vh;
      padding-top: 5rem;
      padding-bottom: 3rem;
    }

    .hero-content {
      max-width: 720px;
    }

    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      font-weight: 500;
      border-radius: 100px;
      margin-bottom: 2rem;
      letter-spacing: 0.01em;
    }

    .status-badge.available {
      background: rgba(16, 185, 129, 0.1);
      color: rgb(16, 185, 129);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .status-icon {
      width: 16px;
      height: 16px;
    }

    /* Hero Name - Professional Typography */
    .hero-heading {
      margin-bottom: 1.5rem;
    }

    .hero-name {
      font-size: clamp(2.75rem, 7vw, 5rem);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: var(--text-primary);
    }

    .name-accent {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Role */
    .hero-role {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .role-line {
      width: 40px;
      height: 2px;
      background: var(--accent);
      flex-shrink: 0;
    }

    .role-text {
      font-size: 1rem;
      color: var(--text-secondary);
      letter-spacing: 0.02em;
    }

    /* Summary */
    .hero-summary {
      font-size: 1.125rem;
      line-height: 1.75;
      color: var(--text-secondary);
      max-width: 540px;
      margin-bottom: 2rem;
    }

    /* Tech Stack */
    .tech-stack {
      margin-bottom: 2.5rem;
    }

    .tech-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-tertiary);
      margin-bottom: 0.75rem;
    }

    .tech-icons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .tech-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.875rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      transition: all 0.2s ease;
      animation: fadeInUp 0.4s ease forwards;
      opacity: 0;
    }

    .tech-item:hover {
      border-color: var(--accent);
      color: var(--accent);
      transform: translateY(-2px);
    }

    .tech-icon {
      width: 16px;
      height: 16px;
      opacity: 0.6;
    }

    /* CTA Buttons */
    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .btn-primary-pro {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #fff;
      background: var(--accent);
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-primary-pro:hover {
      background: var(--accent-dark);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(var(--accent-rgb), 0.25);
    }

    .btn-primary-pro svg {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .btn-primary-pro:hover svg {
      transform: translateX(3px);
    }

    .btn-primary-pro.btn-lg {
      padding: 1rem 2rem;
      font-size: 1rem;
    }

    .btn-outline-pro {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-primary);
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-outline-pro:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: rgba(var(--accent-rgb), 0.05);
    }

    .btn-outline-pro svg {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .btn-outline-pro:hover svg {
      transform: translateX(3px);
    }

    .btn-text-pro {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-text-pro:hover {
      color: var(--accent);
    }

    .btn-text-pro svg {
      width: 16px;
      height: 16px;
    }

    /* Social Links */
    .hero-social {
      display: flex;
      gap: 0.5rem;
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .social-btn:hover {
      border-color: var(--accent);
      background: rgba(var(--accent-rgb), 0.1);
    }

    .social-btn:hover .social-icon {
      color: var(--accent);
    }

    .social-icon {
      width: 18px;
      height: 18px;
      color: var(--text-tertiary);
      transition: color 0.2s ease;
    }

    /* Scroll Indicator */
    .scroll-cue {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .scroll-line {
      width: 1px;
      height: 48px;
      background: var(--border-color);
      position: relative;
      overflow: hidden;
    }

    .scroll-dot {
      width: 3px;
      height: 8px;
      background: var(--accent);
      border-radius: 2px;
      position: absolute;
      left: -1px;
      animation: scrollDown 1.5s ease-in-out infinite;
    }

    @keyframes scrollDown {
      0% { top: 0; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { top: 40px; opacity: 0; }
    }

    .scroll-label {
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-tertiary);
    }

    /* ═══ FEATURE SHOWCASE ═══ */
    .hero-showcase {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 520px;
    }

    .showcase-container {
      position: relative;
      width: 380px;
      height: 480px;
      display: flex;
      flex-direction: column;
    }

    /* ═══ PROJECT HIGHLIGHTS SHOWCASE ═══ */
    .project-highlights {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .highlight-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1rem;
      display: flex;
      gap: 0.75rem;
      align-items: center;
      transition: all 0.3s ease;
      animation: floatCard 4s ease-in-out infinite;
      animation-delay: calc(var(--index) * 0.5s);
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .highlight-card:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    }

    @keyframes floatCard {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    .highlight-icon {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--accent-rgb), 0.1);
      border-radius: 10px;
      color: var(--accent);
    }

    .highlight-icon svg {
      width: 20px;
      height: 20px;
    }

    .highlight-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .highlight-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .highlight-category {
      font-size: 0.6875rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .showcase-center {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
      margin-bottom: 1.5rem;
    }

    .center-glow {
      position: absolute;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(var(--accent-rgb), 0.2) 0%, transparent 70%);
      animation: glowPulse 3s ease-in-out infinite;
    }

    @keyframes glowPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    .center-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 1.25rem 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
    }

    .center-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent);
      line-height: 1;
    }

    .center-label {
      font-size: 0.6875rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .floating-techs {
      display: flex;
      justify-content: center;
      gap: 0.625rem;
      flex-wrap: wrap;
    }

    .float-tech {
      padding: 0.375rem 0.75rem;
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 100px;
      animation: techFloat 5s ease-in-out infinite;
    }

    .float-tech.t1 { animation-delay: 0s; }
    .float-tech.t2 { animation-delay: 0.5s; }
    .float-tech.t3 { animation-delay: 1s; }
    .float-tech.t4 { animation-delay: 1.5s; }

    @keyframes techFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    .feature-stack {
      position: relative;
      flex: 1;
    }

    .feature-card {
      position: absolute;
      inset: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 1.25rem;
      opacity: 0;
      transform: translateX(30px) scale(0.95);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      display: flex;
      flex-direction: column;
    }

    .feature-card.active {
      opacity: 1;
      transform: translateX(0) scale(1);
      pointer-events: auto;
    }

    .feature-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .feature-tag {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      padding: 0.25rem 0.625rem;
      background: rgba(var(--accent-rgb), 0.1);
      border-radius: 100px;
    }

    .feature-label {
      margin-top: auto;
      padding-top: 1rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
      border-top: 1px solid var(--border-subtle);
    }

    /* Status Dot */
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
      transition: all 0.3s ease;
    }

    .status-dot.success {
      background: #10b981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
    }

    /* ═══ FACE SCANNER ═══ */
    .face-scanner {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .scanner-frame {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.03), transparent);
      border-radius: 12px;
      overflow: hidden;
    }

    .face-oval {
      width: 100px;
      height: 130px;
      border: 2px dashed var(--border-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.5s ease;
    }

    .face-oval.aligned {
      border-color: #10b981;
      border-style: solid;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
    }

    .face-icon {
      width: 60px;
      height: 60px;
      color: var(--text-tertiary);
      opacity: 0.5;
    }

    .scan-line {
      position: absolute;
      left: 10%;
      right: 10%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      animation: scanVertical 2s ease-in-out infinite;
    }

    @keyframes scanVertical {
      0%, 100% { top: 10%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 90%; opacity: 0; }
    }

    .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid var(--accent);
    }

    .corner.tl { top: 8px; left: 8px; border-right: 0; border-bottom: 0; border-radius: 4px 0 0 0; }
    .corner.tr { top: 8px; right: 8px; border-left: 0; border-bottom: 0; border-radius: 0 4px 0 0; }
    .corner.bl { bottom: 8px; left: 8px; border-right: 0; border-top: 0; border-radius: 0 0 0 4px; }
    .corner.br { bottom: 8px; right: 8px; border-left: 0; border-top: 0; border-radius: 0 0 4px 0; }

    .face-metrics {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .metric-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.6875rem;
    }

    .metric-label {
      width: 65px;
      color: var(--text-tertiary);
    }

    .metric-bar {
      flex: 1;
      height: 4px;
      background: var(--bg-tertiary);
      border-radius: 2px;
      overflow: hidden;
    }

    .metric-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 2px;
      transition: width 0.5s ease;
    }

    .metric-fill.success {
      background: #10b981;
    }

    .metric-value {
      width: 35px;
      text-align: right;
      font-weight: 600;
      color: var(--text-secondary);
    }

    /* ═══ VITALS DISPLAY ═══ */
    .processing-badge {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--text-secondary);
      font-family: var(--font-mono);
    }

    .processing-badge svg {
      width: 14px;
      height: 14px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .vitals-display {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .signal-wave {
      height: 60px;
      background: rgba(var(--accent-rgb), 0.05);
      border-radius: 8px;
      overflow: hidden;
    }

    .signal-wave svg {
      width: 100%;
      height: 100%;
    }

    .wave-path {
      stroke: var(--accent);
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawWave 3s linear infinite;
    }

    @keyframes drawWave {
      to { stroke-dashoffset: 0; }
    }

    .vitals-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .vital-item {
      text-align: center;
      padding: 0.75rem 0.5rem;
      background: var(--bg-secondary);
      border-radius: 10px;
    }

    .vital-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      font-family: var(--font-mono);
      line-height: 1;
    }

    .vital-unit {
      font-size: 0.6875rem;
      color: var(--text-tertiary);
    }

    .vital-label {
      display: block;
      font-size: 0.625rem;
      color: var(--text-tertiary);
      margin-top: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .worker-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 8px;
      font-size: 0.6875rem;
      color: #10b981;
    }

    .worker-indicator svg {
      width: 16px;
      height: 16px;
    }

    .worker-pulse {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }

    /* ═══ OCR SCANNER ═══ */
    .accuracy-badge {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #10b981;
      font-family: var(--font-mono);
    }

    .document-scanner {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .doc-preview {
      position: relative;
      flex: 1;
      background: linear-gradient(145deg, #f8f9fa, #e9ecef);
      border-radius: 8px;
      padding: 1rem;
      overflow: hidden;
    }

    [data-theme="dark"] .doc-preview {
      background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
    }

    .doc-header {
      width: 60%;
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }

    .doc-photo {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 40px;
      height: 50px;
      background: var(--border-color);
      border-radius: 4px;
    }

    .doc-lines {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .doc-line {
      height: 6px;
      background: var(--border-subtle);
      border-radius: 3px;
      transition: all 0.3s ease;
    }

    .doc-line.highlight {
      background: rgba(var(--accent-rgb), 0.3);
      animation: highlightPulse 1.5s ease-in-out infinite;
    }

    @keyframes highlightPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    .doc-mrz {
      position: absolute;
      bottom: 0.75rem;
      left: 1rem;
      right: 1rem;
    }

    .mrz-line {
      height: 10px;
      background: repeating-linear-gradient(
        90deg,
        var(--text-tertiary) 0px,
        var(--text-tertiary) 4px,
        transparent 4px,
        transparent 8px
      );
      opacity: 0.3;
      margin-bottom: 0.25rem;
      border-radius: 2px;
    }

    .scan-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      animation: ocrScan 2.5s ease-in-out infinite;
    }

    @keyframes ocrScan {
      0% { top: 0; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: calc(100% - 3px); opacity: 0; }
    }

    .ocr-output {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
    }

    .output-line {
      display: flex;
      gap: 0.5rem;
    }

    .output-line .field {
      color: var(--text-tertiary);
    }

    .output-line .value {
      color: var(--text-primary);
      font-weight: 500;
    }

    .output-line .value.typing {
      border-right: 2px solid var(--accent);
      animation: blink 0.8s infinite;
    }

    @keyframes blink {
      0%, 50% { border-color: var(--accent); }
      51%, 100% { border-color: transparent; }
    }

    /* ═══ REALTIME DISPLAY ═══ */
    .live-badge {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.6875rem;
      font-weight: 700;
      color: #ef4444;
      font-family: var(--font-mono);
    }

    .live-dot {
      width: 6px;
      height: 6px;
      background: #ef4444;
      border-radius: 50%;
      animation: livePulse 1s ease-in-out infinite;
    }

    @keyframes livePulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .realtime-display {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .data-stream {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: 10px;
      overflow: hidden;
    }

    .stream-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-family: var(--font-mono);
      animation: slideIn 0.5s ease-out forwards;
      opacity: 0;
      transform: translateX(-10px);
    }

    @keyframes slideIn {
      to { opacity: 1; transform: translateX(0); }
    }

    .stream-type {
      padding: 0.125rem 0.375rem;
      background: rgba(var(--accent-rgb), 0.15);
      color: var(--accent);
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.625rem;
    }

    .stream-arrow {
      color: var(--text-tertiary);
    }

    .stream-status {
      font-weight: 500;
    }

    .stream-status.success { color: #10b981; }
    .stream-status.live { color: #ef4444; }

    .connection-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: rgba(var(--accent-rgb), 0.05);
      border-radius: 8px;
    }

    .conn-line {
      width: 40px;
      height: 2px;
      background: var(--border-color);
      border-radius: 1px;
    }

    .conn-line.active {
      background: var(--accent);
      animation: dataFlow 1s ease-in-out infinite;
    }

    @keyframes dataFlow {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }

    .connection-status svg {
      width: 20px;
      height: 20px;
      color: var(--accent);
    }

    /* ═══ FEATURE NAV ═══ */
    .feature-nav {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .feature-dot {
      position: relative;
      width: 12px;
      height: 12px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .feature-dot::before {
      content: '';
      position: absolute;
      inset: 3px;
      background: var(--border-color);
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .feature-dot.active::before {
      inset: 0;
      background: var(--accent);
    }

    .feature-dot:hover::before {
      background: var(--accent);
      opacity: 0.7;
    }

    .dot-ring {
      position: absolute;
      inset: -4px;
      border: 2px solid var(--accent);
      border-radius: 50%;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.3s ease;
    }

    .feature-dot.active .dot-ring {
      opacity: 1;
      transform: scale(1);
    }

    /* ═══ EXPERTISE SECTION ═══ */
    .expertise-section {
      background: var(--bg-secondary);
    }

    .section-intro {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 4rem;
    }

    .section-label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-bottom: 1rem;
    }

    .section-label svg {
      width: 16px;
      height: 16px;
    }

    .section-title {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
    }

    .section-desc {
      font-size: 1.0625rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .expertise-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .expertise-card {
      position: relative;
      padding: 1.75rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .expertise-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
      width: 40px;
      height: 40px;
      margin-bottom: 1.25rem;
      color: var(--accent);
    }

    .card-icon svg {
      width: 100%;
      height: 100%;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .card-skills {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .card-skills li {
      font-size: 0.875rem;
      color: var(--text-secondary);
      padding: 0.375rem 0;
      border-bottom: 1px solid var(--border-subtle);
    }

    .card-skills li:last-child {
      border-bottom: none;
    }

    .card-accent {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--accent-gradient);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }

    .expertise-card:hover .card-accent {
      transform: scaleX(1);
    }

    .section-cta {
      text-align: center;
      margin-top: 3rem;
    }

    /* ═══ PROJECTS SECTION ═══ */
    .projects-section {
      background: var(--bg-primary);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }

    .project-item {
      position: relative;
    }

    .project-index {
      position: absolute;
      top: -0.5rem;
      left: -0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent);
      background: var(--bg-primary);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      z-index: 2;
    }

    /* ═══ IMPLEMENTATIONS SECTION ═══ */
    .implementations-section {
      background: var(--bg-secondary);
      position: relative;
      overflow: hidden;
    }

    .implementations-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border-subtle), transparent);
    }

    .implementations-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .impl-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .impl-card:hover {
      border-color: var(--accent);
      transform: translateY(-8px);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
    }

    [data-theme="dark"] .impl-card:hover {
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    }

    .impl-visual {
      position: relative;
      height: 180px;
      background: linear-gradient(145deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .impl-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.25rem 0.625rem;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #fff;
      border-radius: 100px;
      z-index: 2;
    }

    .impl-badge.ai { background: linear-gradient(135deg, #8b5cf6, #6366f1); }
    .impl-badge.ocr { background: linear-gradient(135deg, #0ea5e9, #06b6d4); }
    .impl-badge.exam { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .impl-badge.eval { background: linear-gradient(135deg, #10b981, #059669); }
    .impl-badge.fintech { background: linear-gradient(135deg, #ec4899, #db2777); }
    .impl-badge.analytics { background: linear-gradient(135deg, #3b82f6, #2563eb); }

    .impl-demo {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ═══ FACE VITALS DEMO ═══ */
    .face-vitals-demo .face-scanner-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      width: 100%;
    }

    .scanner-frame-box {
      position: relative;
      width: 90px;
      height: 90px;
      margin: 0 auto;
    }

    .face-silhouette {
      position: absolute;
      inset: 8px;
      border: 2px dashed var(--text-tertiary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;
      opacity: 0.6;
    }

    .face-silhouette.aligned {
      border-color: #10b981;
      border-style: solid;
      opacity: 1;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.3);
    }

    .face-silhouette svg {
      width: 40px;
      height: 40px;
      color: var(--text-tertiary);
    }

    .face-silhouette.aligned svg {
      color: #10b981;
    }

    .scanner-corners .corner-mark {
      position: absolute;
      width: 10px;
      height: 10px;
      border-color: var(--accent);
      border-style: solid;
    }

    .corner-mark.tl { top: 0; left: 0; border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
    .corner-mark.tr { top: 0; right: 0; border-width: 2px 2px 0 0; border-radius: 0 4px 0 0; }
    .corner-mark.bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; border-radius: 0 0 0 4px; }
    .corner-mark.br { bottom: 0; right: 0; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

    .scan-beam {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      animation: beamScan 2s ease-in-out infinite;
    }

    @keyframes beamScan {
      0%, 100% { top: 8px; opacity: 0.5; }
      50% { top: calc(100% - 10px); opacity: 1; }
    }

    .alignment-indicator {
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      background: var(--bg-card);
      border-radius: 10px;
      font-size: 0.5625rem;
      color: var(--text-tertiary);
      white-space: nowrap;
    }

    .indicator-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #ef4444;
    }

    .alignment-indicator.success .indicator-dot {
      background: #10b981;
    }

    .alignment-indicator.success {
      color: #10b981;
    }

    .vitals-readout {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .vital-signal {
      height: 24px;
      overflow: hidden;
    }

    .vital-signal svg {
      width: 100%;
      height: 100%;
      color: var(--accent);
    }

    .vital-signal path {
      stroke-dasharray: 200;
      stroke-dashoffset: 200;
      animation: signalDraw 2.5s linear infinite;
    }

    @keyframes signalDraw {
      to { stroke-dashoffset: 0; }
    }

    .vital-metrics {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .vital-item {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .vital-val {
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--accent);
      font-family: var(--font-mono);
    }

    .vital-unit {
      font-size: 0.5625rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
    }

    /* ═══ OCR DEMO ═══ */
    .ocr-demo .document-scanner {
      display: flex;
      gap: 0.75rem;
      width: 100%;
      height: 100%;
      align-items: stretch;
    }

    .passport-frame {
      width: 100px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 0.5rem;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .passport-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.375rem;
    }

    .passport-title {
      width: 40%;
      height: 6px;
      background: var(--accent);
      border-radius: 2px;
    }

    .passport-emblem {
      width: 14px;
      height: 14px;
      background: var(--border-color);
      border-radius: 50%;
    }

    .passport-body {
      display: flex;
      gap: 0.375rem;
      flex: 1;
    }

    .passport-photo {
      width: 24px;
      height: 30px;
      background: var(--bg-tertiary);
      border-radius: 2px;
      flex-shrink: 0;
    }

    .passport-fields {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .field-line {
      height: 4px;
      background: var(--bg-tertiary);
      border-radius: 2px;
    }

    .field-line.w-80 { width: 80%; }
    .field-line.w-70 { width: 70%; }
    .field-line.w-60 { width: 60%; }
    .field-line.w-50 { width: 50%; }

    .field-line.highlight {
      background: rgba(var(--accent-rgb), 0.4);
      animation: fieldPulse 1.5s ease-in-out infinite;
    }

    @keyframes fieldPulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }

    .passport-mrz {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .mrz-row {
      height: 5px;
      background: linear-gradient(90deg, var(--text-tertiary) 2px, transparent 2px);
      background-size: 4px 100%;
      opacity: 0.25;
      border-radius: 1px;
    }

    .scanner-beam-h {
      position: absolute;
      left: 0;
      right: 0;
      height: 16px;
      background: linear-gradient(to bottom, transparent, rgba(var(--accent-rgb), 0.15), transparent);
      animation: scanH 2s ease-in-out infinite;
    }

    @keyframes scanH {
      0%, 100% { top: 0; }
      50% { top: calc(100% - 16px); }
    }

    .ocr-results {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      justify-content: center;
    }

    .ocr-row {
      display: flex;
      gap: 0.375rem;
      align-items: center;
    }

    .ocr-label {
      font-size: 0.5625rem;
      color: var(--text-tertiary);
      width: 50px;
      text-transform: uppercase;
    }

    .ocr-value {
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--text-primary);
      font-family: var(--font-mono);
    }

    .ocr-value.typing {
      border-right: 2px solid var(--accent);
      animation: cursorBlink 0.7s infinite;
    }

    @keyframes cursorBlink {
      0%, 50% { border-color: var(--accent); }
      51%, 100% { border-color: transparent; }
    }

    .ocr-accuracy {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .accuracy-label {
      font-size: 0.5rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
    }

    .accuracy-bar {
      flex: 1;
      height: 4px;
      background: var(--bg-tertiary);
      border-radius: 2px;
      overflow: hidden;
    }

    .accuracy-fill {
      width: 99.2%;
      height: 100%;
      background: linear-gradient(90deg, #10b981, #34d399);
      border-radius: 2px;
    }

    .accuracy-val {
      font-size: 0.625rem;
      font-weight: 700;
      color: #10b981;
      font-family: var(--font-mono);
    }

    /* ═══ EXAM DEMO ═══ */
    .exam-demo .exam-interface {
      width: 100%;
      height: 100%;
      background: var(--bg-card);
      border-radius: 8px;
      border: 1px solid var(--border-subtle);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .exam-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.375rem 0.5rem;
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-subtle);
    }

    .exam-timer {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.625rem;
      font-weight: 600;
      color: var(--text-primary);
      font-family: var(--font-mono);
    }

    .exam-timer svg {
      width: 12px;
      height: 12px;
      color: var(--accent);
    }

    .proctor-cam {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.5rem;
      font-weight: 700;
      color: #ef4444;
      text-transform: uppercase;
    }

    .cam-dot {
      width: 6px;
      height: 6px;
      background: #ef4444;
      border-radius: 50%;
      animation: camPulse 1s ease-in-out infinite;
    }

    @keyframes camPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .exam-content {
      flex: 1;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .question-panel {
      flex: 1;
    }

    .q-number {
      font-size: 0.5625rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 0.25rem;
    }

    .q-text {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-bottom: 0.375rem;
    }

    .text-skeleton {
      height: 4px;
      background: var(--bg-tertiary);
      border-radius: 2px;
    }

    .text-skeleton.w-full { width: 100%; }
    .text-skeleton.w-80 { width: 80%; }

    .q-options {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 6px;
      background: var(--bg-secondary);
      border-radius: 4px;
      border: 1px solid transparent;
    }

    .option.selected {
      border-color: var(--accent);
      background: rgba(var(--accent-rgb), 0.1);
    }

    .opt-letter {
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.5rem;
      font-weight: 600;
      background: var(--bg-tertiary);
      border-radius: 3px;
      color: var(--text-secondary);
    }

    .option.selected .opt-letter {
      background: var(--accent);
      color: #fff;
    }

    .opt-text {
      flex: 1;
      height: 4px;
      background: var(--bg-tertiary);
      border-radius: 2px;
    }

    .question-nav {
      display: flex;
      justify-content: center;
      gap: 4px;
    }

    .nav-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-subtle);
    }

    .nav-dot.answered { background: #10b981; border-color: #10b981; }
    .nav-dot.current { background: var(--accent); border-color: var(--accent); }
    .nav-dot.flagged { background: #f59e0b; border-color: #f59e0b; }

    .exam-score-mini {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.375rem;
    }

    .score-ring {
      position: relative;
      width: 36px;
      height: 36px;
    }

    .score-ring svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .score-ring span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.5625rem;
      font-weight: 700;
      color: #10b981;
    }

    /* ═══ BANKING DEMO ═══ */
    .banking-demo .banking-interface {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .bank-cards {
      display: flex;
      justify-content: center;
    }

    .bank-card.primary {
      width: 120px;
      height: 70px;
      background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000));
      border-radius: 8px;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #fff;
    }

    .card-chip {
      width: 18px;
      height: 14px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 2px;
    }

    .card-number {
      font-size: 0.5625rem;
      font-family: var(--font-mono);
      letter-spacing: 0.5px;
    }

    .card-details {
      display: flex;
      justify-content: space-between;
      font-size: 0.4375rem;
      text-transform: uppercase;
    }

    .transaction-flow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
    }

    .flow-node {
      width: 28px;
      height: 28px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .flow-node svg {
      width: 14px;
      height: 14px;
      color: var(--accent);
    }

    .flow-path {
      width: 50px;
      height: 2px;
      background: var(--border-color);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .flow-particle {
      width: 5px;
      height: 5px;
      background: var(--accent);
      border-radius: 50%;
      animation: particleMove 1.2s ease-in-out infinite;
    }

    .flow-particle.p2 { animation-delay: 0.2s; }
    .flow-particle.p3 { animation-delay: 0.4s; }

    @keyframes particleMove {
      0%, 100% { transform: scale(0.6); opacity: 0.4; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    .recent-tx {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .tx-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 6px;
      background: var(--bg-card);
      border-radius: 4px;
      font-size: 0.5625rem;
      border-left: 2px solid;
    }

    .tx-row.debit { border-color: #ef4444; }
    .tx-row.credit { border-color: #10b981; }

    .tx-desc { color: var(--text-secondary); }
    .tx-row.debit .tx-amt { color: #ef4444; font-weight: 600; font-family: var(--font-mono); }
    .tx-row.credit .tx-amt { color: #10b981; font-weight: 600; font-family: var(--font-mono); }

    /* ═══ DASHBOARD DEMO ═══ */
    .dashboard-demo .dashboard-interface {
      width: 100%;
      height: 100%;
      background: var(--bg-card);
      border-radius: 8px;
      border: 1px solid var(--border-subtle);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .dash-chrome {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.5rem;
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-subtle);
    }

    .chrome-dots {
      display: flex;
      gap: 4px;
    }

    .chrome-dots span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    .chrome-dots span:nth-child(1) { background: #ef4444; }
    .chrome-dots span:nth-child(2) { background: #f59e0b; }
    .chrome-dots span:nth-child(3) { background: #10b981; }

    .chrome-title {
      flex: 1;
      height: 6px;
      background: var(--border-subtle);
      border-radius: 3px;
    }

    .dash-layout {
      flex: 1;
      display: flex;
    }

    .dash-nav {
      width: 28px;
      background: var(--bg-secondary);
      padding: 0.375rem 0.25rem;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      height: 12px;
      background: var(--bg-tertiary);
      border-radius: 3px;
    }

    .nav-item.active {
      background: var(--accent);
    }

    .dash-body {
      flex: 1;
      padding: 0.375rem;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .dash-metrics {
      display: flex;
      gap: 4px;
    }

    .metric-box {
      flex: 1;
      height: 28px;
      background: var(--bg-secondary);
      border-radius: 4px;
      padding: 0.25rem;
      display: flex;
      align-items: flex-end;
    }

    .metric-spark {
      width: 100%;
      height: 12px;
      background: linear-gradient(to top, var(--accent), transparent);
      border-radius: 2px;
      opacity: 0.6;
    }

    .metric-spark.up {
      clip-path: polygon(0 80%, 25% 60%, 50% 70%, 75% 30%, 100% 20%, 100% 100%, 0 100%);
    }

    .metric-spark.down {
      clip-path: polygon(0 20%, 25% 40%, 50% 30%, 75% 60%, 100% 80%, 100% 100%, 0 100%);
    }

    .dash-chart {
      flex: 1;
      min-height: 35px;
    }

    .dash-chart svg {
      width: 100%;
      height: 100%;
    }

    .chart-line {
      stroke-dasharray: 200;
      stroke-dashoffset: 200;
      animation: chartDraw 2s ease-out forwards;
    }

    @keyframes chartDraw {
      to { stroke-dashoffset: 0; }
    }

    .dash-table {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .table-row {
      display: flex;
      gap: 4px;
    }

    .table-row .cell {
      flex: 1;
      height: 6px;
      background: var(--bg-tertiary);
      border-radius: 2px;
    }

    /* ═══ IMPL CONTENT ═══ */
    .impl-content {
      padding: 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .impl-title {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.3;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .impl-project-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--accent);
      margin-bottom: 0.625rem;
    }

    .impl-project-link svg {
      width: 14px;
      height: 14px;
    }

    .impl-desc {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      line-height: 1.55;
      margin-bottom: 0.75rem;
    }

    .impl-features {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .impl-features li {
      font-size: 0.75rem;
      color: var(--text-secondary);
      padding-left: 1rem;
      position: relative;
    }

    .impl-features li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--accent);
      font-weight: 600;
    }

    .impl-tech-stack {
      margin-top: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .impl-tech-stack span {
      padding: 0.25rem 0.5rem;
      font-size: 0.625rem;
      font-weight: 500;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 100px;
      color: var(--text-secondary);
    }

    /* ═══ IMPLEMENTATIONS RESPONSIVE ═══ */
    @media (max-width: 1200px) {
      .implementations-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .implementations-grid {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        gap: 1rem;
        padding-bottom: 0.5rem;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .implementations-grid::-webkit-scrollbar { display: none; }

      .impl-card {
        min-width: 280px;
        max-width: 85vw;
        flex-shrink: 0;
        scroll-snap-align: start;
      }

      .impl-visual {
        height: 120px;
      }

      .impl-content {
        padding: 1rem;
      }

      .impl-title {
        font-size: 0.9375rem;
      }

      .impl-features {
        display: none;
      }

      .impl-desc {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    /* ═══ METRICS SECTION ═══ */
    .metrics-section {
      background: var(--bg-secondary);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .metric-card {
      text-align: center;
      padding: 2rem 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent);
    }

    .metric-icon {
      width: 32px;
      height: 32px;
      margin: 0 auto 1rem;
      color: var(--accent);
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-primary);
      line-height: 1;
    }

    .metric-value span {
      color: var(--accent);
    }

    .metric-label {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    /* ═══ CONTACT CTA ═══ */
    .contact-cta {
      background: var(--bg-primary);
    }

    .cta-wrapper {
      position: relative;
      padding: 4rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 24px;
      overflow: hidden;
    }

    .cta-content {
      position: relative;
      z-index: 2;
      max-width: 500px;
    }

    .cta-label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-bottom: 1rem;
    }

    .cta-heading {
      font-size: clamp(1.5rem, 4vw, 2.25rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
    }

    .cta-desc {
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .cta-visual {
      position: absolute;
      top: 50%;
      right: 10%;
      transform: translateY(-50%);
    }

    .visual-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(var(--accent-rgb), 0.15);
      animation: expandRing 3s ease-out infinite;
    }

    .visual-ring:nth-child(1) { width: 100px; height: 100px; animation-delay: 0s; }
    .visual-ring:nth-child(2) { width: 180px; height: 180px; animation-delay: 0.5s; }
    .visual-ring:nth-child(3) { width: 260px; height: 260px; animation-delay: 1s; }

    @keyframes expandRing {
      0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
      100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
    }

    /* ═══ LOADING ═══ */
    .loader-modern {
      display: flex;
      justify-content: center;
    }

    .loader-svg {
      width: 48px;
      height: 48px;
      animation: rotate 1s linear infinite;
    }

    .loader-circle {
      fill: none;
      stroke: var(--accent);
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 100;
      stroke-dashoffset: 80;
    }

    @keyframes rotate {
      to { transform: rotate(360deg); }
    }

    /* ═══ ANIMATIONS ═══ */
    .animate-fade-in-up {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease forwards;
    }

    .animate-fade-in {
      opacity: 0;
      animation: fadeIn 0.6s ease forwards;
    }

    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
    .stagger-5 { animation-delay: 0.5s; }
    .stagger-6 { animation-delay: 0.6s; }
    .stagger-7 { animation-delay: 0.7s; }

    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      to { opacity: 1; }
    }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .hero-showcase {
        order: -1;
        min-height: 350px;
      }

      .showcase-container {
        width: 320px;
        height: 400px;
      }

      .feature-card {
        padding: 1rem;
      }

      .vital-value {
        font-size: 1.25rem;
      }

      .vitals-grid {
        gap: 0.5rem;
      }
    }

    @media (max-width: 1024px) {
      .implementations-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      /* ── Hero: compact & punchy ── */
      .hero {
        min-height: auto;
        padding-top: 5rem;
      }

      .hero-container {
        min-height: auto;
        padding-top: 1rem;
        padding-bottom: 1.5rem;
      }

      .hero-showcase {
        display: none;
      }

      .hero-heading {
        margin-bottom: 0.75rem;
      }

      .hero-name {
        font-size: clamp(2.25rem, 11vw, 3rem);
      }

      .hero-role {
        margin-bottom: 0.75rem;
      }

      .hero-summary {
        font-size: 0.9375rem;
        line-height: 1.6;
        margin-bottom: 1.25rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .tech-stack {
        display: none;
      }

      .status-badge {
        margin-bottom: 1rem;
      }

      .hero-cta {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }

      .btn-text-pro {
        display: none;
      }

      .hero-social {
        display: none;
      }

      .scroll-cue {
        display: none;
      }

      /* ── Expertise: compact 2-col grid ── */
      .section-intro {
        margin-bottom: 2rem;
      }

      .section-title {
        font-size: 1.5rem;
      }

      .section-desc {
        font-size: 0.875rem;
      }

      .expertise-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }

      .expertise-card {
        padding: 1rem;
      }

      .card-icon {
        width: 32px;
        height: 32px;
        margin-bottom: 0.625rem;
      }

      .card-title {
        font-size: 0.875rem;
        margin-bottom: 0;
      }

      .card-skills {
        display: none;
      }

      .card-accent {
        display: none;
      }

      .section-cta {
        margin-top: 1.5rem;
      }

      /* ── Metrics: 2×2 compact ── */
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }

      .metric-card {
        padding: 1.25rem 1rem;
      }

      .metric-icon {
        width: 28px;
        height: 28px;
        margin-bottom: 0.5rem;
      }

      .metric-value {
        font-size: 1.75rem;
      }

      .metric-label {
        font-size: 0.75rem;
      }

      /* ── CTA: tight ── */
      .cta-wrapper {
        padding: 2rem 1.5rem;
      }

      .cta-visual {
        display: none;
      }

      .cta-heading {
        font-size: 1.25rem;
      }

      .cta-desc {
        font-size: 0.875rem;
        margin-bottom: 1.25rem;
      }
    }
  `],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  profileService = inject(ProfileService);
  private seoService = inject(SeoService);
  private sanitizer = inject(DomSanitizer);
  private animationFrame: number | null = null;
  private featureInterval: any = null;
  
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;

  topSkills = ['Angular', 'TypeScript', 'NestJS', 'Node.js', 'AWS', 'PostgreSQL'];
  
  // Project highlights for hero showcase
  projectHighlights = [
    { 
      name: 'E-Visa Platform', 
      slug: 'evisa-portal',
      category: 'GovTech',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>'
    },
    { 
      name: 'Fedo Vitals', 
      slug: 'fedo-vitals',
      category: 'Healthcare AI',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6h1a2 2 0 0 0 2-2v-5a6 6 0 0 0-6-6"/></svg>'
    },
    { 
      name: 'Fedo HSA', 
      slug: 'fedo-hsa',
      category: 'Fintech',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    },
    { 
      name: 'DMS', 
      slug: 'document-management-system',
      category: 'GovTech',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'
    }
  ];
  
  // Feature showcase signals
  activeFeature = signal(0);
  faceAligned = signal(false);
  
  featureList = [
    { id: 0, name: 'Face Detection' },
    { id: 1, name: 'Vitals Processing' },
    { id: 2, name: 'OCR Scanning' },
    { id: 3, name: 'Real-time Sync' }
  ];
  
  streamData = [
    { id: 1, type: 'POST', label: 'Created', status: 'success', delay: '0s' },
    { id: 2, type: 'SYNC', label: 'Synced', status: 'success', delay: '0.1s' },
    { id: 3, type: 'GET', label: 'Fetched', status: 'success', delay: '0.2s' },
    { id: 4, type: 'WS', label: 'Live', status: 'live', delay: '0.3s' }
  ];
  
  skillCategories = [
    { 
      name: 'Frontend', 
      svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 9 3 3-3 3"/><path d="M14 15h3"/></svg>',
      skills: ['Angular (v13-18)', 'TypeScript', 'RxJS', 'NgRx', 'SCSS', 'Tailwind CSS'] 
    },
    { 
      name: 'Backend', 
      svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>',
      skills: ['Node.js', 'NestJS', 'Express.js', 'REST', 'GraphQL', 'WebSocket'] 
    },
    { 
      name: 'Database', 
      svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>',
      skills: ['PostgreSQL', 'MongoDB', 'Redis'] 
    },
    { 
      name: 'Cloud & DevOps', 
      svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Nginx', 'Linux'] 
    },
    { 
      name: 'CI/CD & Testing', 
      svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2v6l-2 4v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9l-2-4V2"/><path d="M6 8h12"/><path d="M10 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>',
      skills: ['GitHub Actions', 'Jenkins', 'GitLab CI/CD', 'Jest', 'Cypress', 'JMeter'] 
    },
    { 
      name: 'Practices', 
      svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      skills: ['Microservices', 'Clean Architecture', 'SOLID', 'OAuth2/JWT', 'Agile/Scrum'] 
    }
  ];

  ngOnInit(): void {
    const profile = this.profileService.profile();
    if (profile) {
      this.seoService.update({
        title: `${profile.firstName} ${profile.lastName} — Portfolio`,
        description: profile.summary,
      });
      
      // Update skills from profile
      const skills = this.profileService.skills();
      if (skills.length > 0) {
        this.topSkills = skills.slice(0, 6).map(s => s.name);
      }
    }
    
    // Start feature showcase rotation
    if (typeof window !== 'undefined') {
      this.startFeatureRotation();
    }
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && this.particleCanvas?.nativeElement) {
      this.initParticles();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.featureInterval) {
      clearInterval(this.featureInterval);
    }
  }
  
  private startFeatureRotation(): void {
    // Toggle face alignment every 2 seconds
    setInterval(() => {
      this.faceAligned.set(!this.faceAligned());
    }, 2000);
    
    // Rotate features every 4 seconds
    this.featureInterval = setInterval(() => {
      const next = (this.activeFeature() + 1) % this.featureList.length;
      this.activeFeature.set(next);
    }, 4000);
  }

  private initParticles(): void {
    const canvas = this.particleCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; opacity: number;
    }> = [];

    const particleCount = Math.min(80, window.innerWidth / 15);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  getSocialSvgPath(platform: string): string {
    const paths: Record<string, string> = {
      linkedin: '<circle cx="4" cy="4" r="2" transform="translate(2 2)"/><path d="M4 10v10"/><path d="M12 16v4"/><path d="M12 12c0-2 1.5-4 4-4s4 2 4 4v8"/>',
      github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
      twitter: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
      email: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
      whatsapp: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
      website: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
      dribbble: '<circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/>',
      youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
      medium: '<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M8 12a3 3 0 1 0 0-1 3 3 0 0 0 0 1z"/><path d="M17 9v6M14 9.5v5"/>',
      stackoverflow: '<path d="M18 20.5v-6M3 20.5h15M6 17.5h9M6 14.7l9 1M7 11.8l8.5 2.6M9 9l7.8 4.3"/>',
    };
    return paths[platform] || '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>';
  }

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getYearsOfExperience(): number {
    const experiences = this.profileService.experience();
    if (!experiences.length) return 0;
    const earliest = experiences.reduce((min, e) =>
      new Date(e.startDate) < new Date(min.startDate) ? e : min
    );
    const years = Math.floor(
      (Date.now() - new Date(earliest.startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    return years;
  }
}
