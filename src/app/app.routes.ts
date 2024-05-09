import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects.page').then( m => m.ProjectsPage)
  },
  {
    path: 'project-create',
    loadComponent: () => import('./project-create/project-create.page').then( m => m.ProjectCreatePage)
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./project/project.page').then( m => m.ProjectPage)
  },
  {
    path: 'task-create/:id',
    loadComponent: () => import('./task-create/task-create.page').then( m => m.TaskCreatePage)
  },
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats.page').then( m => m.StatsPage)
  },
];
