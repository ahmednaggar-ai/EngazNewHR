import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { environment } from '../../../environments/environment';
import { EmployeeState } from '../features/employee/employee.state';
import { AuthState } from '../features/auth/auth.state';
import { SharedState } from '../shared/shared.state';
import { employeeReducer } from '../features/employee/employee.reducer';
import { authReducer } from '../features/auth/auth.reducer';
import { sharedReducer } from '../shared/shared.reducer';

// Root state interface
export interface AppState {
  router: RouterReducerState<any>;
  employee: EmployeeState;
  auth: AuthState;
  shared: SharedState;
}

// Root reducers
export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  employee: employeeReducer,
  auth: authReducer,
  shared: sharedReducer,
};

// Meta-reducers for development
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
