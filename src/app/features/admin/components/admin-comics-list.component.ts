import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComicsService } from '../../comics/services/comics.service';
import { AdminComicsService } from '../services/admin-comics.service';

@Component({
  standalone: true,
  selector: 'app-admin-comics-list',
  imports: [RouterLink],
  template: `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Comics</h2>
      <a routerLink="/admin/comics/new" class="px-3 py-1 border rounded">New Comic</a>
    </div>

    <div class="flex flex-wrap gap-6">
      @for (c of comics(); track c.id) {
        <div class="w-72 border rounded-xl overflow-hidden">
          <img [src]="c.coverUrl" [alt]="c.title" class="w-full aspect-[3/5] object-cover" />
          <div class="p-3 space-y-2">
            <div class="font-semibold">{{ c.title }}</div>
            <div class="text-xs text-gray-600">{{ c.slug }}</div>
            <div class="flex gap-2">
              <a [routerLink]="['/admin/comics', c.id]" class="px-3 py-1 border rounded text-sm">Edit</a>
              <button class="px-3 py-1 border rounded text-sm" (click)="remove(c.id)">Delete</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminComicsListComponent {
  private comicsSvc = inject(ComicsService);
  private admin = inject(AdminComicsService);

  comics = computed(() => {
    if (this.comicsSvc.comics().length === 0) this.comicsSvc.load();
    return this.admin.list(this.comicsSvc.comics());
  });

  remove(id: string) {
    this.admin.remove(id);
  }
}