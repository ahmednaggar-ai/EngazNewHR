import { createReducer, on } from '@ngrx/store';
import { employeeAdapter, initialEmployeeState } from './employee.state';
import * as EmployeeActions from './employee.actions';

export const employeeReducer = createReducer(
  initialEmployeeState,

  // Load Employees
  on(EmployeeActions.loadEmployees, (state, { page, limit, search }) => ({
    ...state,
    loading: true,
    error: null,
    page: page || state.page,
    limit: limit || state.limit,
    searchTerm: search || state.searchTerm,
  })),

  on(EmployeeActions.loadEmployeesSuccess, (state, { employees, total, page, limit }) => {
    const hasNextPage = page * limit < total;
    const hasPreviousPage = page > 1;

    return employeeAdapter.setAll(employees, {
      ...state,
      loading: false,
      error: null,
      total,
      page,
      limit,
      hasNextPage,
      hasPreviousPage,
    });
  }),

  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Employee
  on(EmployeeActions.loadEmployee, (state) => ({
    ...state,
    loadingEmployee: true,
    error: null,
  })),

  on(EmployeeActions.loadEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.upsertOne(employee, {
      ...state,
      loadingEmployee: false,
      error: null,
      selectedEmployeeId: employee.id,
    })
  ),

  on(EmployeeActions.loadEmployeeFailure, (state, { error }) => ({
    ...state,
    loadingEmployee: false,
    error,
  })),

  // Create Employee
  on(EmployeeActions.createEmployee, (state) => ({
    ...state,
    creating: true,
    createError: null,
  })),

  on(EmployeeActions.createEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.addOne(employee, {
      ...state,
      creating: false,
      createError: null,
      total: state.total + 1,
      showCreateModal: false,
    })
  ),

  on(EmployeeActions.createEmployeeFailure, (state, { error }) => ({
    ...state,
    creating: false,
    createError: error,
  })),

  // Update Employee
  on(EmployeeActions.updateEmployee, (state) => ({
    ...state,
    updating: true,
    updateError: null,
  })),

  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.updateOne(
      { id: employee.id, changes: employee },
      {
        ...state,
        updating: false,
        updateError: null,
        showEditModal: false,
      }
    )
  ),

  on(EmployeeActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    updating: false,
    updateError: error,
  })),

  // Delete Employee
  on(EmployeeActions.deleteEmployee, (state) => ({
    ...state,
    deleting: true,
    deleteError: null,
  })),

  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) =>
    employeeAdapter.removeOne(id, {
      ...state,
      deleting: false,
      deleteError: null,
      total: Math.max(0, state.total - 1),
      showDeleteModal: false,
      selectedEmployeeId: state.selectedEmployeeId === id ? null : state.selectedEmployeeId,
    })
  ),

  on(EmployeeActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    deleteError: error,
  })),

  // Search and Filter
  on(EmployeeActions.searchEmployees, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
    page: 1, // Reset to first page when searching
  })),

  on(EmployeeActions.filterEmployees, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    page: 1, // Reset to first page when filtering
  })),

  on(EmployeeActions.clearEmployeeSearch, (state) => ({
    ...state,
    searchTerm: '',
    filters: {},
    page: 1,
  })),

  // Pagination
  on(EmployeeActions.setPage, (state, { page }) => ({
    ...state,
    page,
  })),

  on(EmployeeActions.setPageSize, (state, { pageSize }) => ({
    ...state,
    limit: pageSize,
    page: 1, // Reset to first page when changing page size
  })),

  // Reset
  on(EmployeeActions.resetEmployeeState, () => initialEmployeeState)
);
