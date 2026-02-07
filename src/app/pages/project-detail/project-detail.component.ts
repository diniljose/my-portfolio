import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProfileService, SeoService } from '../../core/services';
import { Project } from '../../core/models';
import { marked } from 'marked';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (project(); as p) {
      <section class="section">
        <div class="container container-md">
          <!-- Back -->
          <a [routerLink]="['/p', profileService.currentSlug(), 'projects']" class="back-link btn-ghost mb-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back to Projects
          </a>

          <!-- Header -->
          <div class="project-header animate-fade-in-up">
            <div class="project-meta">
              <span class="chip">{{ p.category }}</span>
              @if (p.featured) {
                <span class="chip featured-chip">★ Featured</span>
              }
            </div>
            <h1 class="project-title font-display">{{ p.title }}</h1>
            <p class="project-desc">{{ p.description }}</p>
          </div>

          <!-- Technical Demo Showcase -->
          <div class="demo-showcase animate-fade-in-up stagger-1">
            @switch (getDemoType(p)) {
              @case ('vitals') {
                <div class="demo-container vitals-demo">
                  <div class="demo-header">
                    <span class="demo-badge healthcare">Healthcare</span>
                    <span class="demo-title">Face Detection & Vital Signs Analysis</span>
                  </div>
                  <div class="demo-content">
                    <div class="face-scanner-large">
                      <div class="scanner-viewport">
                        <div class="face-outline" [class.aligned]="demoState()">
                          <svg viewBox="0 0 100 100" fill="none">
                            <ellipse cx="50" cy="45" rx="25" ry="32" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 2"/>
                            <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.5"/>
                            <circle cx="60" cy="40" r="3" fill="currentColor" opacity="0.5"/>
                            <path d="M42 55 Q50 62 58 55" stroke="currentColor" stroke-width="1.5" fill="none"/>
                          </svg>
                        </div>
                        <div class="scan-overlay"></div>
                        <div class="tracking-points">
                          <span class="point p1"></span>
                          <span class="point p2"></span>
                          <span class="point p3"></span>
                          <span class="point p4"></span>
                          <span class="point p5"></span>
                        </div>
                        <div class="distance-indicator">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                          <span>Optimal Distance</span>
                        </div>
                      </div>
                      <div class="status-bar" [class.success]="demoState()">
                        <span class="status-icon"></span>
                        <span>{{ demoState() ? 'Face Aligned - Capturing Vitals...' : 'Please align your face' }}</span>
                      </div>
                    </div>
                    <div class="vitals-panel">
                      <div class="signal-graph">
                        <div class="graph-label">rPPG Signal</div>
                        <svg viewBox="0 0 200 50" preserveAspectRatio="none">
                          <path class="signal-line" d="M0,25 L10,25 L15,25 L20,10 L25,40 L30,20 L35,30 L40,25 L50,25 L55,25 L60,15 L65,35 L70,22 L75,28 L80,25 L100,25 L105,25 L110,12 L115,38 L120,18 L125,32 L130,25 L150,25 L155,25 L160,8 L165,42 L170,20 L175,30 L180,25 L200,25" fill="none" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </div>
                      <div class="vitals-grid">
                        <div class="vital-card">
                          <div class="vital-icon heart">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                          </div>
                          <div class="vital-data">
                            <span class="vital-value">72</span>
                            <span class="vital-unit">BPM</span>
                          </div>
                          <div class="vital-label">Heart Rate</div>
                        </div>
                        <div class="vital-card">
                          <div class="vital-icon oxygen">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          </div>
                          <div class="vital-data">
                            <span class="vital-value">98</span>
                            <span class="vital-unit">%</span>
                          </div>
                          <div class="vital-label">SpO2</div>
                        </div>
                        <div class="vital-card">
                          <div class="vital-icon bp">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                          </div>
                          <div class="vital-data">
                            <span class="vital-value">120/80</span>
                            <span class="vital-unit">mmHg</span>
                          </div>
                          <div class="vital-label">Blood Pressure</div>
                        </div>
                        <div class="vital-card">
                          <div class="vital-icon stress">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
                          </div>
                          <div class="vital-data">
                            <span class="vital-value">Low</span>
                          </div>
                          <div class="vital-label">Stress Level</div>
                        </div>
                      </div>
                      <div class="processing-info">
                        <div class="proc-item"><span class="proc-dot"></span>Web Worker Processing</div>
                        <div class="proc-item"><span class="proc-dot"></span>14s Video Analysis</div>
                        <div class="proc-item"><span class="proc-dot"></span>AI Signal Extraction</div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              @case ('evisa') {
                <div class="demo-container evisa-demo">
                  <div class="demo-header">
                    <span class="demo-badge govt">E-Governance</span>
                    <span class="demo-title">Document OCR & Visa Processing</span>
                  </div>
                  <div class="demo-content">
                    <div class="document-scanner-large">
                      <div class="passport-preview">
                        <div class="passport-card">
                          <div class="passport-top">
                            <div class="country-name">PASSPORT</div>
                            <div class="emblem"></div>
                          </div>
                          <div class="passport-middle">
                            <div class="photo-box"></div>
                            <div class="info-fields">
                              <div class="field"><span class="label">Surname</span><span class="value scan-text">DOE</span></div>
                              <div class="field"><span class="label">Given Names</span><span class="value scan-text">JOHN WILLIAM</span></div>
                              <div class="field"><span class="label">Nationality</span><span class="value">UNITED STATES</span></div>
                              <div class="field"><span class="label">Date of Birth</span><span class="value">15 MAR 1985</span></div>
                              <div class="field"><span class="label">Passport No.</span><span class="value highlight">A12345678</span></div>
                            </div>
                          </div>
                          <div class="passport-mrz">
                            <div class="mrz-line">P&lt;USADOE&lt;&lt;JOHN&lt;WILLIAM&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                            <div class="mrz-line">A123456780USA8503159M2512318&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;08</div>
                          </div>
                          <div class="scan-beam"></div>
                        </div>
                      </div>
                      <div class="extraction-panel">
                        <div class="extract-header">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <span>Extracted Data</span>
                        </div>
                        <div class="extract-fields">
                          <div class="extract-row"><span class="key">Full Name</span><span class="val typing-anim">JOHN WILLIAM DOE</span></div>
                          <div class="extract-row"><span class="key">Document No.</span><span class="val">A12345678</span></div>
                          <div class="extract-row"><span class="key">Nationality</span><span class="val">USA</span></div>
                          <div class="extract-row"><span class="key">DOB</span><span class="val">1985-03-15</span></div>
                          <div class="extract-row"><span class="key">Expiry</span><span class="val">2025-12-31</span></div>
                        </div>
                        <div class="accuracy-meter">
                          <span class="acc-label">OCR Accuracy</span>
                          <div class="acc-bar"><div class="acc-fill"></div></div>
                          <span class="acc-value">99.2%</span>
                        </div>
                        <div class="mrz-validation">
                          <span class="check-icon">✓</span>
                          <span>MRZ Checksum Valid</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              @case ('exam') {
                <div class="demo-container exam-demo-large">
                  <div class="demo-header">
                    <span class="demo-badge govt">E-Governance</span>
                    <span class="demo-title">Online Exam & Real-time Evaluation</span>
                  </div>
                  <div class="demo-content">
                    <div class="exam-simulator">
                      <div class="exam-chrome">
                        <div class="chrome-left">
                          <div class="timer-display">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span>45:30</span>
                          </div>
                          <div class="progress-info">Question 15 of 50</div>
                        </div>
                        <div class="chrome-right">
                          <div class="candidate-info">
                            <div class="avatar"></div>
                            <span>Candidate #2847</span>
                          </div>
                          <div class="live-indicator"><span class="live-dot"></span>PROCTORED</div>
                        </div>
                      </div>
                      <div class="exam-body">
                        <div class="question-area">
                          <div class="q-header">
                            <span class="q-num">Question 15</span>
                            <span class="q-marks">2 Marks</span>
                          </div>
                          <div class="q-content">
                            <p class="q-text">Which protocol is used for secure data transmission over the internet?</p>
                            <div class="options-list">
                              <div class="option-item"><span class="opt-marker">A</span><span class="opt-content">HTTP</span></div>
                              <div class="option-item selected correct"><span class="opt-marker">B</span><span class="opt-content">HTTPS</span><span class="correct-icon">✓</span></div>
                              <div class="option-item"><span class="opt-marker">C</span><span class="opt-content">FTP</span></div>
                              <div class="option-item"><span class="opt-marker">D</span><span class="opt-content">SMTP</span></div>
                            </div>
                          </div>
                        </div>
                        <div class="exam-sidebar">
                          <div class="results-card">
                            <div class="score-circle">
                              <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-tertiary)" stroke-width="8"/>
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" stroke-width="8" stroke-dasharray="226, 251" stroke-linecap="round" transform="rotate(-90 50 50)"/>
                              </svg>
                              <div class="score-inner">
                                <span class="score-num">90%</span>
                                <span class="score-label">Score</span>
                              </div>
                            </div>
                            <div class="stats-row">
                              <div class="stat-item correct"><span>42</span>Correct</div>
                              <div class="stat-item wrong"><span>3</span>Wrong</div>
                              <div class="stat-item skipped"><span>5</span>Skipped</div>
                            </div>
                          </div>
                          <div class="nav-grid">
                            @for (i of questionNav; track i) {
                              <span class="nav-cell" [class.answered]="i < 14" [class.current]="i === 14" [class.flagged]="i === 18">{{ i + 1 }}</span>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              @case ('banking') {
                <div class="demo-container banking-demo-large">
                  <div class="demo-header">
                    <span class="demo-badge fintech">Fintech</span>
                    <span class="demo-title">Health Savings Account & Transactions</span>
                  </div>
                  <div class="demo-content">
                    <div class="banking-app">
                      <div class="app-header">
                        <div class="user-greeting">
                          <span class="greeting-text">Good Morning,</span>
                          <span class="user-name">Dinil</span>
                        </div>
                        <div class="notification-bell">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                          <span class="notif-dot"></span>
                        </div>
                      </div>
                      <div class="card-carousel">
                        <div class="hsa-card">
                          <div class="card-logo">HSA</div>
                          <div class="card-balance">
                            <span class="bal-label">Available Balance</span>
                            <span class="bal-amount">₹1,25,000</span>
                          </div>
                          <div class="card-number-row">•••• •••• •••• 4532</div>
                          <div class="card-footer">
                            <span class="holder-name">DINIL JOSE</span>
                            <span class="card-expiry">12/28</span>
                          </div>
                          <div class="card-chip"></div>
                        </div>
                      </div>
                      <div class="quick-actions">
                        <div class="action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><span>Add Money</span></div>
                        <div class="action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg><span>Transfer</span></div>
                        <div class="action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Insurance</span></div>
                        <div class="action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span>Claims</span></div>
                      </div>
                      <div class="transactions-section">
                        <div class="tx-section-header">
                          <span>Recent Transactions</span>
                          <a href="#">View All</a>
                        </div>
                        <div class="tx-list">
                          <div class="tx-item-large">
                            <div class="tx-icon debit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                            <div class="tx-details">
                              <span class="tx-title">Health Insurance Premium</span>
                              <span class="tx-date">Feb 05, 2026</span>
                            </div>
                            <span class="tx-amount debit">-₹2,500</span>
                          </div>
                          <div class="tx-item-large">
                            <div class="tx-icon credit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                            <div class="tx-details">
                              <span class="tx-title">Medical Claim Settled</span>
                              <span class="tx-date">Feb 02, 2026</span>
                            </div>
                            <span class="tx-amount credit">+₹15,000</span>
                          </div>
                          <div class="tx-item-large">
                            <div class="tx-icon debit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                            <div class="tx-details">
                              <span class="tx-title">Pharmacy Purchase</span>
                              <span class="tx-date">Jan 28, 2026</span>
                            </div>
                            <span class="tx-amount debit">-₹850</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              @case ('dashboard') {
                <div class="demo-container dashboard-demo-large">
                  <div class="demo-header">
                    <span class="demo-badge enterprise">Enterprise</span>
                    <span class="demo-title">Admin Analytics Dashboard</span>
                  </div>
                  <div class="demo-content">
                    <div class="admin-dashboard">
                      <div class="dash-sidebar-large">
                        <div class="sidebar-logo">
                          <div class="logo-icon"></div>
                          <span>Fedo Admin</span>
                        </div>
                        <nav class="sidebar-nav">
                          <a class="nav-link active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>Dashboard</a>
                          <a class="nav-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Users</a>
                          <a class="nav-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>Analytics</a>
                          <a class="nav-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>Settings</a>
                        </nav>
                      </div>
                      <div class="dash-main-large">
                        <div class="dash-topbar">
                          <h2>Dashboard Overview</h2>
                          <div class="topbar-actions">
                            <div class="date-picker">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              <span>Last 30 days</span>
                            </div>
                          </div>
                        </div>
                        <div class="metrics-row">
                          <div class="metric-card-large">
                            <div class="metric-header">
                              <span class="metric-title">Total Users</span>
                              <span class="metric-trend up">+12.5%</span>
                            </div>
                            <div class="metric-value-large">52,847</div>
                            <div class="metric-chart mini-up"></div>
                          </div>
                          <div class="metric-card-large">
                            <div class="metric-header">
                              <span class="metric-title">Active Sessions</span>
                              <span class="metric-trend up">+8.2%</span>
                            </div>
                            <div class="metric-value-large">3,429</div>
                            <div class="metric-chart mini-up"></div>
                          </div>
                          <div class="metric-card-large">
                            <div class="metric-header">
                              <span class="metric-title">Vitals Scanned</span>
                              <span class="metric-trend up">+23.1%</span>
                            </div>
                            <div class="metric-value-large">128,394</div>
                            <div class="metric-chart mini-up"></div>
                          </div>
                          <div class="metric-card-large">
                            <div class="metric-header">
                              <span class="metric-title">Avg. Response</span>
                              <span class="metric-trend down">-5.3%</span>
                            </div>
                            <div class="metric-value-large">1.2s</div>
                            <div class="metric-chart mini-down"></div>
                          </div>
                        </div>
                        <div class="chart-area">
                          <div class="chart-header">
                            <span>User Activity</span>
                            <div class="chart-legend">
                              <span class="legend-item"><span class="dot primary"></span>Active</span>
                              <span class="legend-item"><span class="dot secondary"></span>New</span>
                            </div>
                          </div>
                          <div class="chart-canvas">
                            <svg viewBox="0 0 400 120" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.3"/>
                                  <stop offset="100%" style="stop-color:var(--accent);stop-opacity:0"/>
                                </linearGradient>
                              </defs>
                              <path d="M0,100 L40,85 L80,90 L120,60 L160,70 L200,45 L240,55 L280,30 L320,40 L360,20 L400,35 L400,120 L0,120 Z" fill="url(#areaGrad)"/>
                              <path class="chart-line-anim" d="M0,100 L40,85 L80,90 L120,60 L160,70 L200,45 L240,55 L280,30 L320,40 L360,20 L400,35" fill="none" stroke="var(--accent)" stroke-width="2"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              @case ('dms') {
                <div class="demo-container dms-demo">
                  <div class="demo-header">
                    <span class="demo-badge govt">E-Governance</span>
                    <span class="demo-title">Document Management & OCR Processing</span>
                  </div>
                  <div class="demo-content">
                    <div class="dms-interface">
                      <div class="folder-tree">
                        <div class="tree-header">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                          <span>Documents</span>
                        </div>
                        <div class="tree-items">
                          <div class="tree-item folder open">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                            <span>Ministry Records</span>
                          </div>
                          <div class="tree-item file indent">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            <span>Application_2024.pdf</span>
                          </div>
                          <div class="tree-item file indent active">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            <span>Visa_Request.pdf</span>
                          </div>
                          <div class="tree-item folder">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                            <span>Archives</span>
                          </div>
                        </div>
                      </div>
                      <div class="doc-preview-area">
                        <div class="preview-header">
                          <span>Visa_Request.pdf</span>
                          <div class="preview-actions">
                            <button class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                            <button class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                          </div>
                        </div>
                        <div class="doc-canvas">
                          <div class="doc-page">
                            <div class="page-header-bar"></div>
                            <div class="page-content">
                              <div class="text-block"></div>
                              <div class="text-block short"></div>
                              <div class="text-block"></div>
                              <div class="highlight-region">
                                <span class="ocr-tag">OCR Extracted</span>
                              </div>
                              <div class="text-block short"></div>
                            </div>
                          </div>
                          <div class="scan-indicator"></div>
                        </div>
                        <div class="ocr-results-panel">
                          <div class="results-header">Extracted Text</div>
                          <div class="results-content">
                            <p class="extracted-text">Application for entry visa to the State of Kuwait. Applicant: John Doe, Passport: A12345678...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              @case ('middleware') {
                <div class="demo-container middleware-demo">
                  <div class="demo-header">
                    <span class="demo-badge govt">E-Governance</span>
                    <span class="demo-title">SOAP/REST API Integration Layer</span>
                  </div>
                  <div class="demo-content">
                    <div class="api-flow">
                      <div class="flow-node client">
                        <div class="node-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
                        <div class="node-label">Client App</div>
                        <div class="node-tech">Angular / React</div>
                      </div>
                      <div class="flow-arrow">
                        <div class="arrow-line"></div>
                        <div class="arrow-label">REST API</div>
                        <div class="arrow-packets">
                          <span class="packet"></span>
                          <span class="packet"></span>
                          <span class="packet"></span>
                        </div>
                      </div>
                      <div class="flow-node middleware active">
                        <div class="node-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
                        <div class="node-label">Middleware</div>
                        <div class="node-tech">.NET Core / NestJS</div>
                        <div class="processing-badge">
                          <span class="proc-spinner"></span>
                          Processing
                        </div>
                      </div>
                      <div class="flow-arrow reverse">
                        <div class="arrow-line"></div>
                        <div class="arrow-label">SOAP/XML</div>
                        <div class="arrow-packets">
                          <span class="packet"></span>
                          <span class="packet"></span>
                          <span class="packet"></span>
                        </div>
                      </div>
                      <div class="flow-node server">
                        <div class="node-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg></div>
                        <div class="node-label">PACI Server</div>
                        <div class="node-tech">Legacy SOAP</div>
                      </div>
                    </div>
                    <div class="transform-demo">
                      <div class="code-block request">
                        <div class="block-header">REST Request</div>
                        <div class="code-lines">
                          <div class="line"><span class="key">POST</span> /api/v1/verify</div>
                          <div class="line">"civilId": "123456789"</div>
                          <div class="line">"nationality": "KWT"</div>
                        </div>
                      </div>
                      <div class="transform-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                      <div class="code-block response">
                        <div class="block-header">SOAP Response</div>
                        <div class="code-lines">
                          <div class="line">&lt;VerifyResult&gt;</div>
                          <div class="line">  &lt;Status&gt;Valid&lt;/Status&gt;</div>
                          <div class="line">  &lt;Name&gt;JOHN DOE&lt;/Name&gt;</div>
                          <div class="line">&lt;/VerifyResult&gt;</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              @default {
                <div class="demo-container default-demo">
                  <div class="demo-header">
                    <span class="demo-badge">Project</span>
                    <span class="demo-title">{{ p.title }}</span>
                  </div>
                  <div class="demo-content">
                    <div class="generic-showcase">
                      <div class="tech-cloud">
                        @for (tech of p.techStack; track tech) {
                          <span class="tech-bubble">{{ tech }}</span>
                        }
                      </div>
                      <div class="project-visual">
                        <div class="code-window">
                          <div class="window-bar"><span></span><span></span><span></span></div>
                          <div class="code-content">
                            <div class="code-line"><span class="kw">import</span> {{ '{' }} Component {{ '}' }} <span class="kw">from</span> <span class="str">'&#64;angular/core'</span>;</div>
                            <div class="code-line"></div>
                            <div class="code-line"><span class="dec">&#64;Component</span>({{ '{' }}</div>
                            <div class="code-line">  selector: <span class="str">'app-{{ p.slug }}'</span>,</div>
                            <div class="code-line">  standalone: <span class="bool">true</span></div>
                            <div class="code-line">{{ '}' }})</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Info Grid -->
          <div class="info-grid animate-fade-in-up stagger-2">
            <div class="info-card">
              <span class="info-label">Role</span>
              <span class="info-value">{{ p.role }}</span>
            </div>
            @if (p.startDate) {
              <div class="info-card">
                <span class="info-label">Timeline</span>
                <span class="info-value">
                  {{ formatDate(p.startDate) }} — {{ p.endDate ? formatDate(p.endDate) : 'Ongoing' }}
                </span>
              </div>
            }
          </div>

          <!-- Tech Stack -->
          <div class="tech-section animate-fade-in-up stagger-3">
            <h3 class="section-subtitle">Tech Stack</h3>
            <div class="tech-list">
              @for (tech of p.techStack; track tech) {
                <span class="tech-chip">{{ tech }}</span>
              }
            </div>
          </div>

          <!-- Highlights -->
          @if (p.highlights.length > 0) {
            <div class="highlights-section animate-fade-in-up stagger-4">
              <h3 class="section-subtitle">Key Highlights</h3>
              <ul class="highlights-list">
                @for (h of p.highlights; track h) {
                  <li>
                    <span class="highlight-arrow">→</span>
                    <span>{{ h }}</span>
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Links -->
          @if (p.links.length > 0) {
            <div class="links-section animate-fade-in-up stagger-5">
              <h3 class="section-subtitle">Links</h3>
              <div class="links-row">
                @for (link of p.links; track link.url) {
                  <a [href]="link.url" target="_blank" rel="noopener" class="link-btn">
                    {{ link.label }}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                }
              </div>
            </div>
          }

          <!-- Gallery -->
          @if (p.images && p.images.length > 0) {
            <div class="gallery-section animate-fade-in-up stagger-5">
              <h3 class="section-subtitle">Gallery</h3>
              <div class="gallery">
                @for (img of p.images; track img) {
                  <div class="gallery-item">
                    <img [src]="img" [alt]="p.title + ' screenshot'" loading="lazy" />
                  </div>
                }
              </div>
            </div>
          }

          <!-- Case Study -->
          @if (p.caseStudy) {
            <div class="casestudy-section animate-fade-in-up stagger-6">
              <h3 class="section-subtitle">Case Study</h3>
              <div class="markdown-content" [innerHTML]="renderedCaseStudy()"></div>
            </div>
          }
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container text-center" style="min-height: 50vh; display: flex; align-items: center; justify-content: center;">
          <div>
            <h2 class="text-h2">Project not found</h2>
            <a [routerLink]="['/p', profileService.currentSlug(), 'projects']" class="btn-primary mt-lg">
              View All Projects
            </a>
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    .back-link { display: inline-flex; }

    .project-header { margin-bottom: 2rem; }

    .project-meta {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .featured-chip {
      background: rgba(251, 191, 36, 0.12);
      color: var(--warning);
    }

    .project-title {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    .project-desc {
      font-size: 1.125rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    /* Demo Showcase */
    .demo-showcase { margin-bottom: 2.5rem; }

    .demo-container {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      overflow: hidden;
    }

    .demo-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-subtle);
    }

    .demo-badge {
      padding: 0.25rem 0.75rem;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 100px;
      background: var(--accent);
      color: #fff;
    }

    .demo-badge.healthcare { background: #06b6d4; }
    .demo-badge.govt { background: #8b5cf6; }
    .demo-badge.fintech { background: #10b981; }
    .demo-badge.enterprise { background: #f59e0b; }

    .demo-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .demo-content { padding: 1.5rem; }

    /* ═══ VITALS DEMO ═══ */
    .vitals-demo .demo-content {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
    }

    .face-scanner-large {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .scanner-viewport {
      position: relative;
      aspect-ratio: 3/4;
      background: linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary));
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .face-outline {
      width: 60%;
      aspect-ratio: 1/1.2;
      border: 2px dashed var(--text-tertiary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;
    }

    .face-outline.aligned {
      border-color: #10b981;
      border-style: solid;
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
    }

    .face-outline svg {
      width: 80%;
      height: 80%;
      color: var(--text-tertiary);
      transition: color 0.4s ease;
    }

    .face-outline.aligned svg { color: #10b981; }

    .scan-overlay {
      position: absolute;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      animation: scanOverlay 2s ease-in-out infinite;
    }

    @keyframes scanOverlay {
      0%, 100% { top: 10%; opacity: 0.5; }
      50% { top: 90%; opacity: 1; }
    }

    .tracking-points .point {
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
      animation: pointPulse 1.5s ease-in-out infinite;
    }

    .point.p1 { top: 30%; left: 35%; animation-delay: 0s; }
    .point.p2 { top: 30%; right: 35%; animation-delay: 0.2s; }
    .point.p3 { top: 50%; left: 50%; transform: translateX(-50%); animation-delay: 0.4s; }
    .point.p4 { top: 60%; left: 40%; animation-delay: 0.6s; }
    .point.p5 { top: 60%; right: 40%; animation-delay: 0.8s; }

    @keyframes pointPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.3); opacity: 1; }
    }

    .distance-indicator {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--bg-card);
      border-radius: 100px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .distance-indicator svg {
      width: 16px;
      height: 16px;
      color: var(--accent);
    }

    .status-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--bg-secondary);
      border-radius: 10px;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .status-bar .status-icon {
      width: 10px;
      height: 10px;
      background: #f59e0b;
      border-radius: 50%;
      animation: statusBlink 1s infinite;
    }

    .status-bar.success .status-icon {
      background: #10b981;
      animation: none;
    }

    .status-bar.success { color: #10b981; }

    @keyframes statusBlink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.4; }
    }

    .vitals-panel {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .signal-graph {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1rem;
    }

    .graph-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-tertiary);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .signal-graph svg {
      width: 100%;
      height: 50px;
    }

    .signal-line {
      stroke: var(--accent);
      stroke-dasharray: 500;
      stroke-dashoffset: 500;
      animation: signalAnim 3s linear infinite;
    }

    @keyframes signalAnim { to { stroke-dashoffset: 0; } }

    .vitals-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .vital-card {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .vital-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .vital-icon svg { width: 18px; height: 18px; }

    .vital-icon.heart { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .vital-icon.oxygen { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    .vital-icon.bp { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
    .vital-icon.stress { background: rgba(16, 185, 129, 0.15); color: #10b981; }

    .vital-data {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .vital-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .vital-unit {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .vital-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .processing-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .proc-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .proc-dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
    }

    /* ═══ E-VISA DEMO ═══ */
    .evisa-demo .demo-content { padding: 2rem; }

    .document-scanner-large {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .passport-preview { display: flex; justify-content: center; }

    .passport-card {
      width: 320px;
      background: linear-gradient(145deg, #1a365d, #2c5282);
      border-radius: 12px;
      padding: 1.25rem;
      position: relative;
      overflow: hidden;
      color: #fff;
    }

    .passport-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .country-name {
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .emblem {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
    }

    .passport-middle {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .photo-box {
      width: 80px;
      height: 100px;
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
    }

    .info-fields {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-fields .field { display: flex; flex-direction: column; }

    .info-fields .label {
      font-size: 0.5rem;
      opacity: 0.7;
      text-transform: uppercase;
    }

    .info-fields .value {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .info-fields .value.highlight { color: #fbbf24; }

    .info-fields .value.scan-text {
      animation: textReveal 2s ease-out forwards;
    }

    @keyframes textReveal {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .passport-mrz {
      font-family: var(--font-mono);
      font-size: 0.5rem;
      line-height: 1.4;
      opacity: 0.6;
      letter-spacing: 1px;
    }

    .scan-beam {
      position: absolute;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.3), transparent);
      animation: scanBeamMove 2.5s ease-in-out infinite;
    }

    @keyframes scanBeamMove {
      0%, 100% { top: 0; }
      50% { top: calc(100% - 40px); }
    }

    .extraction-panel {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .extract-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }

    .extract-header svg {
      width: 20px;
      height: 20px;
      color: var(--accent);
    }

    .extract-fields {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .extract-row {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .extract-row .key {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .extract-row .val {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-primary);
      font-family: var(--font-mono);
    }

    .extract-row .val.typing-anim {
      border-right: 2px solid var(--accent);
      animation: typingCursor 0.7s infinite;
    }

    @keyframes typingCursor {
      0%, 50% { border-color: var(--accent); }
      51%, 100% { border-color: transparent; }
    }

    .accuracy-meter {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .acc-label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .acc-bar {
      flex: 1;
      height: 6px;
      background: var(--bg-tertiary);
      border-radius: 3px;
      overflow: hidden;
    }

    .acc-fill {
      height: 100%;
      width: 99.2%;
      background: linear-gradient(90deg, #10b981, #34d399);
      border-radius: 3px;
      animation: fillGrow 1.5s ease-out forwards;
    }

    @keyframes fillGrow { from { width: 0; } }

    .acc-value {
      font-size: 0.875rem;
      font-weight: 700;
      color: #10b981;
    }

    .mrz-validation {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 8px;
      font-size: 0.8125rem;
      color: #10b981;
    }

    .check-icon { font-size: 1rem; }

    /* ═══ EXAM DEMO ═══ */
    .exam-demo-large .demo-content { padding: 0; }

    .exam-simulator { background: var(--bg-secondary); }

    .exam-chrome {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-subtle);
    }

    .chrome-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .timer-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--text-primary);
    }

    .timer-display svg {
      width: 24px;
      height: 24px;
      color: var(--accent);
    }

    .progress-info {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .chrome-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .candidate-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .candidate-info .avatar {
      width: 28px;
      height: 28px;
      background: var(--bg-tertiary);
      border-radius: 50%;
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.6875rem;
      font-weight: 700;
      color: #ef4444;
      text-transform: uppercase;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      animation: livePulse 1s infinite;
    }

    @keyframes livePulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .exam-body {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .question-area {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .q-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .q-num {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--accent);
    }

    .q-marks {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .q-text {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .option-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .option-item.selected {
      border-color: var(--accent);
      background: rgba(var(--accent-rgb), 0.1);
    }

    .option-item.selected.correct {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.1);
    }

    .opt-marker {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 600;
      background: var(--bg-tertiary);
      border-radius: 6px;
    }

    .option-item.selected .opt-marker {
      background: var(--accent);
      color: #fff;
    }

    .option-item.selected.correct .opt-marker { background: #10b981; }

    .opt-content {
      flex: 1;
      font-size: 0.9375rem;
    }

    .correct-icon {
      color: #10b981;
      font-size: 1.25rem;
    }

    .exam-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .results-card {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }

    .score-circle {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto 1rem;
    }

    .score-circle svg { width: 100%; height: 100%; }

    .score-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .score-num {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #10b981;
    }

    .score-label {
      font-size: 0.6875rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
    }

    .stats-row {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
      font-size: 0.6875rem;
    }

    .stat-item span {
      display: block;
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .stat-item.correct { color: #10b981; }
    .stat-item.wrong { color: #ef4444; }
    .stat-item.skipped { color: #f59e0b; }

    .nav-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1rem;
    }

    .nav-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      font-size: 0.75rem;
      font-weight: 500;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      color: var(--text-secondary);
    }

    .nav-cell.answered {
      background: #10b981;
      border-color: #10b981;
      color: #fff;
    }

    .nav-cell.current {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }

    .nav-cell.flagged {
      background: #f59e0b;
      border-color: #f59e0b;
      color: #fff;
    }

    /* ═══ BANKING DEMO ═══ */
    .banking-demo-large .demo-content {
      padding: 0;
      max-width: 400px;
      margin: 0 auto;
    }

    .banking-app {
      background: var(--bg-secondary);
      padding: 1.5rem;
    }

    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .greeting-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .user-name {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .notification-bell { position: relative; }

    .notification-bell svg {
      width: 24px;
      height: 24px;
      color: var(--text-secondary);
    }

    .notif-dot {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
    }

    .hsa-card {
      position: relative;
      width: 100%;
      aspect-ratio: 1.586/1;
      background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #000));
      border-radius: 16px;
      padding: 1.5rem;
      color: #fff;
      margin-bottom: 1.5rem;
    }

    .card-logo {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      opacity: 0.8;
    }

    .card-balance { margin-top: 1.5rem; }

    .bal-label {
      display: block;
      font-size: 0.6875rem;
      opacity: 0.7;
    }

    .bal-amount {
      font-size: 1.75rem;
      font-weight: 700;
    }

    .card-number-row {
      margin-top: 1rem;
      font-size: 0.875rem;
      font-family: var(--font-mono);
      letter-spacing: 2px;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 0.75rem;
      font-size: 0.6875rem;
    }

    .card-chip {
      position: absolute;
      right: 1.5rem;
      top: 1.5rem;
      width: 40px;
      height: 30px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 4px;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.375rem;
      padding: 0.75rem 0.5rem;
      background: var(--bg-card);
      border-radius: 12px;
      cursor: pointer;
    }

    .action-btn svg {
      width: 20px;
      height: 20px;
      color: var(--accent);
    }

    .action-btn span {
      font-size: 0.625rem;
      color: var(--text-secondary);
    }

    .tx-section-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .tx-section-header a {
      font-size: 0.75rem;
      color: var(--accent);
    }

    .tx-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .tx-item-large {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-card);
      border-radius: 12px;
    }

    .tx-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tx-icon svg { width: 20px; height: 20px; }

    .tx-icon.debit { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .tx-icon.credit { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .tx-details { flex: 1; }

    .tx-title {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .tx-date {
      font-size: 0.6875rem;
      color: var(--text-tertiary);
    }

    .tx-amount {
      font-size: 0.9375rem;
      font-weight: 600;
      font-family: var(--font-mono);
    }

    .tx-amount.debit { color: #ef4444; }
    .tx-amount.credit { color: #10b981; }

    /* ═══ DASHBOARD DEMO ═══ */
    .dashboard-demo-large .demo-content { padding: 0; }

    .admin-dashboard {
      display: grid;
      grid-template-columns: 200px 1fr;
      min-height: 400px;
    }

    .dash-sidebar-large {
      background: var(--bg-card);
      padding: 1.5rem 1rem;
      border-right: 1px solid var(--border-subtle);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: var(--accent);
      border-radius: 8px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      border-radius: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .nav-link:hover { background: var(--bg-secondary); }

    .nav-link.active {
      background: rgba(var(--accent-rgb), 0.1);
      color: var(--accent);
    }

    .nav-link svg { width: 18px; height: 18px; }

    .dash-main-large {
      background: var(--bg-secondary);
      padding: 1.5rem;
    }

    .dash-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .dash-topbar h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .date-picker {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--bg-card);
      border-radius: 8px;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .date-picker svg { width: 16px; height: 16px; }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .metric-card-large {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1rem;
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .metric-title {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .metric-trend {
      font-size: 0.6875rem;
      font-weight: 600;
    }

    .metric-trend.up { color: #10b981; }
    .metric-trend.down { color: #ef4444; }

    .metric-value-large {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .metric-chart {
      height: 24px;
      border-radius: 4px;
      opacity: 0.3;
    }

    .metric-chart.mini-up {
      background: linear-gradient(to right, transparent, #10b981);
      clip-path: polygon(0 80%, 20% 60%, 40% 70%, 60% 40%, 80% 50%, 100% 20%, 100% 100%, 0 100%);
    }

    .metric-chart.mini-down {
      background: linear-gradient(to right, transparent, #ef4444);
      clip-path: polygon(0 20%, 20% 40%, 40% 30%, 60% 60%, 80% 50%, 100% 80%, 100% 100%, 0 100%);
    }

    .chart-area {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1rem;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .chart-legend {
      display: flex;
      gap: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      font-weight: 400;
      color: var(--text-secondary);
    }

    .legend-item .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .legend-item .dot.primary { background: var(--accent); }
    .legend-item .dot.secondary { background: var(--text-tertiary); }

    .chart-canvas { height: 120px; }

    .chart-canvas svg { width: 100%; height: 100%; }

    .chart-line-anim {
      stroke-dasharray: 600;
      stroke-dashoffset: 600;
      animation: chartLineAnim 2s ease-out forwards;
    }

    @keyframes chartLineAnim { to { stroke-dashoffset: 0; } }

    /* ═══ DMS DEMO ═══ */
    .dms-demo .demo-content { padding: 0; }

    .dms-interface {
      display: grid;
      grid-template-columns: 220px 1fr;
      min-height: 350px;
    }

    .folder-tree {
      background: var(--bg-card);
      border-right: 1px solid var(--border-subtle);
      padding: 1rem;
    }

    .tree-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .tree-header svg {
      width: 18px;
      height: 18px;
      color: var(--accent);
    }

    .tree-items {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .tree-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      border-radius: 6px;
      cursor: pointer;
    }

    .tree-item:hover { background: var(--bg-secondary); }

    .tree-item.active {
      background: rgba(var(--accent-rgb), 0.1);
      color: var(--accent);
    }

    .tree-item svg { width: 16px; height: 16px; }

    .tree-item.folder svg { color: #f59e0b; }

    .tree-item.indent { margin-left: 1.5rem; }

    .doc-preview-area {
      background: var(--bg-secondary);
      display: flex;
      flex-direction: column;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-subtle);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .preview-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-icon {
      background: none;
      border: none;
      padding: 0.375rem;
      cursor: pointer;
      border-radius: 6px;
    }

    .action-icon:hover { background: var(--bg-secondary); }

    .action-icon svg {
      width: 18px;
      height: 18px;
      color: var(--text-secondary);
    }

    .doc-canvas {
      flex: 1;
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      position: relative;
    }

    .doc-page {
      width: 200px;
      background: #fff;
      border-radius: 4px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    [data-theme="dark"] .doc-page { background: var(--bg-card); }

    .page-header-bar {
      height: 16px;
      background: var(--accent);
      border-radius: 2px;
      margin-bottom: 1rem;
    }

    .page-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .text-block {
      height: 8px;
      background: var(--bg-tertiary);
      border-radius: 2px;
    }

    .text-block.short { width: 60%; }

    .highlight-region {
      position: relative;
      padding: 0.75rem;
      background: rgba(var(--accent-rgb), 0.1);
      border: 1px dashed var(--accent);
      border-radius: 4px;
      margin: 0.5rem 0;
    }

    .ocr-tag {
      position: absolute;
      top: -8px;
      left: 8px;
      font-size: 0.5rem;
      font-weight: 600;
      padding: 2px 6px;
      background: var(--accent);
      color: #fff;
      border-radius: 4px;
    }

    .scan-indicator {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 220px;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      animation: docScan 2s ease-in-out infinite;
    }

    @keyframes docScan {
      0%, 100% { top: 10%; }
      50% { top: 80%; }
    }

    .ocr-results-panel {
      padding: 1rem;
      background: var(--bg-card);
      border-top: 1px solid var(--border-subtle);
    }

    .results-header {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .extracted-text {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    /* ═══ MIDDLEWARE DEMO ═══ */
    .middleware-demo .demo-content { padding: 2rem; }

    .api-flow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .flow-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.25rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      min-width: 120px;
      text-align: center;
      position: relative;
    }

    .flow-node.active {
      border-color: var(--accent);
      background: rgba(var(--accent-rgb), 0.1);
    }

    .node-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-tertiary);
      border-radius: 10px;
    }

    .flow-node.active .node-icon {
      background: var(--accent);
      color: #fff;
    }

    .node-icon svg { width: 20px; height: 20px; }

    .node-label {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .node-tech {
      font-size: 0.6875rem;
      color: var(--text-tertiary);
    }

    .processing-badge {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.75rem;
      background: #10b981;
      color: #fff;
      font-size: 0.625rem;
      font-weight: 600;
      border-radius: 100px;
      white-space: nowrap;
    }

    .proc-spinner {
      width: 8px;
      height: 8px;
      border: 1.5px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .flow-arrow {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
    }

    .arrow-line {
      height: 2px;
      width: 100%;
      background: var(--border-subtle);
      position: relative;
    }

    .arrow-line::after {
      content: '';
      position: absolute;
      right: 0;
      top: -4px;
      border: 5px solid transparent;
      border-left-color: var(--border-subtle);
    }

    .flow-arrow.reverse .arrow-line::after {
      left: 0;
      right: auto;
      border-left-color: transparent;
      border-right-color: var(--border-subtle);
    }

    .arrow-label {
      font-size: 0.625rem;
      color: var(--text-tertiary);
      margin-top: 0.25rem;
    }

    .arrow-packets {
      position: absolute;
      top: -4px;
      left: 0;
      right: 0;
      display: flex;
      gap: 6px;
      animation: movePackets 1.5s linear infinite;
    }

    .flow-arrow.reverse .arrow-packets {
      animation: movePacketsReverse 1.5s linear infinite;
    }

    .packet {
      width: 6px;
      height: 6px;
      background: var(--accent);
      border-radius: 2px;
    }

    @keyframes movePackets {
      from { transform: translateX(-20px); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      to { transform: translateX(80px); opacity: 0; }
    }

    @keyframes movePacketsReverse {
      from { transform: translateX(80px); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      to { transform: translateX(-20px); opacity: 0; }
    }

    .transform-demo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
    }

    .code-block {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      overflow: hidden;
      min-width: 220px;
    }

    .block-header {
      padding: 0.5rem 1rem;
      background: var(--bg-tertiary);
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
    }

    .code-lines {
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      line-height: 1.6;
    }

    .code-lines .key { color: var(--accent); }

    .transform-arrow {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-secondary);
      border-radius: 50%;
    }

    .transform-arrow svg {
      width: 20px;
      height: 20px;
      color: var(--accent);
    }

    /* ═══ DEFAULT DEMO ═══ */
    .default-demo .demo-content { padding: 2rem; }

    .generic-showcase {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    .tech-cloud {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
    }

    .tech-bubble {
      padding: 0.5rem 1rem;
      background: rgba(var(--accent-rgb), 0.1);
      border: 1px solid var(--accent);
      border-radius: 100px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--accent);
    }

    .code-window {
      width: 100%;
      max-width: 500px;
      background: var(--bg-secondary);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }

    .window-bar {
      display: flex;
      gap: 6px;
      padding: 0.75rem 1rem;
      background: var(--bg-tertiary);
    }

    .window-bar span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .window-bar span:nth-child(1) { background: #ef4444; }
    .window-bar span:nth-child(2) { background: #f59e0b; }
    .window-bar span:nth-child(3) { background: #10b981; }

    .code-content {
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      line-height: 1.8;
    }

    .code-line .kw { color: #c678dd; }
    .code-line .str { color: #98c379; }
    .code-line .dec { color: #e5c07b; }
    .code-line .bool { color: #d19a66; }

    /* ═══ INFO & SECTIONS ═══ */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-card {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1rem 1.25rem;
    }

    .info-label {
      display: block;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin-bottom: 0.375rem;
    }

    .info-value {
      font-size: 0.9375rem;
      color: var(--text-primary);
    }

    .section-subtitle {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .tech-section,
    .highlights-section,
    .links-section,
    .gallery-section,
    .casestudy-section {
      margin-bottom: 2rem;
    }

    .tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tech-chip {
      padding: 0.375rem 0.875rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 100px;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .highlights-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .highlights-list li {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      font-size: 0.9375rem;
      line-height: 1.5;
    }

    .highlight-arrow {
      color: var(--accent);
      font-weight: 600;
      flex-shrink: 0;
    }

    .links-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .link-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      font-size: 0.875rem;
      color: var(--text-primary);
      transition: all 0.2s ease;
    }

    .link-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .gallery-item {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s;
      }

      &:hover img { transform: scale(1.03); }
    }

    .markdown-content { line-height: 1.7; }

    .markdown-content h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 2rem 0 1rem;
    }

    .markdown-content p {
      margin-bottom: 1rem;
      color: var(--text-secondary);
    }

    .markdown-content ul {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    .markdown-content li {
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
    }

    .markdown-content strong { color: var(--accent); }

    /* Responsive */
    @media (max-width: 1024px) {
      .vitals-demo .demo-content { grid-template-columns: 1fr; }
      .document-scanner-large { grid-template-columns: 1fr; }
      .exam-body { grid-template-columns: 1fr; }
      .admin-dashboard { grid-template-columns: 1fr; }
      .dash-sidebar-large { display: none; }
      .metrics-row { grid-template-columns: repeat(2, 1fr); }
      .dms-interface { grid-template-columns: 1fr; }
      .folder-tree { display: none; }
      .api-flow { flex-wrap: wrap; }
      .transform-demo { flex-direction: column; }
    }

    @media (max-width: 768px) {
      .project-title { font-size: 1.75rem; }
      .demo-content { padding: 1rem; }
      .vitals-grid { grid-template-columns: 1fr; }
      .metrics-row { grid-template-columns: 1fr 1fr; }
      .quick-actions { grid-template-columns: repeat(2, 1fr); }
    }
  `],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  profileService = inject(ProfileService);
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  project = signal<Project | null>(null);
  renderedCaseStudy = signal('');
  demoState = signal(false);
  private demoInterval: ReturnType<typeof setInterval> | null = null;

  questionNav = Array.from({ length: 25 }, (_, i) => i);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('projectSlug');
      const found = this.profileService.projects().find(p => p.slug === slug);
      this.project.set(found || null);

      if (found) {
        this.seoService.update({
          title: found.title,
          description: found.description,
        });

        if (found.caseStudy) {
          this.renderedCaseStudy.set(marked(found.caseStudy) as string);
        }
      }
    });

    // Demo state toggle for animations
    if (typeof window !== 'undefined') {
      this.demoInterval = setInterval(() => {
        this.demoState.set(!this.demoState());
      }, 2500);
    }
  }

  ngOnDestroy(): void {
    if (this.demoInterval) {
      clearInterval(this.demoInterval);
    }
  }

  getDemoType(project: Project): string {
    const slug = project.slug.toLowerCase();
    
    if (slug.includes('vitals')) return 'vitals';
    if (slug.includes('evisa') || slug.includes('e-visa')) return 'evisa';
    if (slug.includes('exam')) return 'exam';
    if (slug.includes('hsa')) return 'banking';
    if (slug.includes('admin') || slug.includes('panel')) return 'dashboard';
    if (slug.includes('dms') || slug.includes('document')) return 'dms';
    if (slug.includes('middleware')) return 'middleware';
    
    return 'default';
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
