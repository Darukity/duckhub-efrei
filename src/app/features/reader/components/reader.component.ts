// src/app/features/reader/components/reader.component.ts
import {
  Component, HostListener, OnInit, AfterViewInit, ViewChildren, QueryList,
  ElementRef, computed, inject, signal
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComicsService, Comic } from '../../comics/services/comics.service';
import { SettingsService, ReadingMode } from '../../settings/services/settings.service';

import { BookmarksService } from '../../bookmarks/services/bookmarks.service';

@Component({
  standalone: true,
  selector: 'app-reader',
  imports: [RouterLink, FormsModule],
  template: `
    @if (comic) {
        <div class="max-w-6xl mx-auto p-3 flex items-center gap-3 flex-wrap">
        <a class="underline text-sm" [routerLink]="['/comics', comic.slug]">← Back to details</a>

        <div class="flex items-center gap-2">
            <label class="text-sm">Chapter</label>
            <select class="border rounded px-3 py-1 cursor-pointer"
                    [ngModel]="selectedChapterId()" (ngModelChange)="onChapterChange($event)">
            @for (ch of comic.chapters; track ch.id) {
                <option [value]="ch.id">#{{ ch.number }} — {{ ch.title }}</option>
            }
            </select>
        </div>

        <div class="ml-auto flex items-center gap-2">
            <button class="px-3 py-1 border rounded cursor-pointer" (click)="addBookmark()">Bookmark</button>
            <button class="px-3 py-1 border rounded cursor-pointer" (click)="onPrev()" [disabled]="!canGoPrev()">Prev</button>
            <button class="px-3 py-1 border rounded cursor-pointer" (click)="onNext()" [disabled]="!canGoNext()">Next</button>

            <!-- Input page (visible que en LTR/RTL) -->
            @if (mode() !== 'vertical') {
            <div class="flex items-center gap-1">
                <label class="text-sm">Page</label>
                <input type="number" min="1" [max]="pages().length"
                    class="w-16 border rounded px-1 py-0.5 text-center"
                    [ngModel]="currentPage()+1"
                    (ngModelChange)="jumpToPage($event)" />
                <span class="text-sm">/ {{ pages().length }}</span>
            </div>
            }

            <div class="flex items-center gap-1">
            <button class="px-2 py-1 border rounded text-xs cursor-pointer"
                    [class.bg-black]="mode() === 'vertical'" [class.text-white]="mode() === 'vertical'"
                    (click)="setMode('vertical')">Vertical</button>
            <button class="px-2 py-1 border rounded text-xs cursor-pointer"
                    [class.bg-black]="mode() === 'ltr'" [class.text-white]="mode() === 'ltr'"
                    (click)="setMode('ltr')">LTR</button>
            <button class="px-2 py-1 border rounded text-xs cursor-pointer"
                    [class.bg-black]="mode() === 'rtl'" [class.text-white]="mode() === 'rtl'"
                    (click)="setMode('rtl')">RTL</button>
            </div>
        </div>
        </div>

      <!-- Display area -->
      @if (mode() === 'vertical') {
        <!-- WEBTOON: all pages stacked -->
        <div class="flow-vertical">
          @for (p of pages(); track p) {
            <img [src]="p" loading="lazy" [alt]="comic!.title + ' page'" class="w-full max-w-3xl mx-auto object-contain border" />
          }
        </div>
      } @else {
        <!-- LTR/RTL: single page stage -->
        <div class="stage w-full flex justify-center" [class.stage-rtl]="mode() === 'rtl'">
          @if (pages().length > 0) {
            <img [src]="pages()[currentPage()]"
                 [alt]="comic!.title + ' page ' + (currentPage()+1)"
                 class="page h-[calc(100vh-210px)]" />
          } @else {
            <p class="p-4">No pages.</p>
          }
        </div>
      }
    } @else {
      <p class="p-4">Loading…</p>
    }
  `,
  styles: [`
    /* Vertical layout */
    .flow-vertical { @apply max-w-6xl mx-auto flex flex-col gap-6 p-4; }

    /* Single-page stage (LTR/RTL) */
    .stage      { @apply mx-auto  flex items-center justify-center p-4; }
    .stage-rtl  { direction: rtl; } /* sémantique du sens, utile si on ajoute du texte/overlay */

    .page { @apply max-h-full max-w-full object-contain border; }
  `]
})
export class ReaderComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comics = inject(ComicsService);
  private settings = inject(SettingsService);

  comic: Comic | null = null;

  selectedChapterId = signal<string>('');
  pages = signal<string[]>([]);
  currentPage = signal<number>(0);

  mode = computed<ReadingMode>(() => this.settings.settings().readingMode);

  // keep a ref to the image node for potential future effects (zoom, etc.)
  @ViewChildren('pageEl') pageEls!: QueryList<ElementRef<HTMLImageElement>>;

  jumpToPage(pageNum: number) {
    const total = this.pages().length;
    if (total === 0) return;
    let target = Math.max(1, Math.min(total, Math.floor(pageNum)));
    this.currentPage.set(target - 1);
  }

  private bm = inject(BookmarksService);
  addBookmark() {
    if (!this.comic) return;
    const chapterId = this.selectedChapterId();
    const pageIndex = this.mode() === 'vertical' ? 0 : this.currentPage();
    this.bm.set(this.comic.id, chapterId, pageIndex);
  }

private applyPageFromQuery(): void {

  if (this.mode() === 'vertical') return;
  if (this.pages().length === 0) return;

  const pageParam = this.route.snapshot.queryParamMap.get('page');
  if (pageParam == null) return;

  const n = Math.floor(Number(pageParam));
  if (!Number.isFinite(n)) return;

  const idx = Math.max(0, Math.min(this.pages().length - 1, n));
  this.currentPage.set(idx);
}



ngOnInit(): void {
    this.route.queryParamMap.subscribe(() => {
        this.applyPageFromQuery();
    });

    if (this.comics.comics().length === 0) this.comics.load();

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug')!;
      const chapterIdFromUrl = params.get('chapterId');

      const resolve = (attempt = 0) => {
        const c = this.comics.bySlug(slug);
        if (!c && attempt < 50) { setTimeout(() => resolve(attempt + 1), 100); return; }
        this.comic = c ?? null;

        if (this.comic) {
          this.selectedChapterId.set(chapterIdFromUrl ?? (this.comic.chapters[0]?.id ?? ''));
          this.loadPagesForChapter();
        }
      };
      resolve();
    });
  }

  ngAfterViewInit(): void {
    // no-op for now (reserved for future zoom/scroll)
  }

  // Keyboard navigation
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    const m = this.mode();

    if (m === 'vertical') {
      // en vertical → chapitre suivant/précédent
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.nextChapter();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   this.prevChapter();
      return;
    }

    if (m === 'ltr') {
      // lecture occidentale → droite = next, gauche = prev
      if (e.key === 'ArrowRight') this.onNext();
      if (e.key === 'ArrowLeft')  this.onPrev();
    }

    if (m === 'rtl') {
      // lecture manga → droite = prev, gauche = next
      if (e.key === 'ArrowRight') this.onPrev();
      if (e.key === 'ArrowLeft')  this.onNext();
    }
  }

  // ---- actions ----
  setMode(m: ReadingMode) { this.settings.setReadingMode(m); }

  onChapterChange(chapterId: string) {
    if (!this.comic) return;
    this.router.navigate(['/reader', this.comic.slug, chapterId], { replaceUrl: true });
    this.selectedChapterId.set(chapterId);
    this.loadPagesForChapter();
  }

  private loadPagesForChapter() {
    if (!this.comic) { this.pages.set([]); return; }
    const ch = this.comic.chapters.find(x => x.id === this.selectedChapterId());
    this.pages.set(ch?.pages ?? []);
    this.currentPage.set(0);

    // Apply ?page=N if present (LTR/RTL only)
    this.applyPageFromQuery();
  }

  // ---- Prev/Next semantics per mode ----
  onPrev() {
    const m = this.mode();
    if (m === 'vertical') { this.prevChapter(); return; }
    // LTR/RTL: page--
    if (this.currentPage() > 0) this.currentPage.update(v => v - 1);
  }

  onNext() {
    const m = this.mode();
    if (m === 'vertical') { this.nextChapter(); return; }
    // LTR/RTL: page++
    if (this.currentPage() < this.pages().length - 1) this.currentPage.update(v => v + 1);
  }

  canGoPrev(): boolean {
    const m = this.mode();
    if (m === 'vertical') return this.hasPrevChapter();
    return this.currentPage() > 0;
  }

  canGoNext(): boolean {
    const m = this.mode();
    if (m === 'vertical') return this.hasNextChapter();
    return this.currentPage() < this.pages().length - 1;
  }

  // ---- chapter helpers ----
  hasPrevChapter(): boolean {
    if (!this.comic) return false;
    const idx = this.comic.chapters.findIndex(c => c.id === this.selectedChapterId());
    return idx > 0;
  }
  hasNextChapter(): boolean {
    if (!this.comic) return false;
    const idx = this.comic.chapters.findIndex(c => c.id === this.selectedChapterId());
    return idx >= 0 && idx < this.comic.chapters.length - 1;
  }
  prevChapter(): void {
    if (!this.comic || !this.hasPrevChapter()) return;
    const idx = this.comic.chapters.findIndex(c => c.id === this.selectedChapterId());
    const prev = this.comic.chapters[idx - 1];
    this.onChapterChange(prev.id);
  }
  nextChapter(): void {
    if (!this.comic || !this.hasNextChapter()) return;
    const idx = this.comic.chapters.findIndex(c => c.id === this.selectedChapterId());
    const next = this.comic.chapters[idx + 1];
    this.onChapterChange(next.id);
  }
}
