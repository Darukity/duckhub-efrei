// src/app/features/comics/services/comics.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, shareReplay } from 'rxjs';
import { AdminComicsService } from '../../admin/services/admin-comics.service';

export interface Chapter { id: string; comicId: string; number: number; title: string; pages: string[]; }
export interface Comic   { id: string; slug: string; title: string; description: string; author: string; coverUrl: string; tags: string[]; createdAt: string; updatedAt: string; chapters: Chapter[]; }

@Injectable({ providedIn: 'root' })
export class ComicsService {
  constructor() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'duckhub_comics_overrides') {
        this.refreshFromOverrides();
      }
    });
  }
  private http = inject(HttpClient);
  private admin = inject(AdminComicsService);

  // Base list as loaded from mocks (never mutated by admin)
  private _base = signal<Comic[]>([]);
  // Public list = base merged with overrides (reactive for all consumers)
  private _comics = signal<Comic[]>([]);
  comics = this._comics.asReadonly();

  // helpers
  titles = () => this._comics().map(c => c.title);
  bySlug  = (slug: string) => this._comics().find(c => c.slug === slug) ?? null;
  byId    = (id: string)   => this._comics().find(c => c.id === id) ?? null;

  load(): void {
    this.http.get<Comic[]>('/assets/mocks/comics.json').pipe(
      map(list => list ?? []),
      catchError(() => of<Comic[]>([])),
      shareReplay(1)
    ).subscribe(list => {
      this._base.set(list);
      this.refreshFromOverrides(); // <- merge right after load
    });
  }

  /** Recompute merged list from current base + admin overrides. Call this after any admin change. */
  public refreshFromOverrides(): void {
    const merged = this.admin.list(this._base());
    this._comics.set(merged);
  }
}
