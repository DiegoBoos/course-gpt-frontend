import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './presentation/layouts/dashboardLayout/dashboardLayout.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./presentation/pages/home/home.component'),
      },
      {
        path: 'course/:courseCode',
        loadComponent: () =>
          import('./presentation/pages/chatPage/chatPage.component'),
      },
      {
        path: 'course/:courseCode/:chatHistoryId',
        loadComponent: () =>
          import('./presentation/pages/chatPage/chatPage.component'),
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
