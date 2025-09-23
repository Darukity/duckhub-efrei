import { Injectable, signal } from '@angular/core';
import { Bookmark } from '../models/bookmark.model';

const KEY = 'duckhub_bookmarks';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  private _items = signal<Bookmark[]>(this.restore());
  items = this._items.asReadonly();

  set(comicId: string, chapterId: string, pageIndex: number) {
    const items = this._items();
    const idx = items.findIndex(b => b.comicId === comicId);
    const now = new Date().toISOString();

    if (idx >= 0) {
      items[idx] = { comicId, chapterId, pageIndex, updatedAt: now };
    } else {
      items.unshift({ comicId, chapterId, pageIndex, updatedAt: now });
    }
    this._items.set([...items]);
    localStorage.setItem(KEY, JSON.stringify(this._items()));
  }

  get(comicId: string): Bookmark | undefined {
    return this._items().find(b => b.comicId === comicId);
  }

  remove(comicId: string) {
    this._items.set(this._items().filter(b => b.comicId !== comicId));
    localStorage.setItem(KEY, JSON.stringify(this._items()));
  }

  private restore(): Bookmark[] {
    const raw = localStorage.getItem(KEY);
    try { return raw ? JSON.parse(raw) : []; } catch { return []; }
  }
}