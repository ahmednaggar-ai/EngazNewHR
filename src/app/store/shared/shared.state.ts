export interface Notification {
  id: string;
  notificationType: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface Modal {
  id: string;
  isOpen: boolean;
  data?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface Breadcrumb {
  label: string;
  url?: string;
}

export interface ConfirmationDialog {
  id: string;
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface SharedState {
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;

  // Notifications
  notifications: Notification[];

  // Modals
  modals: Record<string, Modal>;

  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';

  // Breadcrumbs
  breadcrumbs: Breadcrumb[];

  // Errors
  errors: Record<string, string>;

  // Confirmation dialogs
  confirmations: Record<string, ConfirmationDialog>;

  // Search
  globalSearchTerm: string;

  // Other UI state
  isMobile: boolean;
  windowWidth: number;
  windowHeight: number;
}

export const initialSharedState: SharedState = {
  globalLoading: false,
  loadingStates: {},
  notifications: [],
  modals: {},
  sidebarOpen: true,
  theme: 'light',
  breadcrumbs: [],
  errors: {},
  confirmations: {},
  globalSearchTerm: '',
  isMobile: false,
  windowWidth: 0,
  windowHeight: 0,
};
