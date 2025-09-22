import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Chapter {
  id: string;
  comicId: string;
  number: number;
  title: string;
  pages: string[];
}
export interface Comic {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  coverUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
}

@Injectable({ providedIn: 'root' })
export class ComicsService {
  private _comics = signal<Comic[]>([]);
  comics = computed(() => this._comics());

  constructor(private http: HttpClient) {}

  load(): void {
    // JSON placé dans: public/assets/mocks/comics.json
    this.http.get<Comic[]>('/assets/mocks/comics.json')
      .subscribe(list => this._comics.set(list));
  }

  bySlug(slug: string): Comic | null {
    return this._comics().find(c => c.slug === slug) ?? null;
  }
}
