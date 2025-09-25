import { Injectable, signal } from '@angular/core';

export interface UiError { message: string; code?: number; at: string; }

@Injectable({ providedIn: 'root' })
export class HttpErrorService {
  lastError = signal<UiError | null>(null);

  notify(message: string, code?: number, at = 'http') {
    this.lastError.set({ message, code, at });
    // In a real app, plug to a toast/snackbar service here.
    // console.error(`[${at}] ${code ?? ''} ${message}`);
  }

  clear() { this.lastError.set(null); }
}
