import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/admin-login.component').then(m => m.AdminLoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/admin-profile-editor.component').then(m => m.AdminProfileEditorComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/admin-projects-editor.component').then(m => m.AdminProjectsEditorComponent),
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./pages/experience/admin-experience-editor.component').then(m => m.AdminExperienceEditorComponent),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./pages/skills/admin-skills-editor.component').then(m => m.AdminSkillsEditorComponent),
      },
      {
        path: 'education',
        loadComponent: () =>
          import('./pages/education/admin-education-editor.component').then(m => m.AdminEducationEditorComponent),
      },
    ],
  },
];
