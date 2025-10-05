# NgRx Store Structure - Engaz HR System

This directory contains a comprehensive NgRx implementation for the Engaz HR System, designed as a practice structure for staff frontend developers.

## 📁 Directory Structure

```
src/app/store/
├── root/                    # Root store configuration
│   ├── app.state.ts        # Root state interface
│   ├── app.reducer.ts      # Root reducers and meta-reducers
│   └── index.ts            # Root exports
├── features/               # Feature modules
│   ├── employee/           # Employee management feature
│   │   ├── employee.actions.ts
│   │   ├── employee.state.ts
│   │   ├── employee.reducer.ts
│   │   ├── employee.selectors.ts
│   │   ├── employee.effects.ts
│   │   ├── employee.service.ts
│   │   └── index.ts
│   └── auth/               # Authentication feature
│       ├── auth.actions.ts
│       ├── auth.state.ts
│       ├── auth.reducer.ts
│       ├── auth.selectors.ts
│       ├── auth.effects.ts
│       ├── auth.service.ts
│       └── index.ts
├── shared/                 # Shared state management
│   ├── shared.actions.ts
│   ├── shared.state.ts
│   ├── shared.reducer.ts
│   ├── shared.selectors.ts
│   ├── shared.effects.ts
│   └── index.ts
└── models/                 # TypeScript interfaces
    ├── employee.model.ts
    └── user.model.ts
```

## 🚀 Getting Started

### 1. Store Configuration

The store is configured in `app.config.ts`:

```typescript
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideStore(reducers, { metaReducers }),
    provideEffects([EmployeeEffects, AuthEffects, SharedEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
    }),
  ],
};
```

### 2. Using the Store in Components

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/root/app.state';
import * as EmployeeActions from '../store/features/employee/employee.actions';
import * as EmployeeSelectors from '../store/features/employee/employee.selectors';

@Component({
  selector: 'app-employee-list',
  template: `...`,
})
export class EmployeeListComponent {
  employees$: Observable<Employee[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.employees$ = this.store.select(EmployeeSelectors.selectAllEmployeesList);
    this.loading$ = this.store.select(EmployeeSelectors.selectEmployeeLoading);
  }

  loadEmployees() {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }
}
```

## 📋 Features

### Employee Management

**Actions:**

- `loadEmployees()` - Load paginated employee list
- `createEmployee(employee)` - Create new employee
- `updateEmployee(id, employee)` - Update existing employee
- `deleteEmployee(id)` - Delete employee
- `searchEmployees(searchTerm)` - Search employees
- `filterEmployees(filters)` - Filter employees by criteria

**Selectors:**

- `selectAllEmployeesList` - Get all employees
- `selectEmployeeLoading` - Get loading state
- `selectEmployeeError` - Get error state
- `selectEmployeePagination` - Get pagination info
- `selectFilteredEmployees` - Get filtered employees
- `selectEmployeeStats` - Get employee statistics

**Effects:**

- HTTP calls for CRUD operations
- Error handling
- Success notifications
- Search and filter logic

### Authentication

**Actions:**

- `login(email, password)` - User login
- `logout()` - User logout
- `register(userData, password)` - User registration
- `refreshToken()` - Refresh authentication token
- `loadProfile()` - Load user profile
- `updateProfile(userData)` - Update user profile

**Selectors:**

- `selectUser` - Get current user
- `selectIsAuthenticated` - Check authentication status
- `selectUserRole` - Get user role
- `selectCanManageEmployees` - Check permissions
- `selectAuthLoading` - Get loading state

**Effects:**

- Token management
- Auto-login on app start
- Route navigation
- Error handling

### Shared State

**Actions:**

- `setLoading(loading, type)` - Set loading state
- `showNotification(notification)` - Show notification
- `openModal(modalId, data)` - Open modal
- `setTheme(theme)` - Set application theme
- `setBreadcrumbs(breadcrumbs)` - Set navigation breadcrumbs

**Selectors:**

- `selectGlobalLoading` - Get global loading state
- `selectNotifications` - Get all notifications
- `selectOpenModals` - Get open modals
- `selectTheme` - Get current theme
- `selectBreadcrumbs` - Get breadcrumbs

## 🛠️ Best Practices

### 1. Action Naming Convention

```typescript
// Pattern: [Feature] Action Description
export const loadEmployees = createAction('[Employee] Load Employees');
export const loadEmployeesSuccess = createAction('[Employee] Load Employees Success');
export const loadEmployeesFailure = createAction('[Employee] Load Employees Failure');
```

### 2. Selector Composition

```typescript
// Basic selector
export const selectEmployees = createSelector(selectEmployeeState, (state) => state.employees);

// Composed selector
export const selectActiveEmployees = createSelector(selectEmployees, (employees) =>
  employees.filter((emp) => emp.status === 'active')
);

// Memoized selector with parameters
export const selectEmployeeById = (id: string) =>
  createSelector(selectEmployees, (employees) => employees.find((emp) => emp.id === id));
```

### 3. Effect Patterns

```typescript
// HTTP Effect
loadEmployees$ = createEffect(() =>
  this.actions$.pipe(
    ofType(EmployeeActions.loadEmployees),
    switchMap((action) =>
      this.employeeService.getEmployees(action.params).pipe(
        map((response) => EmployeeActions.loadEmployeesSuccess({ employees: response.data })),
        catchError((error) => of(EmployeeActions.loadEmployeesFailure({ error: error.message })))
      )
    )
  )
);

// Navigation Effect
loginSuccess$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigate(['/dashboard']))
    ),
  { dispatch: false }
);
```

### 4. State Normalization

```typescript
// Using NgRx Entity for normalized state
export const employeeAdapter = createEntityAdapter<Employee>({
  selectId: (employee: Employee) => employee.id,
  sortComparer: (a, b) => a.lastName.localeCompare(b.lastName),
});

export interface EmployeeState extends EntityState<Employee> {
  loading: boolean;
  error: string | null;
  // ... other properties
}
```

## 🔧 Development Tools

### Redux DevTools

The store is configured with Redux DevTools for debugging:

- **Time Travel**: Navigate through state changes
- **Action Logging**: See all dispatched actions
- **State Inspection**: View current state tree
- **Hot Reloading**: Persist state across reloads

### Local Storage Sync

Selected state slices are automatically synced to localStorage:

```typescript
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['auth', 'employee'],
    rehydrate: true,
    storageKeySerializer: (key) => `ngrx_${key}`,
  })(reducer);
}
```

## 📚 Learning Resources

### NgRx Documentation

- [Official NgRx Guide](https://ngrx.io/guide/store)
- [NgRx Effects Guide](https://ngrx.io/guide/effects)
- [NgRx Selectors Guide](https://ngrx.io/guide/store/selectors)

### Best Practices

- [NgRx Best Practices](https://ngrx.io/guide/store/recipes)
- [State Management Patterns](https://ngrx.io/guide/store/patterns)
- [Testing NgRx](https://ngrx.io/guide/store/testing)

## 🧪 Testing

### Unit Testing Selectors

```typescript
describe('Employee Selectors', () => {
  it('should select all employees', () => {
    const state = { employees: [mockEmployee1, mockEmployee2] };
    const result = EmployeeSelectors.selectAllEmployeesList.projector(state);
    expect(result).toEqual([mockEmployee1, mockEmployee2]);
  });
});
```

### Testing Effects

```typescript
describe('Employee Effects', () => {
  it('should load employees on loadEmployees action', () => {
    actions$ = hot('-a', { a: EmployeeActions.loadEmployees() });
    const expected = cold('-a', { a: EmployeeActions.loadEmployeesSuccess({ employees: [] }) });

    expect(effects.loadEmployees$).toBeObservable(expected);
  });
});
```

## 🚀 Advanced Patterns

### 1. Feature State Composition

```typescript
// Combining multiple feature states
export const selectDashboardData = createSelector(
  selectAllEmployeesList,
  selectUser,
  selectEmployeeStats,
  (employees, user, stats) => ({
    employees: employees.slice(0, 5), // Recent employees
    user,
    stats,
  })
);
```

### 2. Dynamic Selectors

```typescript
// Factory function for parameterized selectors
export const selectEmployeesByDepartment = (department: string) =>
  createSelector(selectAllEmployeesList, (employees) =>
    employees.filter((emp) => emp.department === department)
  );
```

### 3. Conditional Effects

```typescript
// Effect with conditional logic
conditionalEffect$ = createEffect(() =>
  this.actions$.pipe(
    ofType(SomeAction),
    withLatestFrom(this.store.select(selectSomeCondition)),
    filter(([action, condition]) => condition),
    switchMap(([action]) => /* do something */)
  )
);
```

## 📝 Notes

- All actions follow the `[Feature] Action Description` pattern
- Selectors are memoized for performance
- Effects handle side effects and HTTP calls
- State is normalized using NgRx Entity where appropriate
- Error handling is consistent across all features
- Loading states are managed for better UX

This structure provides a solid foundation for building scalable Angular applications with NgRx state management.
