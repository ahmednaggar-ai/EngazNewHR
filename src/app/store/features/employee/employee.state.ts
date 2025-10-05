import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Employee } from '../../models/employee.model';

// Entity adapter for employees
export const employeeAdapter = createEntityAdapter<Employee>({
  selectId: (employee: Employee) => employee.id,
  sortComparer: (a: Employee, b: Employee) =>
    a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName),
});

// Employee state interface
export interface EmployeeState extends EntityState<Employee> {
  // Loading states
  loading: boolean;
  loadingEmployee: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;

  // Pagination
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // Search and filters
  searchTerm: string;
  filters: Partial<Employee>;
  selectedEmployeeId: string | null;

  // UI state
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
}

// Initial state
export const initialEmployeeState: EmployeeState = employeeAdapter.getInitialState({
  loading: false,
  loadingEmployee: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  total: 0,
  page: 1,
  limit: 10,
  hasNextPage: false,
  hasPreviousPage: false,
  searchTerm: '',
  filters: {},
  selectedEmployeeId: null,
  showCreateModal: false,
  showEditModal: false,
  showDeleteModal: false,
});
