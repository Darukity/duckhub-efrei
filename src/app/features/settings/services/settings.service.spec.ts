import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';

const KEY = 'duckhub_settings';

describe('SettingsService', () => {
  let svc: SettingsService;

  beforeEach(() => {
    localStorage.removeItem(KEY);

    TestBed.configureTestingModule({
      providers: [SettingsService],
    });

    svc = TestBed.inject(SettingsService);
  });

  it('default reading mode is vertical', () => {
    expect(svc.settings().readingMode).toBe('vertical');
  });

  it('should persist reading mode to localStorage', async () => {
    svc.setReadingMode('rtl');

    // allow the effect() to run
    await Promise.resolve();         // microtask
    await new Promise(r => setTimeout(r, 0)); // next macrotask

    const stored = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    expect(stored.readingMode).toBe('rtl');
  });
});