import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Employee, EmployeeSearchParams } from '../../models/employee.model';

export interface EmployeeResponse {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getEmployees(params: EmployeeSearchParams): Observable<EmployeeResponse> {
    let httpParams = new HttpParams();

    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    // Add filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && value.min !== undefined) {
            httpParams = httpParams.set(`${key}Min`, value.min.toString());
            httpParams = httpParams.set(`${key}Max`, value.max.toString());
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<EmployeeResponse>(this.apiUrl, { params: httpParams });
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Additional methods for specific operations
  getEmployeesByDepartment(department: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/department/${department}`);
  }

  getEmployeeStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  exportEmployees(format: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/${format}`, {
      responseType: 'blob',
    });
  }

  importEmployees(file: File): Observable<{ success: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ success: number; errors: any[] }>(`${this.apiUrl}/import`, formData);
  }
}
