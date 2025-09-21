import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main class="max-w-6xl mx-auto p-4 space-y-4">

      <router-outlet />
    </main>
  `
})
export class AppComponent {}
