import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';

// Store configuration
import { reducers, metaReducers } from './store/root/app.reducer';
import { EmployeeEffects } from './store/features/employee/employee.effects';
import { AuthEffects } from './store/features/auth/auth.effects';
import { SharedEffects } from './store/shared/shared.effects';

// Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),

    // HTTP Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },

    // NgRx Store
    provideStore(reducers, { metaReducers }),
    provideEffects([EmployeeEffects, AuthEffects, SharedEffects]),
    provideRouterStore(),

    // DevTools (only in development)
    ...(process.env['NODE_ENV'] !== 'production'
      ? [
          provideStoreDevtools({
            maxAge: 25,
            logOnly: false,
            autoPause: true,
            trace: false,
            traceLimit: 75,
          }),
        ]
      : []),
  ],
};
