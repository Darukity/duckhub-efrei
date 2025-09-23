import { Injectable, signal } from '@angular/core';

export type ReadingMode = 'vertical' | 'ltr' | 'rtl';

export interface Settings {
  readingMode: ReadingMode;
}

const SETTINGS_KEY = 'duckhub_settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _settings = signal<Settings>(this.restore());
  settings = this._settings.asReadonly();

  setReadingMode(mode: ReadingMode) {
    const newSettings: Settings = { ...this._settings(), readingMode: mode };
    this._settings.set(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  }

  private restore(): Settings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Settings;
      } catch {
        return { readingMode: 'vertical' };
      }
    }
    return { readingMode: 'vertical' };
  }
}