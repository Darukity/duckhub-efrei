import { Injectable, signal, effect, computed } from '@angular/core';
import { Bookmark } from '../models/bookmark.model';

const KEY = 'duckhub_bookmarks';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  private _items = signal<Bookmark[]>(this.restore());
  items = this._items.asReadonly();
  count = computed(() => this._items().length);

  constructor() {
    effect(() => {
      localStorage.setItem(KEY, JSON.stringify(this._items()));
    });
  }

  set(comicId: string, chapterId: string, pageIndex: number) {
    const now = new Date().toISOString();
    const idx = this._items().findIndex(b => b.comicId === comicId);
    if (idx >= 0) {
      this._items.mutate(arr => arr[idx] = { comicId, chapterId, pageIndex, updatedAt: now });
    } else {
      this._items.update(arr => [{ comicId, chapterId, pageIndex, updatedAt: now }, ...arr]);
    }
  }

  get(comicId: string) { return this._items().find(b => b.comicId === comicId); }
  remove(comicId: string) { this._items.update(arr => arr.filter(b => b.comicId !== comicId)); }

  private restore(): Bookmark[] { try { return JSON.parse(localStorage.getItem(KEY) ?? ''); } catch { return []; } }
}