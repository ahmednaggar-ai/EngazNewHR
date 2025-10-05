import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// NgRx imports
import { AppState } from '../../store/root/app.state';
import * as EmployeeActions from '../../store/features/employee/employee.actions';
import * as EmployeeSelectors from '../../store/features/employee/employee.selectors';
import * as SharedActions from '../../store/shared/shared.actions';

// Models
import { Employee } from '../../store/models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="employee-list-container">
      <!-- Header -->
      <div class="header">
        <h2>Employee Management</h2>
        <button class="btn btn-primary" (click)="openCreateModal()" [disabled]="creating$ | async">
          Add Employee
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="filters">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search employees..."
            [formControl]="searchControl"
            class="form-control"
          />
        </div>

        <div class="filter-buttons">
          <select class="form-control" (change)="onDepartmentFilter($event)">
            <option value="">All Departments</option>
            <option *ngFor="let dept of departments$ | async" [value]="dept">
              {{ dept }}
            </option>
          </select>

          <select class="form-control" (change)="onStatusFilter($event)">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading$ | async" class="loading">Loading employees...</div>

      <!-- Error State -->
      <div *ngIf="error$ | async as error" class="error">
        {{ error }}
        <button (click)="retryLoad()" class="btn btn-sm">Retry</button>
      </div>

      <!-- Employee List -->
      <div *ngIf="!(loading$ | async) && !(error$ | async)" class="employee-list">
        <div class="list-header">
          <div class="pagination-info">
            Showing {{ (pagination$ | async)?.page }} of
            {{ (pagination$ | async)?.total }} employees
          </div>
          <div class="pagination-controls">
            <button
              (click)="previousPage()"
              [disabled]="!(pagination$ | async)?.hasPreviousPage"
              class="btn btn-sm"
            >
              Previous
            </button>
            <button
              (click)="nextPage()"
              [disabled]="!(pagination$ | async)?.hasNextPage"
              class="btn btn-sm"
            >
              Next
            </button>
          </div>
        </div>

        <div class="employee-grid">
          <div
            *ngFor="let employee of employees$ | async"
            class="employee-card"
            (click)="selectEmployee(employee.id)"
          >
            <div class="employee-avatar">
              {{ getInitials(employee.firstName, employee.lastName) }}
            </div>
            <div class="employee-info">
              <h3>{{ employee.firstName }} {{ employee.lastName }}</h3>
              <p>{{ employee.position }}</p>
              <p>{{ employee.department }}</p>
              <span class="status" [class]="employee.status">
                {{ employee.status | titlecase }}
              </span>
            </div>
            <div class="employee-actions">
              <button (click)="editEmployee(employee.id, $event)" class="btn btn-sm btn-outline">
                Edit
              </button>
              <button (click)="deleteEmployee(employee.id, $event)" class="btn btn-sm btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!(loading$ | async) && !(error$ | async) && (employees$ | async)?.length === 0"
        class="empty-state"
      >
        <p>No employees found</p>
        <button (click)="openCreateModal()" class="btn btn-primary">Add First Employee</button>
      </div>
    </div>
  `,
  styles: [
    `
      .employee-list-container {
        padding: 20px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .filters {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .search-box {
        flex: 1;
        min-width: 200px;
      }

      .filter-buttons {
        display: flex;
        gap: 10px;
      }

      .form-control {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .employee-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .employee-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        transition: box-shadow 0.2s;
      }

      .employee-card:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .employee-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .employee-info h3 {
        margin: 0 0 5px 0;
      }

      .employee-info p {
        margin: 0 0 5px 0;
        color: #666;
      }

      .status {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
      }

      .status.active {
        background: #d4edda;
        color: #155724;
      }

      .status.inactive {
        background: #fff3cd;
        color: #856404;
      }

      .status.terminated {
        background: #f8d7da;
        color: #721c24;
      }

      .employee-actions {
        margin-top: 10px;
        display: flex;
        gap: 5px;
      }

      .btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-outline {
        background: transparent;
        border: 1px solid #007bff;
        color: #007bff;
      }

      .btn-danger {
        background: #dc3545;
        color: white;
      }

      .btn-sm {
        padding: 4px 8px;
        font-size: 12px;
      }

      .loading,
      .error,
      .empty-state {
        text-align: center;
        padding: 40px;
      }

      .error {
        color: #dc3545;
      }

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .pagination-controls {
        display: flex;
        gap: 10px;
      }
    `,
  ],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Form controls
  searchControl = new FormControl('');

  // Observables
  employees$: Observable<Employee[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  creating$: Observable<boolean>;
  pagination$: Observable<any>;
  departments$: Observable<string[]>;

  constructor(private store: Store<AppState>) {
    // Initialize selectors
    this.employees$ = this.store.select(EmployeeSelectors.selectAllEmployeesList);
    this.loading$ = this.store.select(EmployeeSelectors.selectEmployeeLoading);
    this.error$ = this.store.select(EmployeeSelectors.selectEmployeeError);
    this.creating$ = this.store.select(EmployeeSelectors.selectEmployeeCreating);
    this.pagination$ = this.store.select(EmployeeSelectors.selectEmployeePagination);
    this.departments$ = this.store
      .select(EmployeeSelectors.selectEmployeeStats)
      .pipe(map((stats) => stats.departments));
  }

  ngOnInit(): void {
    // Load employees on init
    this.store.dispatch(EmployeeActions.loadEmployees({}));

    // Set up search with debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        if (searchTerm) {
          this.store.dispatch(EmployeeActions.searchEmployees({ searchTerm }));
        } else {
          this.store.dispatch(EmployeeActions.clearEmployeeSearch());
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers
  openCreateModal(): void {
    this.store.dispatch(
      SharedActions.openModal({
        modalId: 'create-employee',
        size: 'lg',
      })
    );
  }

  selectEmployee(id: string): void {
    this.store.dispatch(EmployeeActions.loadEmployee({ id }));
  }

  editEmployee(id: string, event: Event): void {
    event.stopPropagation();
    this.store.dispatch(EmployeeActions.loadEmployee({ id }));
    this.store.dispatch(
      SharedActions.openModal({
        modalId: 'edit-employee',
        size: 'lg',
      })
    );
  }

  deleteEmployee(id: string, event: Event): void {
    event.stopPropagation();
    this.store.dispatch(
      SharedActions.showConfirmation({
        id: 'delete-employee',
        title: 'Delete Employee',
        message: 'Are you sure you want to delete this employee?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => {
          this.store.dispatch(EmployeeActions.deleteEmployee({ id }));
        },
      })
    );
  }

  onDepartmentFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.store.dispatch(
      EmployeeActions.filterEmployees({
        filters: { department: target.value || undefined },
      })
    );
  }

  onStatusFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const status = target.value as 'active' | 'inactive' | 'terminated' | undefined;
    this.store.dispatch(
      EmployeeActions.filterEmployees({
        filters: { status: status || undefined },
      })
    );
  }

  retryLoad(): void {
    this.store.dispatch(EmployeeActions.loadEmployees({}));
  }

  previousPage(): void {
    this.pagination$.pipe(takeUntil(this.destroy$)).subscribe((pagination) => {
      if (pagination) {
        this.store.dispatch(
          EmployeeActions.setPage({
            page: pagination.page - 1,
          })
        );
      }
    });
  }

  nextPage(): void {
    this.pagination$.pipe(takeUntil(this.destroy$)).subscribe((pagination) => {
      if (pagination) {
        this.store.dispatch(
          EmployeeActions.setPage({
            page: pagination.page + 1,
          })
        );
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
