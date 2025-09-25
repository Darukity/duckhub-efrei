import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, shareReplay } from 'rxjs';

export interface Chapter { id: string; comicId: string; number: number; title: string; pages: string[]; }
export interface Comic { id: string; slug: string; title: string; description: string; author: string; coverUrl: string; tags: string[]; createdAt: string; updatedAt: string; chapters: Chapter[]; }

@Injectable({ providedIn: 'root' })
export class ComicsService {
  private _comics = signal<Comic[]>([]);
  comics = this._comics.asReadonly();

  // exemples de dérivés utiles
  titles = computed(() => this._comics().map(c => c.title));
  bySlug = (slug: string) => this._comics().find(c => c.slug === slug) ?? null;
  byId   = (id: string)   => this._comics().find(c => c.id === id) ?? null;

  constructor(private http: HttpClient) {}

  load(): void {
    this.http.get<Comic[]>('/assets/mocks/comics.json').pipe(
      map(list => list ?? []),
      catchError(() => of<Comic[]>([])),
      shareReplay(1)
    ).subscribe(list => this._comics.set(list));
  }
}