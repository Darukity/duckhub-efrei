import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header', // préfixe "app" pour ESLint
  imports: [RouterLink],
  template: `
    <nav class="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div class="max-w-6xl mx-auto flex items-center justify-between p-3">
        <a routerLink="/" class="flex items-center gap-2">
          <img src="/assets/logo.svg" alt="DuckHub" class="h-15 w-15" />
          <span class="font-bold text-xl">DuckHub</span>
        </a>
        <div class="flex items-center gap-4 text-sm">
          <a routerLink="/comics" class="hover:underline">Comics</a>
          <a routerLink="/bookmarks" class="hover:underline">Bookmarks</a>
          <a routerLink="/settings" class="hover:underline">Settings</a>
          <a routerLink="/auth/login" class="rounded px-3 py-1 border">Login</a>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {}