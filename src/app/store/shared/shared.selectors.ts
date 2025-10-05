import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SharedState } from './shared.state';

// Feature selector
export const selectSharedState = createFeatureSelector<SharedState>('shared');

// Loading selectors
export const selectGlobalLoading = createSelector(
  selectSharedState,
  (state) => state.globalLoading
);

export const selectLoadingStates = createSelector(
  selectSharedState,
  (state) => state.loadingStates
);

export const selectLoadingByType = (loadingType: string) =>
  createSelector(selectLoadingStates, (loadingStates) => loadingStates[loadingType] || false);

export const selectAnyLoading = createSelector(
  selectGlobalLoading,
  selectLoadingStates,
  (globalLoading, loadingStates) =>
    globalLoading || Object.values(loadingStates).some((loading) => loading)
);

// Notification selectors
export const selectNotifications = createSelector(
  selectSharedState,
  (state) => state.notifications
);

export const selectNotificationsByType = (type: string) =>
  createSelector(selectNotifications, (notifications) =>
    notifications.filter((notification) => notification.notificationType === type)
  );

export const selectUnreadNotifications = createSelector(selectNotifications, (notifications) =>
  notifications.filter(
    (notification) =>
      !notification.duration || Date.now() - notification.timestamp < notification.duration
  )
);

export const selectNotificationCount = createSelector(
  selectUnreadNotifications,
  (notifications) => notifications.length
);

// Modal selectors
export const selectModals = createSelector(selectSharedState, (state) => state.modals);

export const selectModalById = (modalId: string) =>
  createSelector(selectModals, (modals) => modals[modalId] || null);

export const selectOpenModals = createSelector(selectModals, (modals) =>
  Object.values(modals).filter((modal) => modal.isOpen)
);

export const selectModalCount = createSelector(selectOpenModals, (modals) => modals.length);

// Sidebar selectors
export const selectSidebarOpen = createSelector(selectSharedState, (state) => state.sidebarOpen);

// Theme selectors
export const selectTheme = createSelector(selectSharedState, (state) => state.theme);

export const selectIsDarkTheme = createSelector(selectTheme, (theme) => theme === 'dark');

export const selectIsLightTheme = createSelector(selectTheme, (theme) => theme === 'light');

// Breadcrumb selectors
export const selectBreadcrumbs = createSelector(selectSharedState, (state) => state.breadcrumbs);

export const selectBreadcrumbCount = createSelector(
  selectBreadcrumbs,
  (breadcrumbs) => breadcrumbs.length
);

// Error selectors
export const selectErrors = createSelector(selectSharedState, (state) => state.errors);

export const selectErrorByType = (errorType: string) =>
  createSelector(selectErrors, (errors) => errors[errorType] || null);

export const selectGeneralError = createSelector(
  selectErrors,
  (errors) => errors['general'] || null
);

export const selectHasErrors = createSelector(
  selectErrors,
  (errors) => Object.keys(errors).length > 0
);

// Confirmation dialog selectors
export const selectConfirmations = createSelector(
  selectSharedState,
  (state) => state.confirmations
);

export const selectConfirmationById = (id: string) =>
  createSelector(selectConfirmations, (confirmations) => confirmations[id] || null);

export const selectOpenConfirmations = createSelector(selectConfirmations, (confirmations) =>
  Object.values(confirmations).filter((confirmation) => confirmation.isOpen)
);

// Search selectors
export const selectGlobalSearchTerm = createSelector(
  selectSharedState,
  (state) => state.globalSearchTerm
);

export const selectHasGlobalSearch = createSelector(
  selectGlobalSearchTerm,
  (searchTerm) => searchTerm.length > 0
);

// UI state selectors
export const selectIsMobile = createSelector(selectSharedState, (state) => state.isMobile);

export const selectWindowWidth = createSelector(selectSharedState, (state) => state.windowWidth);

export const selectWindowHeight = createSelector(selectSharedState, (state) => state.windowHeight);

// Computed selectors
export const selectUIState = createSelector(
  selectSidebarOpen,
  selectTheme,
  selectIsMobile,
  selectWindowWidth,
  selectWindowHeight,
  (sidebarOpen, theme, isMobile, windowWidth, windowHeight) => ({
    sidebarOpen,
    theme,
    isMobile,
    windowWidth,
    windowHeight,
  })
);

export const selectAppState = createSelector(
  selectGlobalLoading,
  selectNotificationCount,
  selectModalCount,
  selectHasErrors,
  (globalLoading, notificationCount, modalCount, hasErrors) => ({
    globalLoading,
    notificationCount,
    modalCount,
    hasErrors,
    isBusy: globalLoading || modalCount > 0,
  })
);
