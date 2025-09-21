import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <section class="mt-8 space-y-4">
      <h1 class="text-4xl font-extrabold">Welcome to DuckHub</h1>
      <p class="text-gray-600">Your cozy place for duck comics.</p>
      <div class="h-2 rounded bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500"></div>
      <p class="text-sm text-gray-500">If you see the gradient bar above, Tailwind v4 is working ✔</p>
    </section>
  `
})
export class HomeComponent {}