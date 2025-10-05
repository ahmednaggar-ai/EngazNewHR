export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated';
  managerId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills: string[];
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFilters {
  department?: string;
  position?: string;
  status?: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  hireDateRange?: {
    start: string;
    end: string;
  };
}

export interface EmployeeSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: EmployeeFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
