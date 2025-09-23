import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService, ReadingMode } from '../services/settings.service';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [FormsModule],
  template: `
    <div class="max-w-sm mx-auto p-6 rounded-xl border mt-12 space-y-4">
      <h1 class="text-2xl font-bold">Settings</h1>

      <label for="readingMode" class="block text-sm font-medium">Reading mode</label>
      <select
        id="readingMode"
        [(ngModel)]="mode"
        (ngModelChange)="onModeChange($event)"
        class="border rounded px-3 py-2 w-full"
      >
        <option value="vertical">Vertical</option>
        <option value="ltr">Left → Right</option>
        <option value="rtl">Right → Left</option>
      </select>
    </div>
  `
})
export class SettingsComponent {
  private settings = inject(SettingsService);
  mode: ReadingMode = this.settings.settings().readingMode;

  onModeChange(newMode: ReadingMode) {
    this.settings.setReadingMode(newMode);
  }
}