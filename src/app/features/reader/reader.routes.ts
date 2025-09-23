import { Routes } from '@angular/router';

export const readerRoutes: Routes = [
  { path: ':slug/:chapterId', loadComponent: () => import('./components/reader.component').then(m => m.ReaderComponent) }
];