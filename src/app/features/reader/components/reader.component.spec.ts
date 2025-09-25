import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReaderComponent } from './reader.component';
import { ComicsService, Comic } from '../../comics/services/comics.service';
import { SettingsService } from '../../settings/services/settings.service';

describe('ReaderComponent (integration)', () => {
  let comicsSvc: ComicsService;
  let settings: SettingsService;

  const mock: Comic = {
    id: '1', slug: 'duck', title: 'Duck', description: '', author: 'A',
    coverUrl: '/assets/cover.jpg', tags: [], createdAt: '', updatedAt: '',
    chapters: [{ id: 'c1', comicId: '1', number: 1, title: 'One', pages: ['/a.jpg','/b.jpg'] }]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    comicsSvc = TestBed.inject(ComicsService);
    settings = TestBed.inject(SettingsService);

    // seed comics directly
    (comicsSvc as any)._comics.set([mock]);
  });

  it('vertical mode stacks pages', () => {
    settings.setReadingMode('vertical');
    const fixture = TestBed.createComponent(ReaderComponent);
    // mock route params
    (fixture.componentInstance as any).comic = mock;
    (fixture.componentInstance as any).selectedChapterId.set('c1');
    (fixture.componentInstance as any).pages.set(mock.chapters[0].pages);

    fixture.detectChanges();
    const imgs = fixture.nativeElement.querySelectorAll('.flow-vertical img');
    expect(imgs.length).toBe(2);
  });

  it('ltr mode shows single page', () => {
    settings.setReadingMode('ltr');
    const fixture = TestBed.createComponent(ReaderComponent);
    (fixture.componentInstance as any).comic = mock;
    (fixture.componentInstance as any).selectedChapterId.set('c1');
    (fixture.componentInstance as any).pages.set(mock.chapters[0].pages);

    fixture.detectChanges();
    const stageImgs = fixture.nativeElement.querySelectorAll('.stage img');
    expect(stageImgs.length).toBe(1);
  });
});
