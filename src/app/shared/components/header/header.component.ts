import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="sticky top-0 z-50 bg-main backdrop-blur
             rounded-b-default h-32 shadow-[0px_0px_10px_0px_var(--color-shadow),inset_0px_-0px_10px_0px_var(--color-inset)]"
      role="navigation" aria-label="Top bar"
    >
      <div class="mx-auto max-w-[100dvw] px-5 sm:px-8 h-full w-[95dvw]
                  flex items-center justify-between">
        <!-- Brand -->
        <a routerLink="/" class="flex items-center gap-2 select-none">
          <img src="/assets/logo.svg" alt="DuckHub" class="h-22 w-22" />
          <span class="font-bold text-text text-large">DuckHub</span>
        </a>

        <!-- Menu (hidden on phones except Login/Logout) -->
        <div class="flex items-center gap-4 font-bold text-normal text-text">
          <div class="hidden md:flex items-center w-[50dvw] justify-around gap-4">
            <a routerLink="/comics" routerLinkActive="underline" class="hover:underline">New Releases</a>

            @if (auth.isAuthenticated()) {
              <a routerLink="/bookmarks" routerLinkActive="underline" class="hover:underline">Bookmarks</a>
              <a routerLink="/settings" routerLinkActive="underline" class="hover:underline">Settings</a>

              @if (auth.isAdmin()) {
                <a routerLink="/admin" routerLinkActive="underline" class="hover:underline">Admin</a>
              }
            }
          </div>

          <!-- Login / Logout (always visible) -->
          @if (!auth.isAuthenticated()) {
            <a
              routerLink="/auth/login"
              class="rounded-4xl px-4 py-2 border border-[--color-text]
                     text-[--color-text] hover:bg-[--color-primary-light] hover:text-[--color-main]
                     transition-colors shadow-md shadow-[--color-shadow]/40"
            >Login</a>
          } @else {
            <button
              (click)="auth.logout()"
              class="rounded-4xl px-4 py-2 border border-[--color-text]
                     text-[--color-text] hover:bg-[--color-primary-light] hover:text-[--color-main]
                     transition-colors shadow-md shadow-[--color-shadow]/40"
            >Logout</button>
          }
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
}
