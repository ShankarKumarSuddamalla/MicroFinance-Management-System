import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface ClientRequest {
  firstName: string;
  lastName?: string;
  gender: Gender;
  dateOfBirth: string; // YYYY-MM-DD
  mobileNumber: string;
  email?: string;
  aadhaarNumber: string;
  panNumber: string;
  occupation?: string;
  monthlyIncome?: number;
  maritalStatus?: MaritalStatus;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ClientResponse {
  clientNumber: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  monthlyIncome: number;
  kycStatus: KycStatus;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page index, 0-based
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  
  // Base URL pointing to the Spring Cloud API Gateway (Port 8080)
  private readonly baseUrl = 'http://localhost:8080/api/v1/clients';

  // Get paginated clients
  getClients(page: number = 0, size: number = 10, sortBy: string = 'firstName'): Observable<PageResponse<ClientResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<ClientResponse>>(this.baseUrl, { params });
  }

  // Get single client by clientNumber
  getClient(clientNumber: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.baseUrl}/${clientNumber}`);
  }

  // Create new client - Requires X-Auth-User-Id header
  createClient(client: ClientRequest, authUserId: number = 1): Observable<ClientResponse> {
    const headers = new HttpHeaders().set('X-Auth-User-Id', authUserId.toString());
    return this.http.post<ClientResponse>(this.baseUrl, client, { headers });
  }

  // Update existing client by clientNumber
  updateClient(clientNumber: string, client: ClientRequest): Observable<ClientResponse> {
    return this.http.put<ClientResponse>(`${this.baseUrl}/${clientNumber}`, client);
  }

  // Delete client
  deleteClient(clientNumber: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${clientNumber}`);
  }

  // Search by first name
  searchByName(firstName: string): Observable<ClientResponse[]> {
    const params = new HttpParams().set('firstName', firstName);
    return this.http.get<ClientResponse[]>(`${this.baseUrl}/search`, { params });
  }

  // Find by mobile
  getByMobile(mobileNumber: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.baseUrl}/mobile/${mobileNumber}`);
  }

  // Find by Aadhaar
  getByAadhaar(aadhaarNumber: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.baseUrl}/aadhaar/${aadhaarNumber}`);
  }

  // Find by PAN
  getByPan(panNumber: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.baseUrl}/pan/${panNumber}`);
  }
}
