import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component'; // ou AppComponent selon ton nom

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])] // fournit Router, ActivatedRoute, RouterLink, etc.
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    // adapte ce sélecteur à ton template (par ex. le texte DuckHub dans le header)
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('DuckHub');
  });
});
