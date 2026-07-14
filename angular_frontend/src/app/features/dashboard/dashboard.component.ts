import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../core/services/client.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-wrapper animate-fade-in-up">
      <!-- Welcome Header -->
      <section class="welcome-banner glass-card">
        <div class="banner-content">
          <h2>Welcome back, <span class="gradient-text">Operator</span></h2>
          <p>Here is your MicroFinance console activity overview for today. System services are active.</p>
        </div>
        <div class="quick-stats-row">
          <div class="mini-stat">
            <span class="label">System Load</span>
            <span class="value">14%</span>
          </div>
          <div class="mini-stat">
            <span class="label">API Gateway</span>
            <span class="value success">Healthy</span>
          </div>
        </div>
      </section>

      <!-- KPI Summary Cards -->
      <section class="kpi-grid">
        <div class="kpi-card glass-card pulse-card">
          <div class="card-icon blue">👥</div>
          <div class="card-metrics">
            <h3>Active Clients</h3>
            <span class="number">1,248</span>
            <span class="change positive">↑ 12% this month</span>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="card-icon purple">💰</div>
          <div class="card-metrics">
            <h3>Total Disbursements</h3>
            <span class="number">$1.84M</span>
            <span class="change positive">↑ 8.4% growth</span>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="card-icon green">⚡</div>
          <div class="card-metrics">
            <h3>Verification Rate</h3>
            <span class="number">94.2%</span>
            <span class="change neutral">Stable</span>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="card-icon red">⏳</div>
          <div class="card-metrics">
            <h3>Pending KYC</h3>
            <span class="number">14</span>
            <span class="change negative">↓ 3 critical cases</span>
          </div>
        </div>
      </section>

      <!-- Interactive SVG Charts Section -->
      <section class="charts-row">
        <!-- Monthly Loan Disbursements (Line Chart) -->
        <div class="chart-container glass-card">
          <div class="chart-header">
            <h3>Disbursement Trends (Monthly, k$)</h3>
            <div class="chart-actions">
              <span class="chart-legend"><span class="legend-dot line-dot"></span> Disbursements</span>
            </div>
          </div>
          <div class="chart-view">
            <svg class="svg-chart" viewBox="0 0 500 220" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line x1="50" y1="20" x2="480" y2="20" class="chart-grid-line"></line>
              <line x1="50" y1="70" x2="480" y2="70" class="chart-grid-line"></line>
              <line x1="50" y1="120" x2="480" y2="120" class="chart-grid-line"></line>
              <line x1="50" y1="170" x2="480" y2="170" class="chart-grid-line"></line>
              
              <!-- Gradients for fill under line -->
              <defs>
                <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3"></stop>
                  <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.0"></stop>
                </linearGradient>
              </defs>

              <!-- Filled Area Under Line -->
              <path d="M 50 170 L 50 140 L 120 110 L 190 150 L 260 80 L 330 60 L 400 95 L 480 30 L 480 170 Z" fill="url(#line-grad)"></path>

              <!-- Line Chart Path -->
              <path d="M 50 140 L 120 110 L 190 150 L 260 80 L 330 60 L 400 95 L 480 30" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round"></path>

              <!-- Data Point Circles -->
              <circle cx="50" cy="140" r="5" class="chart-dot" (mouseenter)="showTooltip($event, 'Jan: $120k')" (mouseleave)="hideTooltip()"></circle>
              <circle cx="120" cy="110" r="5" class="chart-dot" (mouseenter)="showTooltip($event, 'Feb: $150k')" (mouseleave)="hideTooltip()"></circle>
              <circle cx="190" cy="150" r="5" class="chart-dot" (mouseenter)="showTooltip($event, 'Mar: $110k')" (mouseleave)="hideTooltip()"></circle>
              <circle cx="260" cy="80" r="5" class="chart-dot" (mouseenter)="showTooltip($event, 'Apr: $180k')" (mouseleave)="hideTooltip()"></circle>
              <circle cx="330" cy="60" r="5" class="chart-dot" (mouseenter)="showTooltip($event, 'May: $200k')" (mouseleave)="hideTooltip()"></circle>
              <circle cx="400" cy="95" r="5" class="chart-dot" (mouseenter)="showTooltip($event, 'Jun: $165k')" (mouseleave)="hideTooltip()"></circle>
              <circle cx="480" cy="30" r="5" class="chart-dot" (mouseenter)="showTooltip($event, 'Jul: $230k')" (mouseleave)="hideTooltip()"></circle>

              <!-- Axes Text labels -->
              <!-- Y Axis labels -->
              <text x="15" y="25" class="chart-label">250k</text>
              <text x="15" y="75" class="chart-label">180k</text>
              <text x="15" y="125" class="chart-label">100k</text>
              <text x="25" y="175" class="chart-label">0k</text>

              <!-- X Axis labels -->
              <text x="50" y="200" class="chart-label text-center">Jan</text>
              <text x="120" y="200" class="chart-label text-center">Feb</text>
              <text x="190" y="200" class="chart-label text-center">Mar</text>
              <text x="260" y="200" class="chart-label text-center">Apr</text>
              <text x="330" y="200" class="chart-label text-center">May</text>
              <text x="400" y="200" class="chart-label text-center">Jun</text>
              <text x="480" y="200" class="chart-label text-center">Jul</text>
            </svg>
          </div>
        </div>

        <!-- KYC Verification Distribution (Bar Chart) -->
        <div class="chart-container glass-card">
          <div class="chart-header">
            <h3>KYC Status Metric (Total Clients)</h3>
            <div class="chart-actions">
              <span class="chart-legend"><span class="legend-dot bar-dot"></span> Accounts count</span>
            </div>
          </div>
          <div class="chart-view">
            <svg class="svg-chart" viewBox="0 0 500 220" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line x1="50" y1="20" x2="480" y2="20" class="chart-grid-line"></line>
              <line x1="50" y1="70" x2="480" y2="70" class="chart-grid-line"></line>
              <line x1="50" y1="120" x2="480" y2="120" class="chart-grid-line"></line>
              <line x1="50" y1="170" x2="480" y2="170" class="chart-grid-line"></line>

              <!-- Bars (Verified, Pending, Rejected) -->
              <!-- Bar 1: Verified (850) -->
              <rect x="90" y="40" width="50" height="130" rx="4" fill="url(#bar-grad-verified)" class="chart-bar" (mouseenter)="showTooltip($event, 'Verified: 850 clients')" (mouseleave)="hideTooltip()"></rect>
              
              <!-- Bar 2: Pending (140) -->
              <rect x="220" y="145" width="50" height="25" rx="4" fill="url(#bar-grad-pending)" class="chart-bar" (mouseenter)="showTooltip($event, 'Pending: 140 clients')" (mouseleave)="hideTooltip()"></rect>

              <!-- Bar 3: Rejected (40) -->
              <rect x="350" y="162" width="50" height="8" rx="4" fill="url(#bar-grad-rejected)" class="chart-bar" (mouseenter)="showTooltip($event, 'Rejected: 40 clients')" (mouseleave)="hideTooltip()"></rect>

              <defs>
                <linearGradient id="bar-grad-verified" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--color-success)"></stop>
                  <stop offset="100%" stop-color="#059669"></stop>
                </linearGradient>
                <linearGradient id="bar-grad-pending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--color-warning)"></stop>
                  <stop offset="100%" stop-color="#d97706"></stop>
                </linearGradient>
                <linearGradient id="bar-grad-rejected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--color-danger)"></stop>
                  <stop offset="100%" stop-color="#dc2626"></stop>
                </linearGradient>
              </defs>

              <!-- Labels -->
              <!-- Y Axis labels -->
              <text x="15" y="25" class="chart-label">1,000</text>
              <text x="20" y="75" class="chart-label">500</text>
              <text x="20" y="125" class="chart-label">250</text>
              <text x="25" y="175" class="chart-label">0</text>

              <!-- X Axis Labels -->
              <text x="92" y="200" class="chart-label">Verified</text>
              <text x="222" y="200" class="chart-label">Pending</text>
              <text x="352" y="200" class="chart-label">Rejected</text>
            </svg>
          </div>
        </div>
      </section>

      <!-- Active Tooltip overlay -->
      @if (tooltipVisible()) {
        <div class="chart-tooltip" [style.left.px]="tooltipX()" [style.top.px]="tooltipY()">
          {{ tooltipText() }}
        </div>
      }

      <!-- Bottom Panel: Quick Actions and Recent Logs -->
      <section class="dashboard-footer-grid">
        <!-- Quick actions -->
        <div class="actions-card glass-card">
          <h3>Quick Control Actions</h3>
          <p class="section-desc">Common operations for system administration.</p>
          <div class="actions-buttons">
            <a routerLink="/clients/new" class="action-btn-link" id="action-add-client">
              <span class="btn-icon">➕</span>
              <span class="btn-lbl">Add Client Directory</span>
            </a>
            <a routerLink="/clients" class="action-btn-link" id="action-list-clients">
              <span class="btn-icon">📋</span>
              <span class="btn-lbl">Manage Clients</span>
            </a>
            <a routerLink="/chat" class="action-btn-link" id="action-chat-support">
              <span class="btn-icon">💬</span>
              <span class="btn-lbl">Operator Live Chat</span>
            </a>
          </div>
        </div>

        <!-- System activity logs -->
        <div class="logs-card glass-card">
          <h3>Recent Operations Ledger</h3>
          <div class="log-entries">
            <div class="log-row">
              <span class="log-time">10:42 AM</span>
              <div class="log-desc">
                <strong>KYC Auto-verify</strong> approved Client <span class="client-num">CLI-980142</span> (S. Kumar)
              </div>
            </div>
            <div class="log-row">
              <span class="log-time">09:15 AM</span>
              <div class="log-desc">
                <strong>Client Updated</strong> by Operator (Client: <span class="client-num">CLI-241512</span>)
              </div>
            </div>
            <div class="log-row">
              <span class="log-time">08:00 AM</span>
              <div class="log-desc">
                <strong>Session Opened</strong>. Token synchronized with Discovery Server
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .welcome-banner {
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .banner-content h2 {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .banner-content p {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .quick-stats-row {
      display: flex;
      gap: 24px;
    }

    .mini-stat {
      display: flex;
      flex-direction: column;
      background: rgba(15, 23, 42, 0.4);
      padding: 10px 18px;
      border-radius: var(--border-radius-sm);
      border: 1px solid var(--glass-border);
      min-width: 120px;
    }

    .mini-stat .label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .mini-stat .value {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 700;
    }

    .mini-stat .value.success {
      color: var(--color-success);
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
    }

    .kpi-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .card-icon {
      font-size: 2.2rem;
      width: 54px;
      height: 54px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
    }

    .card-icon.blue {
      color: var(--color-primary);
      box-shadow: inset 0 0 10px rgba(59, 130, 246, 0.15);
    }

    .card-icon.purple {
      color: var(--color-secondary);
      box-shadow: inset 0 0 10px rgba(139, 92, 246, 0.15);
    }

    .card-icon.green {
      color: var(--color-success);
      box-shadow: inset 0 0 10px rgba(16, 185, 129, 0.15);
    }

    .card-icon.red {
      color: var(--color-danger);
      box-shadow: inset 0 0 10px rgba(239, 68, 68, 0.15);
    }

    .card-metrics h3 {
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .card-metrics .number {
      display: block;
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.1;
      margin-bottom: 4px;
    }

    .card-metrics .change {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .card-metrics .change.positive {
      color: var(--color-success);
    }

    .card-metrics .change.neutral {
      color: var(--text-muted);
    }

    .card-metrics .change.negative {
      color: var(--color-danger);
    }

    /* Charts Section */
    .charts-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
      gap: 24px;
    }

    .chart-container {
      padding: 24px;
      height: 320px;
      display: flex;
      flex-direction: column;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .chart-header h3 {
      font-family: var(--font-heading);
      font-size: 1rem;
      font-weight: 600;
    }

    .chart-legend {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .line-dot {
      background: var(--color-primary);
    }

    .bar-dot {
      background: var(--color-success);
    }

    .chart-view {
      flex: 1;
      position: relative;
    }

    .svg-chart {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .chart-grid-line {
      stroke: var(--glass-border);
      stroke-width: 1;
      stroke-dasharray: 4,4;
    }

    .chart-dot {
      fill: var(--bg-secondary);
      stroke: var(--color-primary);
      stroke-width: 2;
      cursor: pointer;
      transition: r 0.2s ease, fill 0.2s ease;
    }

    .chart-dot:hover {
      r: 7px;
      fill: var(--color-primary);
    }

    .chart-bar {
      cursor: pointer;
      transition: filter 0.2s ease;
    }

    .chart-bar:hover {
      filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
    }

    .chart-label {
      fill: var(--text-muted);
      font-size: 11px;
      font-weight: 500;
    }

    .text-center {
      text-anchor: middle;
    }

    /* Tooltip */
    .chart-tooltip {
      position: fixed;
      z-index: 1000;
      background: var(--bg-secondary);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 8px 12px;
      border-radius: var(--border-radius-sm);
      font-size: 0.8rem;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      transform: translate(-50%, -100%);
      margin-top: -10px;
      color: #fff;
    }

    /* Bottom Grid */
    .dashboard-footer-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 24px;
    }

    @media (max-width: 992px) {
      .dashboard-footer-grid {
        grid-template-columns: 1fr;
      }
    }

    .actions-card, .logs-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .actions-card h3, .logs-card h3 {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 600;
    }

    .section-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: -12px;
    }

    .actions-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .action-btn-link {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius-sm);
      color: var(--text-primary);
      text-decoration: none;
      font-family: var(--font-heading);
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .action-btn-link:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-primary);
      transform: translateX(4px);
    }

    .btn-icon {
      font-size: 1.2rem;
    }

    .log-entries {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .log-row {
      display: flex;
      gap: 16px;
      padding: 10px 0;
      border-bottom: 1px solid var(--glass-border);
      font-size: 0.85rem;
    }

    .log-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .log-time {
      color: var(--text-muted);
      font-weight: 500;
      white-space: nowrap;
    }

    .log-desc {
      color: var(--text-secondary);
    }

    .client-num {
      color: var(--color-primary);
      font-family: monospace;
      font-weight: 600;
    }
  `]
})
export class DashboardComponent {
  tooltipVisible = signal(false);
  tooltipText = signal('');
  tooltipX = signal(0);
  tooltipY = signal(0);

  showTooltip(event: MouseEvent, text: string) {
    this.tooltipText.set(text);
    this.tooltipX.set(event.clientX);
    this.tooltipY.set(event.clientY);
    this.tooltipVisible.set(true);
  }

  hideTooltip() {
    this.tooltipVisible.set(false);
  }
}
