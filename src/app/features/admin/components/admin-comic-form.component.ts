import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ComicsService, Comic, Chapter } from '../../comics/services/comics.service';
import { AdminComicsService } from '../services/admin-comics.service';
import { toSlug } from '../utils/slug.util';

@Component({
  standalone: true,
  selector: 'app-admin-comic-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">{{ isEdit ? 'Edit Comic' : 'New Comic' }}</h2>
        <a routerLink="/admin/comics" class="underline text-sm">Back</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="grid gap-4 max-w-3xl">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm">Title</span>
            <input class="w-full border rounded px-3 py-2" formControlName="title" (input)="syncSlug()" />
          </label>
          <label class="block">
            <span class="text-sm">Slug</span>
            <input class="w-full border rounded px-3 py-2" formControlName="slug" />
          </label>
        </div>

        <label class="block">
          <span class="text-sm">Author</span>
          <input class="w-full border rounded px-3 py-2" formControlName="author" />
        </label>

        <label class="block">
          <span class="text-sm">Cover URL</span>
          <input class="w-full border rounded px-3 py-2" formControlName="coverUrl" />
        </label>

        <label class="block">
          <span class="text-sm">Tags (comma separated)</span>
          <input class="w-full border rounded px-3 py-2" formControlName="tagsRaw" />
        </label>

        <label class="block">
          <span class="text-sm">Description</span>
          <textarea class="w-full border rounded px-3 py-2" formControlName="description" rows="4"></textarea>
        </label>

        <div class="flex gap-2">
          <button class="px-4 py-2 border rounded" type="submit" [disabled]="form.invalid">
            {{ isEdit ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>

      <!-- Chapters -->
      @if (isEdit) {
        <section class="space-y-3">
          <h3 class="font-semibold">Chapters</h3>
          <div class="flex flex-col gap-3">
            @for (ch of current().chapters; track ch.id) {
              <div class="border rounded p-3 flex items-center gap-3">
                <div class="text-sm grow">#{{ ch.number }} — {{ ch.title }}</div>
                <button class="px-3 py-1 border rounded text-sm" (click)="editChapter(ch)">Edit</button>
                <button class="px-3 py-1 border rounded text-sm" (click)="removeChapter(ch.id)">Delete</button>
              </div>
            }
            <button class="px-3 py-1 border rounded text-sm w-fit" (click)="addChapter()">Add Chapter</button>
          </div>
        </section>
      }
    </div>
  `
})
export class AdminComicFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private comics = inject(ComicsService);
  private admin = inject(AdminComicsService);

  isEdit = false;

  form = this.fb.group({
    id: [''],
    title: ['', Validators.required],
    slug: ['', Validators.required],
    author: [''],
    coverUrl: ['/assets/cover test.jpg'],
    description: [''],
    tagsRaw: [''],
  });

  current = () => {
    const base = this.comics.comics();
    if (base.length === 0) this.comics.load();
    const id = this.form.value.id!;
    return this.admin.getById(this.comics.comics(), id)!;
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;
    if (id) {
      const comic = this.admin.getById(this.comics.comics(), id);
      if (comic) {
        this.form.patchValue({
          id: comic.id,
          title: comic.title,
          slug: comic.slug,
          author: comic.author,
          coverUrl: comic.coverUrl,
          description: comic.description,
          tagsRaw: comic.tags.join(', '),
        });
      }
    } else {
      this.form.patchValue({ id: crypto.randomUUID() });
    }
  }

  syncSlug() {
    const t = this.form.value.title ?? '';
    if (!this.isEdit) {
      this.form.patchValue({ slug: toSlug(t) }, { emitEvent: false });
    }
  }

  save() {
    if (this.form.invalid) return;

    const v = this.form.value;
    const now = new Date().toISOString();
    const comic: Comic = {
      id: v.id!, slug: v.slug!, title: v.title!,
      description: v.description ?? '',
      author: v.author ?? '',
      coverUrl: v.coverUrl ?? '/assets/cover test.jpg',
      tags: (v.tagsRaw ?? '').split(',').map(s => s.trim()).filter(Boolean),
      createdAt: this.isEdit ? (this.current()?.createdAt ?? now) : now,
      updatedAt: now,
      chapters: this.isEdit ? (this.current()?.chapters ?? []) : [],
    };

    this.admin.upsert(this.comics.comics(), comic);
    this.comics.refreshFromOverrides();              // <- important
    this.router.navigate(['/admin/comics']);
  }

  addChapter() {
    const base = this.comics.comics();
    const c = this.admin.getById(base, this.form.value.id!);
    if (!c) return;
    const number = (c.chapters.at(-1)?.number ?? 0) + 1;
    const ch: Chapter = {
      id: crypto.randomUUID(),
      comicId: c.id,
      number,
      title: `Chapter ${number}`,
      pages: ['/assets/cover test.jpg'],
    };
    this.admin.upsertChapter(base, c.id, ch);
    this.comics.refreshFromOverrides();
  }

  editChapter(ch: Chapter) {
    const title = prompt('Chapter title', ch.title) ?? ch.title;
    const number = Number(prompt('Chapter number', String(ch.number)) ?? ch.number);
    const pagesRaw = prompt('Pages (comma separated URLs)', ch.pages.join(', ')) ?? ch.pages.join(', ');
    const pages = pagesRaw.split(',').map(s => s.trim()).filter(Boolean);
    const updated: Chapter = { ...ch, title, number, pages };
    this.admin.upsertChapter(this.comics.comics(), ch.comicId, updated);
    this.comics.refreshFromOverrides();
  }

  removeChapter(chapterId: string) {
    const base = this.comics.comics();
    const c = this.admin.getById(base, this.form.value.id!);
    if (!c) return;
    this.admin.removeChapter(base, c.id, chapterId);
    this.comics.refreshFromOverrides();
  }
}
