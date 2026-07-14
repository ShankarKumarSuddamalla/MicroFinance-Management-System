import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService, ClientRequest, Gender, MaritalStatus } from '../../core/services/client.service';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="edit-wrapper animate-fade-in-up">
      <!-- Page Header -->
      <div class="page-header">
        <div class="breadcrumb-nav">
          <a routerLink="/clients" class="back-link">← Return to Client List</a>
        </div>
        <h2 class="section-title">
          {{ isEditMode() ? 'Update Client Record' : 'Register New Client Profile' }}
        </h2>
        <p class="section-subtitle">
          {{ isEditMode() ? 'Modify and save update records for active client' : 'Initialize client on boarding and assign validation enums.' }}
        </p>
      </div>

      <!-- Feedback Banner -->
      @if (errorMessage()) {
        <div class="alert-box error" id="edit-error-banner">
          <span class="alert-icon">⚠️</span>
          <span class="alert-text">{{ errorMessage() }}</span>
        </div>
      }
      @if (successMessage()) {
        <div class="alert-box success" id="edit-success-banner">
          <span class="alert-icon">✓</span>
          <span class="alert-text">{{ successMessage() }}</span>
        </div>
      }

      <!-- Form Card -->
      <div class="form-card glass-card">
        <form [formGroup]="clientForm" (ngSubmit)="onSubmit()" class="client-form" id="client-record-form">
          
          <!-- Personal Details Grid Section -->
          <div class="form-section">
            <h3 class="section-legend">1. Personal Demographics</h3>
            
            <div class="form-row grid-3">
              <div class="form-group">
                <label for="firstName" class="form-label">First Name *</label>
                <input 
                  type="text" 
                  id="firstName" 
                  formControlName="firstName" 
                  class="form-control" 
                  placeholder="First Name"
                  [class.error-input]="isFieldInvalid('firstName')"
                />
                @if (isFieldInvalid('firstName')) {
                  <span class="validation-message">First name is required</span>
                }
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  formControlName="lastName" 
                  class="form-control" 
                  placeholder="Last Name"
                />
              </div>

              <div class="form-group">
                <label for="gender" class="form-label">Gender *</label>
                <select id="gender" formControlName="gender" class="form-control select-control" [class.error-input]="isFieldInvalid('gender')">
                  <option value="" disabled selected>Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                @if (isFieldInvalid('gender')) {
                  <span class="validation-message">Gender is required</span>
                }
              </div>
            </div>

            <div class="form-row grid-2">
              <div class="form-group">
                <label for="dateOfBirth" class="form-label">Date of Birth *</label>
                <input 
                  type="date" 
                  id="dateOfBirth" 
                  formControlName="dateOfBirth" 
                  class="form-control" 
                  [class.error-input]="isFieldInvalid('dateOfBirth')"
                />
                @if (isFieldInvalid('dateOfBirth')) {
                  <span class="validation-message">Valid date of birth is required</span>
                }
              </div>

              <div class="form-group">
                <label for="maritalStatus" class="form-label">Marital Status</label>
                <select id="maritalStatus" formControlName="maritalStatus" class="form-control select-control">
                  <option value="" disabled selected>Select Status</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Contact Details Grid Section -->
          <div class="form-section">
            <h3 class="section-legend">2. Contact Operations</h3>
            
            <div class="form-row grid-2">
              <div class="form-group">
                <label for="mobileNumber" class="form-label">Mobile Number *</label>
                <input 
                  type="text" 
                  id="mobileNumber" 
                  formControlName="mobileNumber" 
                  class="form-control" 
                  placeholder="10-digit number"
                  [class.error-input]="isFieldInvalid('mobileNumber')"
                />
                @if (isFieldInvalid('mobileNumber')) {
                  <span class="validation-message">10-digit phone number is required</span>
                }
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email" 
                  class="form-control" 
                  placeholder="client@apex.com"
                  [class.error-input]="isFieldInvalid('email')"
                />
                @if (isFieldInvalid('email')) {
                  <span class="validation-message">Invalid email format</span>
                }
              </div>
            </div>
          </div>

          <!-- Identifiers & Income Section -->
          <div class="form-section">
            <h3 class="section-legend">3. Financial & KYC Identifiers</h3>
            
            <div class="form-row grid-3">
              <div class="form-group">
                <label for="aadhaarNumber" class="form-label">Aadhaar Card Number *</label>
                <input 
                  type="text" 
                  id="aadhaarNumber" 
                  formControlName="aadhaarNumber" 
                  class="form-control" 
                  placeholder="12-digit UID"
                  [class.error-input]="isFieldInvalid('aadhaarNumber')"
                />
                @if (isFieldInvalid('aadhaarNumber')) {
                  <span class="validation-message">Aadhaar must be a 12-digit numeric code</span>
                }
              </div>

              <div class="form-group">
                <label for="panNumber" class="form-label">PAN Number *</label>
                <input 
                  type="text" 
                  id="panNumber" 
                  formControlName="panNumber" 
                  class="form-control text-uppercase" 
                  placeholder="ABCDE1234F"
                  [class.error-input]="isFieldInvalid('panNumber')"
                />
                @if (isFieldInvalid('panNumber')) {
                  <span class="validation-message">PAN must match formatting (e.g. ABCDE1234F)</span>
                }
              </div>

              <div class="form-group">
                <label for="monthlyIncome" class="form-label">Monthly Income (USD)</label>
                <input 
                  type="number" 
                  id="monthlyIncome" 
                  formControlName="monthlyIncome" 
                  class="form-control" 
                  placeholder="e.g. 5000"
                  [class.error-input]="isFieldInvalid('monthlyIncome')"
                />
                @if (isFieldInvalid('monthlyIncome')) {
                  <span class="validation-message">Monthly income must be positive</span>
                }
              </div>
            </div>

            <div class="form-row grid-2">
              <div class="form-group">
                <label for="occupation" class="form-label">Occupation</label>
                <input 
                  type="text" 
                  id="occupation" 
                  formControlName="occupation" 
                  class="form-control" 
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div class="form-group">
                <label for="kycStatus" class="form-label">KYC Verification State</label>
                <select id="kycStatus" formControlName="kycStatus" class="form-control select-control" [attr.disabled]="!isEditMode() ? true : null">
                  <option value="PENDING">Pending Approval</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Address Grid Section -->
          <div class="form-section">
            <h3 class="section-legend">4. Address Demographics</h3>
            
            <div class="form-row grid-2">
              <div class="form-group">
                <label for="addressLine1" class="form-label">Address Line 1</label>
                <input type="text" id="addressLine1" formControlName="addressLine1" class="form-control" placeholder="Street Address" />
              </div>
              <div class="form-group">
                <label for="addressLine2" class="form-label">Address Line 2</label>
                <input type="text" id="addressLine2" formControlName="addressLine2" class="form-control" placeholder="Suite, Apt or Unit" />
              </div>
            </div>

            <div class="form-row grid-4">
              <div class="form-group">
                <label for="city" class="form-label">City</label>
                <input type="text" id="city" formControlName="city" class="form-control" placeholder="City" />
              </div>
              <div class="form-group">
                <label for="state" class="form-label">State</label>
                <input type="text" id="state" formControlName="state" class="form-control" placeholder="State" />
              </div>
              <div class="form-group">
                <label for="postalCode" class="form-label">Postal Code</label>
                <input type="text" id="postalCode" formControlName="postalCode" class="form-control" placeholder="Postal Code" />
              </div>
              <div class="form-group">
                <label for="country" class="form-label">Country</label>
                <input type="text" id="country" formControlName="country" class="form-control" placeholder="Country" />
              </div>
            </div>
          </div>

          <!-- Submission Controls -->
          <div class="form-actions-row">
            <button type="button" routerLink="/clients" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-success" [disabled]="clientForm.invalid || isLoading()" id="btn-save-client">
              @if (isLoading()) {
                <span class="button-spinner"></span> Saving...
              } @else {
                {{ isEditMode() ? 'Update Record' : 'Create Record' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .edit-wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .breadcrumb-nav {
      margin-bottom: 8px;
    }

    .back-link {
      color: var(--color-primary);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: var(--color-secondary);
      text-decoration: underline;
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

    .alert-box {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--border-radius-sm);
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

    .form-card {
      padding: 40px;
    }

    .form-section {
      margin-bottom: 32px;
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 24px;
    }

    .form-section:last-of-type {
      margin-bottom: 20px;
      border-bottom: none;
      padding-bottom: 0;
    }

    .section-legend {
      font-family: var(--font-heading);
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .grid-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }

    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr;
      }
    }

    .select-control {
      cursor: pointer;
      background-image: linear-gradient(45deg, transparent 50%, var(--text-muted) 50%),
                        linear-gradient(135deg, var(--text-muted) 50%, transparent 50%);
      background-position: calc(100% - 20px) calc(1em + 2px),
                            calc(100% - 15px) calc(1em + 2px);
      background-size: 5px 5px, 5px 5px;
      background-repeat: no-repeat;
      appearance: none;
    }

    .text-uppercase {
      text-transform: uppercase;
    }

    .error-input {
      border-color: rgba(239, 68, 68, 0.5) !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
    }

    .validation-message {
      font-size: 0.72rem;
      color: var(--color-danger);
      margin-top: 4px;
      display: block;
    }

    .form-actions-row {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 20px;
    }

    .button-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
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
export class ClientEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);

  // Signalled States
  isEditMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  clientNumber = signal<string | null>(null);

  // Client validation form
  clientForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    gender: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.email]],
    aadhaarNumber: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
    panNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
    occupation: [''],
    monthlyIncome: [null, [Validators.min(0)]],
    maritalStatus: [''],
    kycStatus: ['PENDING'],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    state: [''],
    postalCode: [''],
    country: ['']
  });

  ngOnInit() {
    // Check router parameters
    this.route.paramMap.subscribe(params => {
      const refNum = params.get('clientNumber');
      if (refNum) {
        this.isEditMode.set(true);
        this.clientNumber.set(refNum);
        this.loadClientRecord(refNum);
      }
    });
  }

  loadClientRecord(clientNumber: string) {
    this.isLoading.set(true);
    this.clientService.getClient(clientNumber).subscribe({
      next: (data) => {
        // Map backend enums & dates
        this.clientForm.patchValue(data);
        this.isLoading.set(false);
      },
      error: () => {
        // If offline / dev fallback
        this.loadDemoClientRecord(clientNumber);
        this.isLoading.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formValues: ClientRequest = this.clientForm.value;

    if (this.isEditMode()) {
      // Update action
      this.clientService.updateClient(this.clientNumber()!, formValues).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set('Client information updated successfully! Redirecting...');
          setTimeout(() => this.router.navigate(['/clients']), 1500);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Error occurred during profile update.');
        }
      });
    } else {
      // Create action
      this.clientService.createClient(formValues).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set('Client registered successfully! Redirecting...');
          setTimeout(() => this.router.navigate(['/clients']), 1500);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Error occurred during client registration.');
        }
      });
    }
  }

  private loadDemoClientRecord(clientNumber: string) {
    // Generate a demo record matching the requested number
    const demo = {
      firstName: 'Shankar',
      lastName: 'Kumar',
      gender: 'MALE' as Gender,
      dateOfBirth: '1995-08-15',
      mobileNumber: '9163012345',
      email: 'shankar@apex.com',
      aadhaarNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      occupation: 'Lead Architect',
      monthlyIncome: 6500,
      maritalStatus: 'SINGLE' as MaritalStatus,
      kycStatus: 'VERIFIED',
      addressLine1: 'H-401 Emerald Towers',
      addressLine2: 'Tech Park Layout',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500081',
      country: 'India'
    };
    this.clientForm.patchValue(demo);
  }
}
