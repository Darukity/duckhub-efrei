import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <form focusInvalid (ngSubmit)="onSubmit()" [formGroup]="form" class="max-w-sm mx-auto p-6 rounded-xl border mt-12 space-y-4">
      <h1 class="text-2xl font-bold">Create account</h1>

      <input class="input p-1 border-2 rounded-4xl border-secondary w-full" placeholder="Username" formControlName="username" />
      @if (form.get('username')?.touched && form.get('username')?.invalid) {
        <div class="text-xs text-error">Username is required</div>
      }

      <input class="input p-1 border-2 rounded-4xl border-secondary w-full" placeholder="Email" formControlName="email" />
      @if (form.get('email')?.touched && form.get('email')?.invalid) {
        <div class="text-xs text-error">Valid email is required</div>
      }

      <input class="input p-1 border-2 rounded-4xl border-secondary w-full" type="password" placeholder="Password" formControlName="password" />
      <div class="text-xs text-text">At least 6 characters</div>

      <input class="input p-1 border-2 rounded-4xl border-secondary w-full" type="password" placeholder="Confirm password" formControlName="confirmPassword" />
      @if (form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched) {
        <div class="text-xs text-error">Passwords do not match</div>
      }

      <button type="submit" class="btn-primary p-1 bg-primary rounded-4xl w-full" [disabled]="form.invalid || loading">
        {{ loading ? 'Creating...' : 'Create account' }}
      </button>

      <p class="text-sm">
        Already have an account? <a routerLink="/auth/login" class="underline">Sign in</a>
      </p>

      @if (error) {
        <div class="text-sm text-error">{{ error }}</div>
      }
    </form>
  `,
  styles: [`
    @reference "tailwindcss";
    .input { @apply w-full border rounded px-3 py-2; }
    .btn-primary { @apply bg-black text-white rounded px-4 py-2; }
    .text-error { @apply text-red-600; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: passwordMatchValidator() });

  async onSubmit() {
    this.error = '';
    if (this.form.invalid) return;
    this.loading = true;

    const { username, email, password } = this.form.value;
    const ok = this.auth.register(username!, email!, password!);

    this.loading = false;

    if (!ok) {
      this.error = 'Username already exists';
      return;
    }
    this.router.navigateByUrl('/');
  }
}
