# NgRx Usage Guide - Staff Frontend Developer

This guide provides practical examples and patterns for using the NgRx store structure in the Engaz HR System.

## 🎯 Quick Start

### 1. Basic Component Setup

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../store/root/app.state';

@Component({
  selector: 'app-example',
  template: `...`,
})
export class ExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Observables from store
  data$: Observable<any>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store<AppState>) {
    // Initialize selectors
    this.data$ = this.store.select(selectData);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    // Load data on init
    this.store.dispatch(loadData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 2. Dispatching Actions

```typescript
// Simple action dispatch
this.store.dispatch(loadEmployees());

// Action with payload
this.store.dispatch(createEmployee({ employee: newEmployeeData }));

// Action with parameters
this.store.dispatch(loadEmployees({ page: 1, limit: 10, search: 'john' }));
```

### 3. Using Selectors

```typescript
// Basic selector
this.employees$ = this.store.select(selectAllEmployeesList);

// Selector with parameters
this.employee$ = this.store.select(selectEmployeeById('123'));

// Computed selector
this.activeEmployees$ = this.store.select(selectActiveEmployees);

// Multiple selectors
this.store
  .select(selectEmployeeLoading)
  .pipe(takeUntil(this.destroy$))
  .subscribe((loading) => {
    this.isLoading = loading;
  });
```

## 🔄 Common Patterns

### 1. Loading States

```typescript
// Component
export class EmployeeListComponent {
  loading$ = this.store.select(selectEmployeeLoading);
  error$ = this.store.select(selectEmployeeError);

  loadEmployees() {
    this.store.dispatch(loadEmployees());
  }

  retry() {
    this.store.dispatch(loadEmployees());
  }
}
```

```html
<!-- Template -->
<div *ngIf="loading$ | async" class="loading">Loading employees...</div>

<div *ngIf="error$ | async as error" class="error">
  {{ error }}
  <button (click)="retry()">Retry</button>
</div>

<div *ngIf="!(loading$ | async) && !(error$ | async)">
  <!-- Employee list content -->
</div>
```

### 2. Form Handling

```typescript
export class EmployeeFormComponent {
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required],
  });

  creating$ = this.store.select(selectEmployeeCreating);
  createError$ = this.store.select(selectEmployeeCreateError);

  onSubmit() {
    if (this.form.valid) {
      this.store.dispatch(
        createEmployee({
          employee: this.form.value,
        })
      );
    }
  }
}
```

### 3. Search and Filtering

```typescript
export class SearchComponent {
  searchControl = new FormControl('');

  ngOnInit() {
    // Debounced search
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        if (searchTerm) {
          this.store.dispatch(searchEmployees({ searchTerm }));
        } else {
          this.store.dispatch(clearEmployeeSearch());
        }
      });
  }

  onFilterChange(filter: any) {
    this.store.dispatch(filterEmployees({ filters: filter }));
  }
}
```

### 4. Pagination

```typescript
export class PaginationComponent {
  pagination$ = this.store.select(selectEmployeePagination);

  nextPage() {
    this.store.dispatch(setPage({ page: this.currentPage + 1 }));
  }

  previousPage() {
    this.store.dispatch(setPage({ page: this.currentPage - 1 }));
  }

  changePageSize(size: number) {
    this.store.dispatch(setPageSize({ pageSize: size }));
  }
}
```

## 🎨 UI State Management

### 1. Notifications

```typescript
// Show notification
this.store.dispatch(
  showNotification({
    type: 'success',
    title: 'Success',
    message: 'Employee created successfully',
    duration: 3000,
  })
);

// Show error notification
this.store.dispatch(
  showNotification({
    type: 'error',
    title: 'Error',
    message: 'Failed to create employee',
    duration: 5000,
  })
);
```

### 2. Modals

```typescript
// Open modal
this.store.dispatch(
  openModal({
    modalId: 'create-employee',
    data: { department: 'IT' },
    size: 'lg',
  })
);

// Close modal
this.store.dispatch(closeModal({ modalId: 'create-employee' }));
```

### 3. Loading States

```typescript
// Set specific loading state
this.store.dispatch(
  setLoading({
    loading: true,
    loadingType: 'employee-export',
  })
);

// Set global loading
this.store.dispatch(setGlobalLoading({ loading: true }));
```

## 🔐 Authentication Patterns

### 1. Login Flow

```typescript
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loginLoading$ = this.store.select(selectLoginLoading);
  loginError$ = this.store.select(selectLoginError);

  ngOnInit() {
    // Redirect on successful login
    this.store
      .select(selectIsAuthenticated)
      .pipe(
        filter((isAuth) => isAuth),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(login({ email, password }));
    }
  }
}
```

### 2. Route Guards

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsAuthenticated).pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this.store.dispatch(openModal({ modalId: 'login' }));
        }
      })
    );
  }
}
```

### 3. Permission Checks

```typescript
export class EmployeeManagementComponent {
  canManageEmployees$ = this.store.select(selectCanManageEmployees);
  canViewAllEmployees$ = this.store.select(selectCanViewAllEmployees);

  ngOnInit() {
    this.canManageEmployees$.pipe(takeUntil(this.destroy$)).subscribe((canManage) => {
      if (!canManage) {
        this.router.navigate(['/unauthorized']);
      }
    });
  }
}
```

## 📊 Data Management

### 1. CRUD Operations

```typescript
export class EmployeeService {
  // Create
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  // Read
  getEmployees(params: any): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(this.apiUrl, { params });
  }

  // Update
  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  // Delete
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### 2. Error Handling

```typescript
// In effects
loadEmployees$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadEmployees),
    switchMap((action) =>
      this.employeeService.getEmployees(action.params).pipe(
        map((response) => loadEmployeesSuccess({ employees: response.data })),
        catchError((error) => {
          // Log error
          console.error('Failed to load employees:', error);

          // Dispatch error action
          return of(
            loadEmployeesFailure({
              error: error.message || 'Failed to load employees',
            })
          );
        })
      )
    )
  )
);
```

### 3. Optimistic Updates

```typescript
// Optimistic update pattern
updateEmployee$ = createEffect(() =>
  this.actions$.pipe(
    ofType(updateEmployee),
    switchMap((action) => {
      // Optimistically update UI
      this.store.dispatch(
        updateEmployeeOptimistic({
          id: action.id,
          changes: action.employee,
        })
      );

      return this.employeeService.updateEmployee(action.id, action.employee).pipe(
        map((employee) => updateEmployeeSuccess({ employee })),
        catchError((error) =>
          of(
            updateEmployeeFailure({
              error: error.message,
              id: action.id,
              changes: action.employee,
            })
          )
        )
      );
    })
  )
);
```

## 🧪 Testing Patterns

### 1. Testing Components

```typescript
describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let store: MockStore<AppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeeListComponent],
      providers: [
        provideMockStore({
          initialState: mockAppState,
          selectors: [
            { selector: selectAllEmployeesList, value: mockEmployees },
            { selector: selectEmployeeLoading, value: false },
          ],
        }),
      ],
    });

    store = TestBed.inject(MockStore);
    component = TestBed.createComponent(EmployeeListComponent).componentInstance;
  });

  it('should load employees on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadEmployees());
  });
});
```

### 2. Testing Effects

```typescript
describe('EmployeeEffects', () => {
  let effects: EmployeeEffects;
  let actions$: Observable<any>;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EmployeeService', ['getEmployees']);

    TestBed.configureTestingModule({
      providers: [EmployeeEffects, { provide: EmployeeService, useValue: spy }],
    });

    effects = TestBed.inject(EmployeeEffects);
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
  });

  it('should load employees successfully', () => {
    const employees = [mockEmployee1, mockEmployee2];
    const action = loadEmployees();
    const outcome = loadEmployeesSuccess({ employees });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: { data: employees } });
    employeeService.getEmployees.and.returnValue(response);

    const expected = cold('--b', { b: outcome });
    expect(effects.loadEmployees$).toBeObservable(expected);
  });
});
```

## 🚀 Performance Tips

### 1. Memoized Selectors

```typescript
// Good - memoized selector
export const selectEmployeeById = (id: string) =>
  createSelector(selectAllEmployeesList, (employees) => employees.find((emp) => emp.id === id));

// Bad - not memoized
export const selectEmployeeById = (id: string) => (state: AppState) => state.employee.entities[id];
```

### 2. OnPush Change Detection

```typescript
@Component({
  selector: 'app-employee-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
})
export class EmployeeListComponent {
  // Component implementation
}
```

### 3. TrackBy Functions

```typescript
export class EmployeeListComponent {
  trackByEmployeeId(index: number, employee: Employee): string {
    return employee.id;
  }
}
```

```html
<div *ngFor="let employee of employees$ | async; trackBy: trackByEmployeeId">
  <!-- Employee content -->
</div>
```

## 📝 Best Practices Summary

1. **Always use selectors** instead of accessing state directly
2. **Use OnPush change detection** for better performance
3. **Implement proper error handling** in effects
4. **Use trackBy functions** for \*ngFor loops
5. **Memoize selectors** with createSelector
6. **Handle loading states** for better UX
7. **Use proper action naming** conventions
8. **Test your selectors and effects** thoroughly
9. **Keep state normalized** using NgRx Entity
10. **Use effects for side effects** only

This guide provides the foundation for building robust, maintainable Angular applications with NgRx state management.
