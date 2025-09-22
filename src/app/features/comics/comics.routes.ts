import { Routes } from '@angular/router';
import { ComicListComponent } from './components/comic-list.component';
import { ComicDetailComponent } from './components/comic-detail.component';

export const comicsRoutes: Routes = [
  { path: '', component: ComicListComponent },
  { path: ':slug', component: ComicDetailComponent },
  { path: ':slug/:chapterId', component: ComicDetailComponent }
];
