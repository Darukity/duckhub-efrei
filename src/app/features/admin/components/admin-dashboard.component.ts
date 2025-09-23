import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="max-w-6xl mx-auto p-4">
      <header class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Admin Dashboard</h1>
        <nav class="flex gap-3 text-sm">
          <a routerLink="comics" class="underline">Comics</a>
          <a routerLink="/" class="underline">Back to site</a>
        </nav>
      </header>
      <router-outlet />
    </div>
  `
})
export class AdminDashboardComponent {}