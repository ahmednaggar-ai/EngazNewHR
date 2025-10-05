import { createReducer, on } from '@ngrx/store';
import { initialSharedState } from './shared.state';
import * as SharedActions from './shared.actions';

export const sharedReducer = createReducer(
  initialSharedState,

  // Loading actions
  on(SharedActions.setLoading, (state, { loading, loadingType = 'default' }) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      [loadingType]: loading,
    },
  })),

  on(SharedActions.setGlobalLoading, (state, { loading }) => ({
    ...state,
    globalLoading: loading,
  })),

  // Notification actions
  on(
    SharedActions.showNotification,
    (state, { id, notificationType, title, message, duration, action }) => {
      const notificationId = id || `notification_${Date.now()}_${Math.random()}`;
      const notification: (typeof state.notifications)[0] = {
        id: notificationId,
        notificationType,
        title,
        message,
        duration,
        timestamp: Date.now(),
        action,
      };

      return {
        ...state,
        notifications: [...state.notifications, notification],
      };
    }
  ),

  on(SharedActions.hideNotification, (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter((notification) => notification.id !== id),
  })),

  on(SharedActions.clearAllNotifications, (state) => ({
    ...state,
    notifications: [],
  })),

  // Modal actions
  on(SharedActions.openModal, (state, { modalId, data, size = 'md' }) => ({
    ...state,
    modals: {
      ...state.modals,
      [modalId]: {
        id: modalId,
        isOpen: true,
        data,
        size,
      },
    },
  })),

  on(SharedActions.closeModal, (state, { modalId }) => ({
    ...state,
    modals: {
      ...state.modals,
      [modalId]: {
        ...state.modals[modalId],
        isOpen: false,
      },
    },
  })),

  on(SharedActions.closeAllModals, (state) => {
    const closedModals = Object.keys(state.modals).reduce((acc, key) => {
      acc[key] = { ...state.modals[key], isOpen: false };
      return acc;
    }, {} as typeof state.modals);

    return {
      ...state,
      modals: closedModals,
    };
  }),

  // Sidebar actions
  on(SharedActions.toggleSidebar, (state) => ({
    ...state,
    sidebarOpen: !state.sidebarOpen,
  })),

  on(SharedActions.setSidebarOpen, (state, { open }) => ({
    ...state,
    sidebarOpen: open,
  })),

  // Theme actions
  on(SharedActions.setTheme, (state, { theme }) => ({
    ...state,
    theme,
  })),

  on(SharedActions.toggleTheme, (state) => ({
    ...state,
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),

  // Breadcrumb actions
  on(SharedActions.setBreadcrumbs, (state, { breadcrumbs }) => ({
    ...state,
    breadcrumbs,
  })),

  on(SharedActions.addBreadcrumb, (state, { breadcrumb }) => ({
    ...state,
    breadcrumbs: [...state.breadcrumbs, breadcrumb],
  })),

  on(SharedActions.clearBreadcrumbs, (state) => ({
    ...state,
    breadcrumbs: [],
  })),

  // Error actions
  on(SharedActions.setError, (state, { error, errorType = 'general' }) => ({
    ...state,
    errors: {
      ...state.errors,
      [errorType]: error,
    },
  })),

  on(SharedActions.clearError, (state, { errorType = 'general' }) => {
    const newErrors = { ...state.errors };
    delete newErrors[errorType];
    return {
      ...state,
      errors: newErrors,
    };
  }),

  on(SharedActions.clearAllErrors, (state) => ({
    ...state,
    errors: {},
  })),

  // Confirmation dialog actions
  on(
    SharedActions.showConfirmation,
    (
      state,
      { id, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }
    ) => ({
      ...state,
      confirmations: {
        ...state.confirmations,
        [id]: {
          id,
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          onConfirm,
          onCancel,
        },
      },
    })
  ),

  on(SharedActions.hideConfirmation, (state, { id }) => {
    const newConfirmations = { ...state.confirmations };
    delete newConfirmations[id];
    return {
      ...state,
      confirmations: newConfirmations,
    };
  }),

  // Search actions
  on(SharedActions.setGlobalSearch, (state, { searchTerm }) => ({
    ...state,
    globalSearchTerm: searchTerm,
  })),

  on(SharedActions.clearGlobalSearch, (state) => ({
    ...state,
    globalSearchTerm: '',
  })),

  // Reset action
  on(SharedActions.resetSharedState, () => initialSharedState)
);
