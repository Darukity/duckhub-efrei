import { Injectable, signal, effect, computed } from '@angular/core';

export type ReadingMode = 'vertical' | 'ltr' | 'rtl';
export interface Settings { readingMode: ReadingMode; }

const KEY = 'duckhub_settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _settings = signal<Settings>(this.restore());
  // dérivés disponibles partout
  settings = this._settings.asReadonly();
  mode = computed(() => this._settings().readingMode);

  constructor() {
    // persiste TOUT changement une seule fois, centralisé
    effect(() => {
      localStorage.setItem(KEY, JSON.stringify(this._settings()));
    });
  }

  setReadingMode(mode: ReadingMode) {
    this._settings.update(s => ({ ...s, readingMode: mode }));
  }

  private restore(): Settings {
    try { return JSON.parse(localStorage.getItem(KEY) ?? ''); }
    catch { return { readingMode: 'vertical' }; }
  }
}