import { createFeatureSelector, createSelector } from '@ngrx/store';
import { employeeAdapter, EmployeeState } from './employee.state';
import { Employee, EmployeeFilters } from '../../models/employee.model';

// Feature selector
export const selectEmployeeState = createFeatureSelector<EmployeeState>('employee');

// Entity selectors
const {
  selectAll: selectAllEmployees,
  selectEntities: selectEmployeeEntities,
  selectIds: selectEmployeeIds,
  selectTotal: selectEmployeeCount,
} = employeeAdapter.getSelectors();

// Basic selectors
export const selectAllEmployeesList = createSelector(selectEmployeeState, selectAllEmployees);

export const selectEmployeeEntitiesList = createSelector(
  selectEmployeeState,
  selectEmployeeEntities
);

export const selectEmployeeIdsList = createSelector(selectEmployeeState, selectEmployeeIds);

export const selectEmployeeCountTotal = createSelector(selectEmployeeState, selectEmployeeCount);

// Loading selectors
export const selectEmployeeLoading = createSelector(selectEmployeeState, (state) => state.loading);

export const selectEmployeeLoadingSingle = createSelector(
  selectEmployeeState,
  (state) => state.loadingEmployee
);

export const selectEmployeeCreating = createSelector(
  selectEmployeeState,
  (state) => state.creating
);

export const selectEmployeeUpdating = createSelector(
  selectEmployeeState,
  (state) => state.updating
);

export const selectEmployeeDeleting = createSelector(
  selectEmployeeState,
  (state) => state.deleting
);

// Error selectors
export const selectEmployeeError = createSelector(selectEmployeeState, (state) => state.error);

export const selectEmployeeCreateError = createSelector(
  selectEmployeeState,
  (state) => state.createError
);

export const selectEmployeeUpdateError = createSelector(
  selectEmployeeState,
  (state) => state.updateError
);

export const selectEmployeeDeleteError = createSelector(
  selectEmployeeState,
  (state) => state.deleteError
);

// Pagination selectors
export const selectEmployeePagination = createSelector(selectEmployeeState, (state) => ({
  page: state.page,
  limit: state.limit,
  total: state.total,
  hasNextPage: state.hasNextPage,
  hasPreviousPage: state.hasPreviousPage,
}));

export const selectEmployeePage = createSelector(selectEmployeeState, (state) => state.page);

export const selectEmployeeLimit = createSelector(selectEmployeeState, (state) => state.limit);

export const selectEmployeeTotal = createSelector(selectEmployeeState, (state) => state.total);

// Search and filter selectors
export const selectEmployeeSearchTerm = createSelector(
  selectEmployeeState,
  (state) => state.searchTerm
);

export const selectEmployeeFilters = createSelector(selectEmployeeState, (state) => state.filters);

// Filtered employees selector
export const selectFilteredEmployees = createSelector(
  selectAllEmployeesList,
  selectEmployeeSearchTerm,
  selectEmployeeFilters,
  (employees, searchTerm, filters: EmployeeFilters) => {
    let filtered = [...employees];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(term) ||
          employee.lastName.toLowerCase().includes(term) ||
          employee.email.toLowerCase().includes(term) ||
          employee.department.toLowerCase().includes(term) ||
          employee.position.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.department) {
      filtered = filtered.filter((employee) => employee.department === filters.department);
    }

    if (filters.position) {
      filtered = filtered.filter((employee) => employee.position === filters.position);
    }

    if (filters.status) {
      filtered = filtered.filter((employee) => employee.status === filters.status);
    }

    if (filters.salaryRange) {
      filtered = filtered.filter(
        (employee) =>
          employee.salary >= filters.salaryRange!.min && employee.salary <= filters.salaryRange!.max
      );
    }

    return filtered;
  }
);

// Selected employee selector
export const selectSelectedEmployeeId = createSelector(
  selectEmployeeState,
  (state) => state.selectedEmployeeId
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeEntitiesList,
  selectSelectedEmployeeId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

// UI state selectors
export const selectEmployeeShowCreateModal = createSelector(
  selectEmployeeState,
  (state) => state.showCreateModal
);

export const selectEmployeeShowEditModal = createSelector(
  selectEmployeeState,
  (state) => state.showEditModal
);

export const selectEmployeeShowDeleteModal = createSelector(
  selectEmployeeState,
  (state) => state.showDeleteModal
);

// Computed selectors
export const selectEmployeeStats = createSelector(selectAllEmployeesList, (employees) => {
  const total = employees.length;
  const active = employees.filter((emp) => emp.status === 'active').length;
  const inactive = employees.filter((emp) => emp.status === 'inactive').length;
  const terminated = employees.filter((emp) => emp.status === 'terminated').length;

  const departments = [...new Set(employees.map((emp) => emp.department))];
  const positions = [...new Set(employees.map((emp) => emp.position))];

  const avgSalary =
    employees.length > 0
      ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
      : 0;

  return {
    total,
    active,
    inactive,
    terminated,
    departments,
    positions,
    avgSalary,
  };
});

// Department-based selectors
export const selectEmployeesByDepartment = createSelector(selectAllEmployeesList, (employees) => {
  return employees.reduce((acc, employee) => {
    const dept = employee.department;
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(employee);
    return acc;
  }, {} as Record<string, Employee[]>);
});

// Search suggestions selector
export const selectEmployeeSearchSuggestions = createSelector(
  selectAllEmployeesList,
  selectEmployeeSearchTerm,
  (employees, searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const term = searchTerm.toLowerCase();
    const suggestions = new Set<string>();

    employees.forEach((employee) => {
      if (employee.firstName.toLowerCase().includes(term)) {
        suggestions.add(employee.firstName);
      }
      if (employee.lastName.toLowerCase().includes(term)) {
        suggestions.add(employee.lastName);
      }
      if (employee.department.toLowerCase().includes(term)) {
        suggestions.add(employee.department);
      }
      if (employee.position.toLowerCase().includes(term)) {
        suggestions.add(employee.position);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }
);
