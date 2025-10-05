import { createAction, props } from '@ngrx/store';
import { Employee } from '../../models/employee.model';

// Load Employees Actions
export const loadEmployees = createAction(
  '[Employee] Load Employees',
  props<{ page?: number; limit?: number; search?: string }>()
);

export const loadEmployeesSuccess = createAction(
  '[Employee] Load Employees Success',
  props<{ employees: Employee[]; total: number; page: number; limit: number }>()
);

export const loadEmployeesFailure = createAction(
  '[Employee] Load Employees Failure',
  props<{ error: string }>()
);

// Load Single Employee Actions
export const loadEmployee = createAction('[Employee] Load Employee', props<{ id: string }>());

export const loadEmployeeSuccess = createAction(
  '[Employee] Load Employee Success',
  props<{ employee: Employee }>()
);

export const loadEmployeeFailure = createAction(
  '[Employee] Load Employee Failure',
  props<{ error: string }>()
);

// Create Employee Actions
export const createEmployee = createAction(
  '[Employee] Create Employee',
  props<{ employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> }>()
);

export const createEmployeeSuccess = createAction(
  '[Employee] Create Employee Success',
  props<{ employee: Employee }>()
);

export const createEmployeeFailure = createAction(
  '[Employee] Create Employee Failure',
  props<{ error: string }>()
);

// Update Employee Actions
export const updateEmployee = createAction(
  '[Employee] Update Employee',
  props<{ id: string; employee: Partial<Employee> }>()
);

export const updateEmployeeSuccess = createAction(
  '[Employee] Update Employee Success',
  props<{ employee: Employee }>()
);

export const updateEmployeeFailure = createAction(
  '[Employee] Update Employee Failure',
  props<{ error: string }>()
);

// Delete Employee Actions
export const deleteEmployee = createAction('[Employee] Delete Employee', props<{ id: string }>());

export const deleteEmployeeSuccess = createAction(
  '[Employee] Delete Employee Success',
  props<{ id: string }>()
);

export const deleteEmployeeFailure = createAction(
  '[Employee] Delete Employee Failure',
  props<{ error: string }>()
);

// Search and Filter Actions
export const searchEmployees = createAction(
  '[Employee] Search Employees',
  props<{ searchTerm: string }>()
);

export const filterEmployees = createAction(
  '[Employee] Filter Employees',
  props<{ filters: Partial<Employee> }>()
);

export const clearEmployeeSearch = createAction('[Employee] Clear Search');

// Pagination Actions
export const setPage = createAction('[Employee] Set Page', props<{ page: number }>());

export const setPageSize = createAction('[Employee] Set Page Size', props<{ pageSize: number }>());

// Reset Actions
export const resetEmployeeState = createAction('[Employee] Reset State');
