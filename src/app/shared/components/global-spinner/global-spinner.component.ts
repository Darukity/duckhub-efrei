// src/app/shared/components/global-spinner/global-spinner.component.ts
import { Component, inject } from '@angular/core';
import { HttpLoadingService } from '../../../core/services/http-loading.service';

@Component({
  standalone: true,
  selector: 'app-global-spinner',
  template: `
    @if (loading.active()) {
      <div class="fixed inset-0 pointer-events-none flex items-start justify-center">
        <div class="mt-6 px-3 py-1 rounded bg-black/70 text-white text-xs">Loading…</div>
      </div>
    }
  `
})
export class GlobalSpinnerComponent {
  loading = inject(HttpLoadingService);
}