import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { AdminComicsListComponent } from './components/admin-comics-list.component';
import { AdminComicFormComponent } from './components/admin-comic-form.component';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'comics', pathMatch: 'full' },
      { path: 'comics', component: AdminComicsListComponent },
      { path: 'comics/new', component: AdminComicFormComponent },
      { path: 'comics/:id', component: AdminComicFormComponent },
    ],
  },
];
