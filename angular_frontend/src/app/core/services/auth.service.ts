import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';

export interface UserProfile {
  username: string;
  email: string;
  roles?: string[];
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  // Base URL pointing to the Spring Cloud API Gateway (Port 8080)
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  
  // Angular signals for modern reactive state management
  private _currentUser = signal<UserProfile | null>(null);
  private _token = signal<string | null>(null);

  // Expose read-only signals to components
  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => !!this._token());

  constructor() {
    this.loadSession();
  }

  private loadSession(): void {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('currentUser');
    if (token) {
      this._token.set(token);
    }
    if (savedUser) {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  getToken(): string | null {
    return this._token();
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        const token = response.accessToken;
        localStorage.setItem('accessToken', token);
        this._token.set(token);
        
        // Fetch current user details after login
        this.fetchProfile().subscribe();
      }),
      catchError(err => {
        console.error('Login error:', err);
        return throwError(() => err);
      })
    );
  }

  register(userData: { username: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, userData).pipe(
      catchError(err => {
        console.error('Registration error:', err);
        return throwError(() => err);
      })
    );
  }

  fetchProfile(): Observable<UserProfile> {
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('Not authenticated'));
    }
    return this.http.get<UserProfile>(`${this.baseUrl}/me`).pipe(
      tap(profile => {
        localStorage.setItem('currentUser', JSON.stringify(profile));
        this._currentUser.set(profile);
      }),
      catchError(err => {
        console.error('Profile fetch error:', err);
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this._token.set(null);
    this._currentUser.set(null);
  }
}
