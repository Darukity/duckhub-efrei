import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // on branchera les features ensuite
  // { path: 'comics', loadChildren: () => import('./features/comics/comics.routes').then(m => m.comicsRoutes) },
  { path: '**', redirectTo: '' }
];