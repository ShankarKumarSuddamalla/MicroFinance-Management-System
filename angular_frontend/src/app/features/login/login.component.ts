import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-wrapper glass-card animate-fade-in-up">
        <div class="logo-area">
          <div class="logo-circle-large">M</div>
          <h1 class="gradient-text">Apex Finance</h1>
          <p>Enterprise Console Log In</p>
        </div>

        @if (errorMessage()) {
          <div class="alert-box error" id="login-error-msg">
            <span class="alert-icon">⚠️</span>
            <span class="alert-text">{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control" 
              placeholder="Enter your system username"
              [class.error-input]="isFieldInvalid('username')"
            />
            @if (isFieldInvalid('username')) {
              <span class="validation-message">Username is required</span>
            }
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="••••••••"
              [class.error-input]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <span class="validation-message">Password is required</span>
            }
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-full" 
            [disabled]="loginForm.invalid || isLoading()" 
            id="btn-login-submit"
          >
            @if (isLoading()) {
              <span class="spinner"></span> Logging In...
            } @else {
              Access Console
            }
          </button>
        </form>

        <div class="login-footer">
          <p>Don't have an administrator account? <a routerLink="/register" id="link-register">Register here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 85vh;
      background: radial-gradient(circle at top right, rgba(139, 92, 246, 0.08), transparent 40%),
                  radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.08), transparent 40%);
    }

    .login-wrapper {
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

    .login-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .login-footer a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }

    /* Spinner style */
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401 || err.status === 403) {
          this.errorMessage.set('Invalid username or password. Please try again.');
        } else {
          this.errorMessage.set('Could not connect to the gateway server. Please verify your backend services.');
        }
      }
    });
  }
}
