import { Component } from '@angular/core';
import { ComicListComponent } from "../comics/components/comic-list.component";
import { AuthService } from '../auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <section class="mt-8 space-y-4">
      @if(auth.isAuthenticated()) {
      <app-comic-list></app-comic-list>
      } @else {
        <div class="text-center space-y-4">
            <h1 class="text-2xl font-bold">Welcome to Duckhub!</h1>
            <p>Discover a world of ducks and ducklings</p>
        </div>
      }
    </section>
  `,
  imports: [ComicListComponent]
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}
