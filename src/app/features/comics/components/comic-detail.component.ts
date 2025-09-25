import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComicsService, Comic } from '../services/comics.service';

@Component({
  standalone: true,
  selector: 'app-comic-detail',
  imports: [RouterLink, FormsModule],
  template: `
    @if (comic) {
      <div class="flex flex-col gap-8">
        <!-- Header -->
        <div class="flex gap-6">
          <img [src]="comic.coverUrl" [alt]="comic.title" class="w-48 rounded-3xl object-cover aspect-[3/5]" />
          <div class="space-y-3">
            <h1 class="text-3xl font-bold">{{ comic.title }}</h1>
            <p>{{ comic.description }}</p>
            <div class="flex gap-2 flex-wrap">
              @for (t of comic.tags; track t) {
                <span class="px-2 py-1 text-xs rounded bg-secondary text-text-light/90">{{ t }}</span>
              }
            </div>

            <!-- Chapter selector -->
            <div class="flex items-center gap-3">
              <label class="text-sm" for="chapter-select">Chapter</label>
              <select
                id="chapter-select"
                class="border rounded px-3 py-1"
                [(ngModel)]="selectedChapterId"
                (ngModelChange)="onChapterChange($event)"
              >
                @for (ch of comic.chapters; track ch.id) {
                  <option [value]="ch.id">#{{ ch.number }} — {{ ch.title }}</option>
                }
              </select>
              <a class="underline text-sm" [routerLink]="['/comics']">Back to list</a>
            </div>
          </div>
        </div>

        <!-- Gallery formatted like comic-list covers, in a flexbox -->
        <h2 class="text-3xl font-bold text-center">Pages</h2>
        @if (currentPages.length > 0) {
          <div class="flex flex-wrap gap-6 justify-around">
            @for (p of currentPages; track p) {
              <div class="w-[30rem] min-w-0 flex-shrink-0">
                <img [src]="p" [alt]="comic!.title + ' page'"
                     class="w-full rounded-3xl aspect-[3/5] object-cover" />
              </div>
            }
          </div>
        } @else {
          <p>Loading pages…</p>
        }
      </div>
    } @else {
      <p>Loading…</p>
    }
    <button
      id="play_button"
      [routerLink]="['/reader', comic!.slug, selectedChapterId]"
    >
      <img src="/assets/play_arrow_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg" alt="play" />
      <p>Read</p>
    </button>
  `
})
export class ComicDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comics = inject(ComicsService);

  comic: Comic | null = null;
  selectedChapterId = '';
  currentPages: string[] = [];

  ngOnInit() {
    if (this.comics.comics().length === 0) this.comics.load();

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug')!;
      const chapterIdFromUrl = params.get('chapterId');

      const tryResolve = (attempt = 0) => {
        const c = this.comics.bySlug(slug);
        if (!c && attempt < 50) {
          setTimeout(() => tryResolve(attempt + 1), 100);
          return;
        }
        this.comic = c ?? null;

        if (this.comic) {
          this.selectedChapterId = chapterIdFromUrl ?? (this.comic.chapters[0]?.id ?? '');
          this.refreshPages();
        }
      };

      tryResolve();
    });
  }

  onChapterChange(chapterId: string) {
    if (!this.comic) return;
    this.router.navigate(['/comics', this.comic.slug, chapterId], { replaceUrl: true });
    this.refreshPages();
  }

  private refreshPages() {
    if (!this.comic) { this.currentPages = []; return; }
    const ch = this.comic.chapters.find(x => x.id === this.selectedChapterId);
    this.currentPages = ch?.pages ?? [];
  }
}