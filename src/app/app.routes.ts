import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/components/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // path vers login et register
  { path: 'auth/login', component: LoginComponent },
  // on branchera les features ensuite
  // { path: 'comics', loadChildren: () => import('./features/comics/comics.routes').then(m => m.comicsRoutes) },
  { path: '**', redirectTo: '' }
];