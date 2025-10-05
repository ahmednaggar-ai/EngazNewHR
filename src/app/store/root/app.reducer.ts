import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { environment } from '../../../environments/environment';
import { AppState } from './app.state';
import { employeeReducer } from '../features/employee/employee.reducer';
import { authReducer } from '../features/auth/auth.reducer';
import { sharedReducer } from '../shared/shared.reducer';

// Root reducers
export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  employee: employeeReducer,
  auth: authReducer,
  shared: sharedReducer,
};

// Local storage sync configuration
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['auth', 'employee'], // Only sync specific feature states
    rehydrate: true,
    storageKeySerializer: (key) => `ngrx_${key}`,
  })(reducer);
}

// Meta-reducers for development
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [localStorageSyncReducer]
  : [];
