import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-page">
      <div class="register-wrapper glass-card animate-fade-in-up">
        <div class="logo-area">
          <div class="logo-circle-large">M</div>
          <h1 class="gradient-text">Register Admin</h1>
          <p>Create a MicroFinance Operator account</p>
        </div>

        @if (successMessage()) {
          <div class="alert-box success" id="register-success-msg">
            <span class="alert-icon">✓</span>
            <span class="alert-text">{{ successMessage() }}</span>
          </div>
        }

        @if (errorMessage()) {
          <div class="alert-box error" id="register-error-msg">
            <span class="alert-icon">⚠️</span>
            <span class="alert-text">{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control" 
              placeholder="Min 3 characters"
              [class.error-input]="isFieldInvalid('username')"
            />
            @if (isFieldInvalid('username')) {
              <span class="validation-message">Username must be between 3 and 100 characters</span>
            }
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control" 
              placeholder="operator@apex.com"
              [class.error-input]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <span class="validation-message">Please enter a valid email address</span>
            }
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="Max 20 characters"
              [class.error-input]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <span class="validation-message">Password is required (Max 20 characters)</span>
            }
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-full" 
            [disabled]="registerForm.invalid || isLoading()" 
            id="btn-register-submit"
          >
            @if (isLoading()) {
              <span class="spinner"></span> Creating Account...
            } @else {
              Create Operator Account
            }
          </button>
        </form>

        <div class="register-footer">
          <p>Already have an account? <a routerLink="/login" id="link-login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 85vh;
      background: radial-gradient(circle at top right, rgba(139, 92, 246, 0.08), transparent 40%),
                  radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.08), transparent 40%);
    }

    .register-wrapper {
      width: 100%;
      max-width: 440px;
      padding: 40px;
    }

    .logo-area {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-circle-large {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.8rem;
      font-family: var(--font-heading);
      font-weight: 800;
      margin-bottom: 16px;
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
    }

    .logo-area h1 {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .logo-area p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-top: 6px;
    }

    .alert-box {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--border-radius-sm);
      margin-bottom: 20px;
      font-size: 0.85rem;
      align-items: center;
    }

    .alert-box.error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.25);
      color: #fca5a5;
    }

    .alert-box.success {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #a7f3d0;
    }

    .w-full {
      width: 100%;
    }

    .error-input {
      border-color: rgba(239, 68, 68, 0.5) !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
    }

    .validation-message {
      font-size: 0.75rem;
      color: var(--color-danger);
      margin-top: 4px;
      display: block;
    }

    .register-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .register-footer a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .register-footer a:hover {
      text-decoration: underline;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.maxLength(20)]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Operator account registered successfully! Redirecting...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 409) {
          this.errorMessage.set('Username or Email already registered.');
        } else {
          this.errorMessage.set('An error occurred during registration. Please verify backend services.');
        }
      }
    });
  }
}
