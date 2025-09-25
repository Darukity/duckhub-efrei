import {
  Component, HostListener, OnInit, AfterViewInit,
  computed, inject, signal, effect
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
          <button class="px-3 py-1 border rounded cursor-pointer" (click)="onPrev()" [disabled]="!canPrev()">Prev</button>
          <button class="px-3 py-1 border rounded cursor-pointer" (click)="onNext()" [disabled]="!canNext()">Next</button>

          @if (!isVertical()) {
            <div class="flex items-center gap-1">
              <label class="text-sm">Page</label>
              <input type="number" min="1" [max]="pagesCount()"
                     class="w-16 border rounded px-1 py-0.5 text-center"
                     [ngModel]="currentPage()+1"
                     (ngModelChange)="jumpToPage($event)" />
              <span class="text-sm">/ {{ pagesCount() }}</span>
            </div>
          }

          <div class="flex items-center gap-1">
            <button class="px-2 py-1 border rounded text-xs cursor-pointer"
                    [class.bg-black]="isVertical()" [class.text-white]="isVertical()"
                    (click)="setMode('vertical')">Vertical</button>
            <button class="px-2 py-1 border rounded text-xs cursor-pointer"
                    [class.bg-black]="isLTR()" [class.text-white]="isLTR()"
                    (click)="setMode('ltr')">LTR</button>
            <button class="px-2 py-1 border rounded text-xs cursor-pointer"
                    [class.bg-black]="isRTL()" [class.text-white]="isRTL()"
                    (click)="setMode('rtl')">RTL</button>
          </div>
        </div>
      </div>

      @if (isVertical()) {
        <!-- WEBTOON: all pages stacked -->
        <div class="flow-vertical">
          @for (p of pages(); track p) {
            <img [src]="p" loading="lazy" [alt]="comic!.title + ' page'" class="w-full max-w-3xl mx-auto object-contain border" />
          }
        </div>
      } @else {
        <!-- LTR/RTL: single page stage -->
        <div class="stage w-full flex justify-center" [class.stage-rtl]="isRTL()">
          @if (pagesCount() > 0) {
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
    .flow-vertical { @apply max-w-6xl mx-auto flex flex-col gap-6 p-4; }
    .stage        { @apply mx-auto flex items-center justify-center p-4; }
    .stage-rtl    { direction: rtl; }
    .page         { @apply max-h-full max-w-full object-contain border; }
  `]
})
export class ReaderComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comics = inject(ComicsService);
  private settings = inject(SettingsService);
  private bm = inject(BookmarksService);

  comic: Comic | null = null;

  selectedChapterId = signal<string>('');
  pages = signal<string[]>([]);
  currentPage = signal<number>(0);

  // mode & helpers
  mode = computed<ReadingMode>(() => this.settings.settings().readingMode);
  isVertical = computed(() => this.mode() === 'vertical');
  isLTR      = computed(() => this.mode() === 'ltr');
  isRTL      = computed(() => this.mode() === 'rtl');

  // derived state
  pagesCount = computed(() => this.pages().length);
  canPrev = computed(() => this.isVertical() ? this.hasPrevChapter() : this.currentPage() > 0);
  canNext = computed(() => this.isVertical() ? this.hasNextChapter() : this.currentPage() < this.pagesCount() - 1);

  constructor() {
    // reset page on mode change to LTR/RTL, keep as-is in vertical (stacked)
    effect(() => {
      const m = this.mode();
      if (m === 'ltr' || m === 'rtl') this.currentPage.set(0);
    });

    // keep ?page=<index> synced in LTR/RTL
    effect(() => {
      if (!this.comic || this.isVertical()) return;
      // guard against empty pages
      if (this.pagesCount() === 0) return;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentPage() },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });
  }

  // lifecycle
  ngOnInit(): void {
    // react to ?page= changes (e.g., from bookmarks "Resume")
    this.route.queryParamMap.subscribe(() => this.applyPageFromQuery());

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
    // reserved for future zoom/scroll behaviors
  }

  // UI actions
  setMode(m: ReadingMode) { this.settings.setReadingMode(m); }

  onChapterChange(chapterId: string) {
    if (!this.comic) return;
    this.router.navigate(['/reader', this.comic.slug, chapterId], { replaceUrl: true });
    this.selectedChapterId.set(chapterId);
    this.loadPagesForChapter();
  }

  addBookmark() {
    if (!this.comic) return;
    const chapterId = this.selectedChapterId();
    const pageIndex = this.isVertical() ? 0 : this.currentPage();
    this.bm.set(this.comic.id, chapterId, pageIndex);
  }

  jumpToPage(pageNum: number) {
    const total = this.pagesCount();
    if (total === 0) return;
    const target = Math.max(1, Math.min(total, Math.floor(pageNum)));
    this.currentPage.set(target - 1);
  }

  // keyboard
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (this.isVertical()) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.nextChapter();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   this.prevChapter();
      return;
    }
    if (this.isLTR()) {
      if (e.key === 'ArrowRight') this.onNext();
      if (e.key === 'ArrowLeft')  this.onPrev();
    }
    if (this.isRTL()) {
      if (e.key === 'ArrowRight') this.onPrev();
      if (e.key === 'ArrowLeft')  this.onNext();
    }
  }

  // data ops
  private loadPagesForChapter() {
    if (!this.comic) { this.pages.set([]); return; }
    const ch = this.comic.chapters.find(x => x.id === this.selectedChapterId());
    this.pages.set(ch?.pages ?? []);
    this.currentPage.set(0);
    this.applyPageFromQuery(); // apply ?page= if present (LTR/RTL only)
  }

  private applyPageFromQuery(): void {
    if (this.isVertical()) return;
    if (this.pagesCount() === 0) return;

    const pageParam = this.route.snapshot.queryParamMap.get('page');
    if (pageParam == null) return;

    const n = Math.floor(Number(pageParam));
    if (!Number.isFinite(n)) return;

    const idx = Math.max(0, Math.min(this.pagesCount() - 1, n));
    this.currentPage.set(idx);
  }

  // nav (per mode)
  onPrev() {
    if (this.isVertical()) { this.prevChapter(); return; }
    if (this.currentPage() > 0) this.currentPage.update(v => v - 1);
  }

  onNext() {
    if (this.isVertical()) { this.nextChapter(); return; }
    if (this.currentPage() < this.pagesCount() - 1) this.currentPage.update(v => v + 1);
  }

  // chapters helpers
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