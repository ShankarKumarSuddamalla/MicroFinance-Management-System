import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout" [class.authenticated]="authService.isAuthenticated()">
      <!-- Sidebar Navigation: Rendered only when logged in -->
      @if (authService.isAuthenticated()) {
        <aside class="sidebar-nav" [class.collapsed]="sidebarCollapsed()">
          <div class="sidebar-header">
            <div class="logo-circle">
              <span>M</span>
            </div>
            <div class="brand-title">
              <h2>APEX</h2>
              <p>MicroFinance</p>
            </div>
          </div>
          
          <nav class="sidebar-menu">
            <a routerLink="/dashboard" routerLinkActive="active" class="menu-item" id="nav-dashboard">
              <span class="menu-icon">📊</span>
              <span class="menu-text">Dashboard</span>
            </a>
            <a routerLink="/clients" routerLinkActive="active" class="menu-item" id="nav-clients">
              <span class="menu-icon">👥</span>
              <span class="menu-text">Clients</span>
            </a>
            <a routerLink="/chat" routerLinkActive="active" class="menu-item" id="nav-chat">
              <span class="menu-icon">💬</span>
              <span class="menu-text">Support Chat</span>
            </a>
          </nav>
          
          <div class="sidebar-footer">
            <div class="user-profile-summary">
              <div class="avatar">
                {{ authService.currentUser()?.username?.substring(0, 2)?.toUpperCase() || 'U' }}
              </div>
              <div class="user-info">
                <h4>{{ authService.currentUser()?.username || 'User' }}</h4>
                <p>{{ authService.currentUser()?.email || 'user@apex.com' }}</p>
              </div>
            </div>
            <button class="logout-btn" (click)="logout()" id="btn-logout" title="Log Out">
              <span class="logout-icon">🚪</span>
              <span class="menu-text">Log Out</span>
            </button>
          </div>
        </aside>
      }

      <!-- Main Workspace Section -->
      <main class="main-content">
        @if (authService.isAuthenticated()) {
          <header class="main-header">
            <button class="toggle-sidebar" (click)="toggleSidebar()">
              ☰
            </button>
            <div class="header-title">
              <h1 class="gradient-text">Console</h1>
            </div>
            <div class="header-actions">
              <span class="status-indicator"></span>
              <span class="connection-status">Live Connected</span>
            </div>
          </header>
        }
        
        <div class="page-container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: var(--bg-primary);
    }
    
    .sidebar-nav {
      width: var(--sidebar-width);
      background: var(--bg-secondary);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      transition: all 0.3s ease;
      z-index: 100;
    }
    
    .sidebar-header {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid var(--glass-border);
    }
    
    .logo-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-weight: 800;
      color: #fff;
      font-size: 1.2rem;
      box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
    }
    
    .brand-title h2 {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--text-primary);
    }
    
    .brand-title p {
      font-size: 0.75rem;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }
    
    .sidebar-menu {
      flex: 1;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .menu-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      border-radius: var(--border-radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      font-family: var(--font-heading);
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .menu-item:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
      transform: translateX(4px);
    }
    
    .menu-item.active {
      background: rgba(59, 130, 246, 0.1);
      border-left: 3px solid var(--color-primary);
      color: var(--color-primary);
      font-weight: 600;
    }
    
    .sidebar-footer {
      padding: 24px 16px;
      border-top: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .user-profile-summary {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-weight: 600;
      color: var(--color-secondary);
      border: 1px solid var(--glass-border);
    }
    
    .user-info h4 {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .user-info p {
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      width: 100%;
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--border-radius-sm);
      color: var(--color-danger);
      font-family: var(--font-heading);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.4);
      transform: translateY(-1px);
    }
    
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    
    .main-header {
      height: var(--header-height);
      border-bottom: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      background: rgba(10, 14, 26, 0.6);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    
    .toggle-sidebar {
      display: none;
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-size: 1.5rem;
      cursor: pointer;
    }
    
    .header-title h1 {
      font-size: 1.4rem;
      font-weight: 800;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-success);
      box-shadow: 0 0 10px var(--color-success);
    }
    
    .connection-status {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .page-container {
      padding: 32px;
      flex: 1;
      overflow-y: auto;
    }
    
    @media (max-width: 768px) {
      .toggle-sidebar {
        display: block;
      }
      .sidebar-nav {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
      }
      .sidebar-nav.collapsed {
        transform: translateX(0);
      }
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.update(val => !val);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
