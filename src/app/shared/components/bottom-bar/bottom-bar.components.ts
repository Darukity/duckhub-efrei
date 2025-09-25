import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-bottom-bar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Visible only on phones -->
    <nav
      class="md:hidden fixed bottom-0 inset-x-0
             bg-main text-[--color-text]
             rounded-t-default
             px-6 py-3 h-20
             shadow-[0px_0px_10px_0px_var(--color-shadow),inset_0px_-0px_10px_0px_var(--color-inset)] backdrop-blur"
      role="navigation" aria-label="Bottom bar"
    >
      <div class="flex items-center justify-around h-full">
        <a routerLink="/comics" routerLinkActive="opacity-100"
           class="flex flex-col items-center gap-1 opacity-80 hover:opacity-100">
          <img src="/assets/new_releases_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="" class="w-7 h-7" />
          <span class="text-[--text-medium]">New</span>
        </a>

        @if (auth.isAuthenticated()) {
          <a routerLink="/bookmarks" routerLinkActive="opacity-100"
             class="flex flex-col items-center gap-1 opacity-80 hover:opacity-100">
            <img src="/assets/bookmark_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="" class="w-7 h-7" />
            <span class="text-[--text-medium]">Bookmarks</span>
          </a>

          <a routerLink="/settings" routerLinkActive="opacity-100"
             class="flex flex-col items-center gap-1 opacity-80 hover:opacity-100">
            <img src="/assets/duck edit2.svg" alt="" class="w-7 h-7" />
            <span class="text-[--text-medium]">Settings</span>
          </a>
        }
      </div>
    </nav>
  `
})
export class BottomBarComponent {
  auth = inject(AuthService);
}