import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { BottomBarComponent } from './shared/components/bottom-bar/bottom-bar.components';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, BottomBarComponent],
  template: `
    <app-header />
    <main class="max-w-[85vw] mx-auto p-4 space-y-4">
      <router-outlet />
    </main>
    <app-bottom-bar />
  `
})
export class AppComponent {}
