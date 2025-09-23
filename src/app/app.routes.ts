import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'comics', loadChildren: () => import('./features/comics/comics.routes').then(m => m.comicsRoutes) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes) },
  { path: 'reader', loadChildren: () => import('./features/reader/reader.routes').then(m => m.readerRoutes) },
  { path: 'settings', loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes) },
  { path: '**', redirectTo: '' }
];