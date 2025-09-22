import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <form (ngSubmit)="onSubmit()" [formGroup]="form" class="max-w-sm mx-auto p-6 rounded-xl border mt-12 space-y-4">
      <h1 class="text-2xl font-bold">Sign in</h1>

      <input class="input p-1 border-2 rounded-4xl border-secondary w-full" placeholder="Username" formControlName="username" />
      <input class="input p-1 border-2 rounded-4xl border-secondary w-full" type="password" placeholder="Password" formControlName="password" />

      <button class="btn-primary p-1 bg-primary rounded-4xl w-full" [disabled]="form.invalid || loading">
        {{ loading ? 'Signing in...' : 'Login' }}
      </button>

      <p class="text-sm">
        No account? <a routerLink="/auth/register" class="underline">Create one</a>
      </p>

      @if (error) {
        <div class="text-sm text-error">{{ error }}</div>
      }
    </form>
  `,
  styles: [`
    .input { @apply w-full border rounded px-3 py-2; }
    .btn-primary { @apply bg-black text-white rounded px-4 py-2; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  onSubmit() {
    this.error = '';
    if (this.form.invalid) return;
    this.loading = true;

    const { username, password } = this.form.value;
    const ok = this.auth.login(username!, password!);

    this.loading = false;
    if (!ok) {
      this.error = 'Invalid credentials';
      return;
    }
    this.router.navigateByUrl('/');
  }
}
