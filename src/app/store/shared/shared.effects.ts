import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap, delay, filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { HostListener } from '@angular/core';
import * as SharedActions from './shared.actions';
import { selectNotifications } from './shared.selectors';
import { AppState } from '../root/app.state';
import { environment } from '../../../environments/environment';

@Injectable()
export class SharedEffects {
  constructor(private actions$: Actions, private store: Store<AppState>) {}

  // Auto-hide notifications effect
  autoHideNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SharedActions.showNotification),
      switchMap((action) => {
        if (action.duration && action.duration > 0) {
          return of(action).pipe(
            delay(action.duration),
            map(() => SharedActions.hideNotification({ id: action.id || '' }))
          );
        }
        return of(null);
      }),
      filter((action) => action !== null)
    )
  );

  // Window resize effect
  windowResize$ = createEffect(() =>
    fromEvent(window, 'resize').pipe(
      map(() => {
        const isMobile = window.innerWidth < 768;
        return SharedActions.setSidebarOpen({ open: !isMobile });
      })
    )
  );

  // Theme persistence effect
  themePersistence$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.setTheme),
        tap((action) => {
          localStorage.setItem('theme', action.theme);
          this.applyTheme(action.theme);
        })
      ),
    { dispatch: false }
  );

  // Auto-load theme on init
  loadTheme$ = createEffect(() =>
    of(
      SharedActions.setTheme({
        theme: (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'light',
      })
    )
  );

  // Error handling effect
  errorHandling$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.setError),
        tap((action) => {
          // Log error to console in development
          if (!environment.production) {
            console.error(`[${action.errorType || 'general'}] ${action.error}`);
          }

          // Show error notification
          this.store.dispatch(
            SharedActions.showNotification({
              notificationType: 'error',
              title: 'Error',
              message: action.error,
              duration: 5000,
            })
          );
        })
      ),
    { dispatch: false }
  );

  // Notification cleanup effect
  notificationCleanup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.hideNotification),
        tap(() => {
          // Clean up expired notifications
          this.store.select(selectNotifications).subscribe((notifications) => {
            const now = Date.now();
            const expiredNotifications = notifications.filter(
              (notification) =>
                notification.duration && now - notification.timestamp > notification.duration
            );

            expiredNotifications.forEach((notification) => {
              this.store.dispatch(SharedActions.hideNotification({ id: notification.id }));
            });
          });
        })
      ),
    { dispatch: false }
  );

  // Sidebar responsive behavior
  sidebarResponsive$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.setSidebarOpen),
        tap((action) => {
          // Close sidebar on mobile when navigating
          if (window.innerWidth < 768 && action.open) {
            setTimeout(() => {
              this.store.dispatch(SharedActions.setSidebarOpen({ open: false }));
            }, 300);
          }
        })
      ),
    { dispatch: false }
  );

  // Global search effect
  globalSearch$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.setGlobalSearch),
        tap((action) => {
          // Implement global search logic here
          if (action.searchTerm.length > 2) {
            // Trigger search across different features
            console.log('Global search:', action.searchTerm);
          }
        })
      ),
    { dispatch: false }
  );

  // Confirmation dialog effects
  confirmationHandling$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.showConfirmation),
        tap((action) => {
          // Handle confirmation dialog display
          console.log('Confirmation dialog:', action.title);
        })
      ),
    { dispatch: false }
  );

  // Modal management effects
  modalManagement$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.openModal),
        tap((action) => {
          // Prevent body scroll when modal is open
          document.body.style.overflow = 'hidden';
        })
      ),
    { dispatch: false }
  );

  closeModalManagement$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.closeModal, SharedActions.closeAllModals),
        tap(() => {
          // Restore body scroll when all modals are closed
          // This is a simplified version - in a real app, you'd track open modals
          setTimeout(() => {
            document.body.style.overflow = 'auto';
          }, 300);
        })
      ),
    { dispatch: false }
  );

  // Utility method to apply theme
  private applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const root = document.documentElement;

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }
}
