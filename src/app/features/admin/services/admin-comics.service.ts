import { Injectable } from '@angular/core';
import { Comic, Chapter } from '../../comics/services/comics.service';

const KEY = 'duckhub_comics_overrides';

interface Overrides {
  comics: Comic[]; // full objects overriding by id
}

@Injectable({ providedIn: 'root' })
export class AdminComicsService {
  private loadOverrides(): Overrides {
    const raw = localStorage.getItem(KEY);
    try { return raw ? JSON.parse(raw) as Overrides : { comics: [] }; } catch { return { comics: [] }; }
  }
  private saveOverrides(data: Overrides) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  list(base: Comic[]): Comic[] {
    const o = this.loadOverrides().comics;
    if (o.length === 0) return base;
    // merge by id: override wins; if new (not in base), include it
    const map = new Map(base.map(c => [c.id, c]));
    for (const oc of o) map.set(oc.id, oc);
    return Array.from(map.values());
  }

  getById(base: Comic[], id: string): Comic | undefined {
    const merged = this.list(base);
    return merged.find(c => c.id === id);
  }

  upsert(base: Comic[], input: Comic): Comic {
    const overrides = this.loadOverrides();
    const idx = overrides.comics.findIndex(c => c.id === input.id);
    if (idx >= 0) overrides.comics[idx] = input;
    else overrides.comics.unshift(input);
    this.saveOverrides(overrides);
    return input;
  }

  remove(id: string): void {
    const overrides = this.loadOverrides();
    overrides.comics = overrides.comics.filter(c => c.id !== id);
    this.saveOverrides(overrides);
  }

  upsertChapter(base: Comic[], comicId: string, chapter: Chapter): Comic | null {
    const current = this.getById(base, comicId);
    if (!current) return null;
    const chapters = [...current.chapters];
    const idx = chapters.findIndex(ch => ch.id === chapter.id);
    if (idx >= 0) chapters[idx] = chapter; else chapters.push(chapter);
    const updated: Comic = { ...current, chapters, updatedAt: new Date().toISOString() };
    return this.upsert(base, updated);
  }

  removeChapter(base: Comic[], comicId: string, chapterId: string): Comic | null {
    const current = this.getById(base, comicId);
    if (!current) return null;
    const chapters = current.chapters.filter(ch => ch.id !== chapterId);
    const updated: Comic = { ...current, chapters, updatedAt: new Date().toISOString() };
    return this.upsert(base, updated);
  }
}
