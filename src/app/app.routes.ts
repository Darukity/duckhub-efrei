import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'comics', loadChildren: () => import('./features/comics/comics.routes').then(m => m.comicsRoutes) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes) },
  { path: 'reader', canActivate: [authGuard], loadChildren: () => import('./features/reader/reader.routes').then(m => m.readerRoutes) },
  { path: 'settings', canActivate: [authGuard], loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes) },
  { path: 'bookmarks', canActivate: [authGuard], loadChildren: () => import('./features/bookmarks/bookmarks.routes').then(m => m.bookmarksRoutes) },
  { path: 'admin', canActivate: [authGuard], loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes) },
  { path: '**', redirectTo: '' }
];