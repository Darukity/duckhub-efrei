import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpLoadingService {
  private _count = signal(0);
  readonly active = computed(() => this._count() > 0);

  start() { this._count.update(n => n + 1); }
  stop()  { this._count.update(n => Math.max(0, n - 1)); }
}
