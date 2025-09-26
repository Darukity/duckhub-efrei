import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComicListComponent } from "../comics/components/comic-list.component";
import { AuthService } from '../auth/services/auth.service';
import { EmotePipe } from '../../shared/pipes/emote.pipe';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, ComicListComponent, EmotePipe],
  template: `
    <!-- Hero -->
    <section class="mt-8 md:mt-12">
      <div class="max-w-5xl mx-auto text-center space-y-4 px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span [innerHTML]="'Welcome to DuckHub :Quack:' | emote:70:'align-middle':'png':{ Bruh:'gif' }"></span>
        </h1>
        <p class="text-lg opacity-90"
           [innerHTML]="'The cave for all ducks of the world :PosL::PosR:' | emote:28:'align-middle'">
        </p>

        <div class="flex items-center justify-center gap-3 flex-wrap pt-2">
          <a routerLink="/comics"
             class="px-5 py-2 rounded-3xl bg-primary text-text-light hover:opacity-90 transition">
            Browse Comics
          </a>

          @if (!auth.isAuthenticated()) {
            <a routerLink="/auth/register"
               class="px-5 py-2 rounded-3xl border border-text text-text hover:bg-primary-light hover:text-main transition">
              Create Account
            </a>
          } @else {
            <a routerLink="/bookmarks"
               class="px-5 py-2 rounded-3xl border border-text text-text hover:bg-primary-light hover:text-main transition">
              Your Bookmarks
            </a>
          }
        </div>

        <!-- fun emote line -->
        <p class="text-sm opacity-70"
           [innerHTML]="'Mood board :NRV: :Coeur: :Sleep: :Triste: :Rire: :Skull:' | emote:22:'align-middle'">
        </p>
      </div>
    </section>

    <!-- Highlights / Features -->
    <section class="mt-12 md:mt-16">
      <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4">
        <div class="rounded-2xl border p-5">
          <h3 class="font-semibold text-lg mb-1"
              [innerHTML]="'For Readers :PosL:' | emote:22:'align-middle'"></h3>
          <p>Vertical (webtoon), LTR, RTL reading modes. Keyboard navigation and quick page jump.</p>
        </div>
        <div class="rounded-2xl border p-5">
          <h3 class="font-semibold text-lg mb-1"
              [innerHTML]="'Bookmarks :Coeur:' | emote:22:'align-middle'"></h3>
          <p>Save your spot per comic & chapter. Resume instantly where you left off.</p>
        </div>
        <div class="rounded-2xl border p-5">
          <h3 class="font-semibold text-lg mb-1"
              [innerHTML]="'Accessible & Fast :Bruh:' | emote:22:'align-middle':'png':{ Bruh:'gif' }"></h3>
          <p>Tailwind v4, responsive UI, a11y in forms, and PWA-ready performance.</p>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="mt-12 md:mt-16 space-y-6 px-4">
      <h2 class="text-2xl font-bold text-center">Latest Comics</h2>

      @if (auth.isAuthenticated()) {
        <app-comic-list></app-comic-list>
      } @else {
        <div class="max-w-3xl mx-auto text-center space-y-4">
          <p class="opacity-90">
            Sign in to bookmark chapters and sync your reading preferences across sessions.
          </p>
          <div class="flex justify-center gap-3">
            <a routerLink="/auth/login"
               class="px-5 py-2 rounded-3xl border border-text text-text hover:bg-primary-light hover:text-main transition">
              Sign in
            </a>
            <a routerLink="/auth/register"
               class="px-5 py-2 rounded-3xl bg-primary text-text-light hover:opacity-90 transition">
              Create account
            </a>
          </div>
        </div>
      }
    </section>
  `
})
export class HomeComponent {
  auth = inject(AuthService);
}