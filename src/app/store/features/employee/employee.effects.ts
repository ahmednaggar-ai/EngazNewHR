import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { EmployeeService } from '../../services/employee.service';
import * as EmployeeActions from './employee.actions';
import {
  selectEmployeePagination,
  selectEmployeeSearchTerm,
  selectEmployeeFilters,
} from './employee.selectors';
import { AppState } from '../../root/app.state';

@Injectable()
export class EmployeeEffects {
  constructor(
    private actions$: Actions,
    private employeeService: EmployeeService,
    private store: Store<AppState>
  ) {}

  // Load Employees Effect
  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      withLatestFrom(
        this.store.select(selectEmployeePagination),
        this.store.select(selectEmployeeSearchTerm),
        this.store.select(selectEmployeeFilters)
      ),
      switchMap(([action, pagination, searchTerm, filters]) => {
        const params = {
          page: action.page || pagination.page,
          limit: action.limit || pagination.limit,
          search: action.search || searchTerm,
          filters: filters,
        };

        return this.employeeService.getEmployees(params).pipe(
          map((response: any) =>
            EmployeeActions.loadEmployeesSuccess({
              employees: response.data,
              total: response.total,
              page: response.page,
              limit: response.limit,
            })
          ),
          catchError((error) =>
            of(
              EmployeeActions.loadEmployeesFailure({
                error: error.message || 'Failed to load employees',
              })
            )
          )
        );
      })
    )
  );

  // Load Single Employee Effect
  loadEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployee),
      switchMap((action) =>
        this.employeeService.getEmployee(action.id).pipe(
          map((employee: any) => EmployeeActions.loadEmployeeSuccess({ employee })),
          catchError((error) =>
            of(
              EmployeeActions.loadEmployeeFailure({
                error: error.message || 'Failed to load employee',
              })
            )
          )
        )
      )
    )
  );

  // Create Employee Effect
  createEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.createEmployee),
      switchMap((action) =>
        this.employeeService.createEmployee(action.employee).pipe(
          map((employee: any) => EmployeeActions.createEmployeeSuccess({ employee })),
          catchError((error) =>
            of(
              EmployeeActions.createEmployeeFailure({
                error: error.message || 'Failed to create employee',
              })
            )
          )
        )
      )
    )
  );

  // Update Employee Effect
  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),
      switchMap((action) =>
        this.employeeService.updateEmployee(action.id, action.employee).pipe(
          map((employee: any) => EmployeeActions.updateEmployeeSuccess({ employee })),
          catchError((error) =>
            of(
              EmployeeActions.updateEmployeeFailure({
                error: error.message || 'Failed to update employee',
              })
            )
          )
        )
      )
    )
  );

  // Delete Employee Effect
  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      switchMap((action) =>
        this.employeeService.deleteEmployee(action.id).pipe(
          map(() => EmployeeActions.deleteEmployeeSuccess({ id: action.id })),
          catchError((error) =>
            of(
              EmployeeActions.deleteEmployeeFailure({
                error: error.message || 'Failed to delete employee',
              })
            )
          )
        )
      )
    )
  );

  // Search Employees Effect
  searchEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.searchEmployees),
      map((action) =>
        EmployeeActions.loadEmployees({
          search: action.searchTerm,
          page: 1, // Reset to first page when searching
        })
      )
    )
  );

  // Filter Employees Effect
  filterEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.filterEmployees),
      map((action) =>
        EmployeeActions.loadEmployees({
          page: 1, // Reset to first page when filtering
        })
      )
    )
  );

  // Success notifications (optional - can be handled by UI components)
  createEmployeeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmployeeActions.createEmployeeSuccess),
        tap(() => {
          // You can dispatch notification actions here
          console.log('Employee created successfully');
        })
      ),
    { dispatch: false }
  );

  updateEmployeeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmployeeActions.updateEmployeeSuccess),
        tap(() => {
          console.log('Employee updated successfully');
        })
      ),
    { dispatch: false }
  );

  deleteEmployeeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmployeeActions.deleteEmployeeSuccess),
        tap(() => {
          console.log('Employee deleted successfully');
        })
      ),
    { dispatch: false }
  );
}
