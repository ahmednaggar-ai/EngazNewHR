import { createAction, props } from '@ngrx/store';

// Loading Actions
export const setLoading = createAction(
  '[Shared] Set Loading',
  props<{ loading: boolean; loadingType?: string }>()
);

export const setGlobalLoading = createAction(
  '[Shared] Set Global Loading',
  props<{ loading: boolean }>()
);

// Notification Actions
export const showNotification = createAction(
  '[Shared] Show Notification',
  props<{
    id?: string;
    notificationType: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    action?: {
      label: string;
      callback: () => void;
    };
  }>()
);

export const hideNotification = createAction('[Shared] Hide Notification', props<{ id: string }>());

export const clearAllNotifications = createAction('[Shared] Clear All Notifications');

// Modal Actions
export const openModal = createAction(
  '[Shared] Open Modal',
  props<{
    modalId: string;
    data?: any;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }>()
);

export const closeModal = createAction('[Shared] Close Modal', props<{ modalId: string }>());

export const closeAllModals = createAction('[Shared] Close All Modals');

// Sidebar Actions
export const toggleSidebar = createAction('[Shared] Toggle Sidebar');

export const setSidebarOpen = createAction('[Shared] Set Sidebar Open', props<{ open: boolean }>());

// Theme Actions
export const setTheme = createAction(
  '[Shared] Set Theme',
  props<{ theme: 'light' | 'dark' | 'auto' }>()
);

export const toggleTheme = createAction('[Shared] Toggle Theme');

// Breadcrumb Actions
export const setBreadcrumbs = createAction(
  '[Shared] Set Breadcrumbs',
  props<{ breadcrumbs: Array<{ label: string; url?: string }> }>()
);

export const addBreadcrumb = createAction(
  '[Shared] Add Breadcrumb',
  props<{ breadcrumb: { label: string; url?: string } }>()
);

export const clearBreadcrumbs = createAction('[Shared] Clear Breadcrumbs');

// Error Actions
export const setError = createAction(
  '[Shared] Set Error',
  props<{ error: string; errorType?: string }>()
);

export const clearError = createAction('[Shared] Clear Error', props<{ errorType?: string }>());

export const clearAllErrors = createAction('[Shared] Clear All Errors');

// Confirmation Dialog Actions
export const showConfirmation = createAction(
  '[Shared] Show Confirmation',
  props<{
    id: string;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>()
);

export const hideConfirmation = createAction('[Shared] Hide Confirmation', props<{ id: string }>());

// Search Actions
export const setGlobalSearch = createAction(
  '[Shared] Set Global Search',
  props<{ searchTerm: string }>()
);

export const clearGlobalSearch = createAction('[Shared] Clear Global Search');

// Reset Actions
export const resetSharedState = createAction('[Shared] Reset State');
