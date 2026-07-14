import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService, ClientResponse } from '../../core/services/client.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="client-list-wrapper animate-fade-in-up">
      <!-- Section Header -->
      <div class="page-header-row">
        <div>
          <h2 class="section-title">Client Directory</h2>
          <p class="section-subtitle">Manage client profiles, KYC status, and search operations.</p>
        </div>
        <a routerLink="/clients/new" class="btn btn-primary" id="btn-add-client-new">
          ➕ Register New Client
        </a>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="toolbar-row glass-card">
        <div class="search-box-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            [formControl]="searchControl" 
            placeholder="Search by first name..." 
            class="form-control search-input" 
            id="client-search-field"
          />
        </div>
        
        <div class="filter-controls">
          <div class="select-wrapper">
            <label for="sort-select" class="sr-only">Sort By</label>
            <select (change)="onSortChange($event)" id="sort-select" class="form-control select-input">
              <option value="firstName">Sort: First Name</option>
              <option value="lastName">Sort: Last Name</option>
              <option value="monthlyIncome">Sort: Income</option>
              <option value="clientNumber">Sort: Client Ref</option>
            </select>
          </div>

          <div class="select-wrapper">
            <label for="size-select" class="sr-only">Show</label>
            <select (change)="onSizeChange($event)" id="size-select" class="form-control select-input size-select">
              <option value="5">Show: 5</option>
              <option value="10" selected>Show: 10</option>
              <option value="20">Show: 20</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Data Table -->
      @if (isLoading()) {
        <div class="grid-loading">
          <span class="loading-spinner"></span>
          <p>Synchronizing client ledger...</p>
        </div>
      } @else {
        <div class="table-card glass-card">
          <div class="table-container">
            <table class="custom-table" id="clients-data-table">
              <thead>
                <tr>
                  <th>Client Ref</th>
                  <th>Full Name</th>
                  <th>Mobile Number</th>
                  <th>Email</th>
                  <th>Monthly Income</th>
                  <th>KYC Status</th>
                  <th class="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (client of clients(); track client.clientNumber) {
                  <tr>
                    <td class="client-number-cell">{{ client.clientNumber }}</td>
                    <td><strong>{{ client.firstName }} {{ client.lastName || '' }}</strong></td>
                    <td>{{ client.mobileNumber }}</td>
                    <td>{{ client.email || '-' }}</td>
                    <td>{{ client.monthlyIncome | currency:'USD':'symbol':'1.0-2' }}</td>
                    <td>
                      <span class="badge" [class]="getKycBadgeClass(client.kycStatus)">
                        {{ client.kycStatus }}
                      </span>
                    </td>
                    <td class="actions-cell">
                      <div class="actions-group">
                        <a [routerLink]="['/clients/edit', client.clientNumber]" class="action-link edit" title="Edit Profile">
                          ✏️ Edit
                        </a>
                        <button (click)="onDelete(client.clientNumber)" class="action-link delete" title="Delete Profile">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7" class="empty-table-state">
                      <div class="empty-state-content">
                        <span>📭</span>
                        <p>No clients matching the search query found.</p>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Panel -->
          @if (totalPages() > 0) {
            <div class="pagination-wrapper">
              <div class="pagination-info">
                Showing Page <strong>{{ currentPage() + 1 }}</strong> of <strong>{{ totalPages() }}</strong> ({{ totalElements() }} entries)
              </div>
              
              <div class="pagination-controls">
                <button 
                  class="pagination-btn" 
                  [disabled]="currentPage() === 0" 
                  (click)="goToPage(currentPage() - 1)"
                  title="Previous Page"
                >
                  ◀
                </button>
                
                @for (page of pageRange(); track page) {
                  <button 
                    class="pagination-btn" 
                    [class.active]="currentPage() === page"
                    (click)="goToPage(page)"
                  >
                    {{ page + 1 }}
                  </button>
                }

                <button 
                  class="pagination-btn" 
                  [disabled]="currentPage() >= totalPages() - 1" 
                  (click)="goToPage(currentPage() + 1)"
                  title="Next Page"
                >
                  ▶
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .client-list-wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 1.6rem;
      font-weight: 700;
    }

    .section-subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    /* Toolbar styling */
    .toolbar-row {
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .search-box-wrapper {
      position: relative;
      flex: 1;
      max-width: 400px;
      min-width: 250px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1rem;
      color: var(--text-muted);
      pointer-events: none;
    }

    .search-input {
      padding-left: 40px !important;
    }

    .filter-controls {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .select-input {
      background: rgba(15, 23, 42, 0.6);
      font-family: var(--font-heading);
      font-weight: 500;
      font-size: 0.85rem;
      padding: 10px 16px;
      cursor: pointer;
      min-width: 140px;
    }

    .size-select {
      min-width: 100px;
    }

    .select-wrapper {
      position: relative;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Grid Loading */
    .grid-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
      color: var(--text-secondary);
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--glass-border);
      border-radius: 50%;
      border-top-color: var(--color-primary);
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .table-card {
      border-radius: var(--border-radius-md);
      overflow: hidden;
    }

    .client-number-cell {
      font-family: monospace;
      color: var(--color-primary);
      font-weight: 600;
    }

    .actions-header, .actions-cell {
      text-align: right !important;
    }

    .actions-group {
      display: inline-flex;
      gap: 12px;
    }

    .action-link {
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid var(--glass-border);
      padding: 6px 12px;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-link.edit {
      color: var(--color-primary);
    }

    .action-link.edit:hover {
      background: rgba(59, 130, 246, 0.15);
      border-color: var(--color-primary);
    }

    .action-link.delete {
      color: var(--color-danger);
    }

    .action-link.delete:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: var(--color-danger);
    }

    .empty-table-state {
      padding: 60px !important;
      text-align: center;
      background: rgba(19, 26, 48, 0.2) !important;
    }

    .empty-state-content span {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 12px;
    }

    .empty-state-content p {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
  `]
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  
  // State variables using signals
  clients = signal<ClientResponse[]>([]);
  currentPage = signal(0);
  pageSize = signal(10);
  sortBy = signal('firstName');
  totalPages = signal(0);
  totalElements = signal(0);
  isLoading = signal(false);

  // Search input control
  searchControl = new FormControl('');

  ngOnInit() {
    this.loadClients();

    // Hook search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value && value.trim().length > 0) {
        this.searchClients(value.trim());
      } else {
        this.loadClients();
      }
    });
  }

  loadClients() {
    this.isLoading.set(true);
    this.clientService.getClients(this.currentPage(), this.pageSize(), this.sortBy()).subscribe({
      next: (response) => {
        this.clients.set(response.content || []);
        this.totalPages.set(response.totalPages || 0);
        this.totalElements.set(response.totalElements || 0);
        this.isLoading.set(false);
      },
      error: () => {
        // Fallback demo data if backend connection fails
        this.loadDemoClients();
        this.isLoading.set(false);
      }
    });
  }

  searchClients(name: string) {
    this.isLoading.set(true);
    this.clientService.searchByName(name).subscribe({
      next: (data) => {
        this.clients.set(data || []);
        this.totalPages.set(1);
        this.totalElements.set(data.length);
        this.isLoading.set(false);
      },
      error: () => {
        // Demo search filtering
        const filtered = this.getDemoClients().filter(c => 
          c.firstName.toLowerCase().includes(name.toLowerCase())
        );
        this.clients.set(filtered);
        this.totalElements.set(filtered.length);
        this.totalPages.set(1);
        this.isLoading.set(false);
      }
    });
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy.set(value);
    this.currentPage.set(0); // reset page
    this.loadClients();
  }

  onSizeChange(event: Event) {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSize.set(value);
    this.currentPage.set(0); // reset page
    this.loadClients();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadClients();
    }
  }

  onDelete(clientNumber: string) {
    if (confirm(`Are you sure you want to delete Client ${clientNumber}?`)) {
      this.clientService.deleteClient(clientNumber).subscribe({
        next: () => {
          this.loadClients();
        },
        error: () => {
          // Delete from demo state if offline
          this.clients.update(list => list.filter(c => c.clientNumber !== clientNumber));
          this.totalElements.update(n => n - 1);
        }
      });
    }
  }

  getKycBadgeClass(status: string): string {
    switch (status) {
      case 'VERIFIED': return 'badge-verified';
      case 'PENDING': return 'badge-pending';
      case 'REJECTED': return 'badge-rejected';
      default: return '';
    }
  }

  // Generate pagination page numbers
  pageRange = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i);
  });

  // Demo Fallback Data for offline developer testing
  private getDemoClients(): ClientResponse[] {
    return [
      { clientNumber: 'CLI-098014', firstName: 'Shankar', lastName: 'Kumar', mobileNumber: '+919163012345', email: 'shankar@apex.com', monthlyIncome: 6500, kycStatus: 'VERIFIED' },
      { clientNumber: 'CLI-241512', firstName: 'Priya', lastName: 'Sharma', mobileNumber: '+919876543210', email: 'priya.sharma@yahoo.com', monthlyIncome: 4200, kycStatus: 'PENDING' },
      { clientNumber: 'CLI-871409', firstName: 'Rajesh', lastName: 'Patel', mobileNumber: '+919213456789', email: 'rajesh@patelops.org', monthlyIncome: 9800, kycStatus: 'VERIFIED' },
      { clientNumber: 'CLI-104928', firstName: 'Anjali', lastName: 'Gupta', mobileNumber: '+918123456780', email: 'anjali@guptaclan.com', monthlyIncome: 2500, kycStatus: 'REJECTED' },
      { clientNumber: 'CLI-650291', firstName: 'Vikram', lastName: 'Singh', mobileNumber: '+917012345678', email: 'v.singh@gmail.com', monthlyIncome: 5100, kycStatus: 'VERIFIED' }
    ];
  }

  private loadDemoClients() {
    const list = this.getDemoClients();
    this.clients.set(list);
    this.totalPages.set(1);
    this.totalElements.set(list.length);
  }
}
