import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookmarksService } from '../services/bookmarks.service';
import { ComicsService } from '../../comics/services/comics.service';

@Component({
  standalone: true,
  selector: 'app-bookmarks',
  imports: [RouterLink],
  template: `
    <h1 class="text-xlarge font-bold text-center mb-6">Bookmarks</h1>

    @if (vm().length === 0) {
      <p class="text-center">No bookmarks yet.</p>
    } @else {
      <div class="flex flex-wrap gap-6 justify-around">
        @for (b of vm(); track b.comicId) {
          <div class="group w-[30rem] min-w-0 flex-shrink-0">
            <a [routerLink]="['/comics', b.slug]" class="block">
              <img [src]="b.coverUrl" [alt]="b.title"
                   class="w-full rounded-3xl aspect-[3/5] object-cover" />
            </a>
            <div class="p-3 space-y-1 text-center">
              <h2 class="font-semibold">{{ b.title }}</h2>
              <p class="text-sm text-gray-600">
                Chapter {{ b.chapterNumber }} — Page {{ b.pageIndex + 1 }}
              </p>
              <div class="flex justify-center gap-2 pt-2">
                <a class="px-3 py-1 border rounded"
                   [routerLink]="['/reader', b.slug, b.chapterId]"
                   [queryParams]="{ page: b.pageIndex }">Resume</a>
                <button class="px-3 py-1 border rounded"
                        (click)="remove(b.comicId)">Remove</button>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class BookmarksComponent {
  private bookmarks = inject(BookmarksService);
  private comics = inject(ComicsService);

  vm = computed(() => {
    if (this.comics.comics().length === 0) this.comics.load();
    return this.bookmarks.items().map(b => {
      const comic = this.comics.comics().find(c => c.id === b.comicId);
      const chapter = comic?.chapters.find(ch => ch.id === b.chapterId);
      return {
        comicId: b.comicId,
        title: comic?.title ?? 'Unknown',
        slug: comic?.slug ?? '',
        coverUrl: comic?.coverUrl ?? '/assets/cover test.jpg',
        chapterId: b.chapterId,
        chapterNumber: chapter?.number ?? 1,
        pageIndex: b.pageIndex,
      };
    });
  });

  remove(comicId: string) {
    this.bookmarks.remove(comicId);
  }
}
