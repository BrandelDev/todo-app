import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page')
      .then((m) => m.HomePage),
  },
  {
    path: 'nueva-tarea',
    loadComponent: () => import('./home/components/new-task/new-task.component')
      .then((m) => m.NewTaskComponent),
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./config-app/config-app.component')
      .then((m) => m.ConfigAppComponent),
  },
  {
    path: 'detalle-tarea/:id',
    loadComponent: () => import('./home/components/task-details/task-details.component')
      .then((m) => m.TaskDetailsComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
