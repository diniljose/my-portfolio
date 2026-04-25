import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/portfolio-layout.component').then(m => m.PortfolioLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about.component').then(m => m.AboutComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects.component').then(m => m.ProjectsComponent),
      },
      {
        path: 'projects/:projectSlug',
        loadComponent: () =>
          import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./pages/experience/experience.component').then(m => m.ExperienceComponent),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./pages/skills/skills.component').then(m => m.SkillsComponent),
      },
      {
        path: 'resume',
        loadComponent: () =>
          import('./pages/resume/resume.component').then(m => m.ResumeComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(m => m.ContactComponent),
      },
    ],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.adminRoutes),
  },
  // Redirect old profile routes to new structure
  {
    path: 'p/:slug',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'p/:slug/:path',
    redirectTo: ':path',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
