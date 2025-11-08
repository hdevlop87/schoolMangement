// ====== DialogStore.ts ======
import { create } from 'zustand';
import { ReactNode } from 'react';

interface DialogState {
  // State
  isOpen: boolean;
  isLoading: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  actionText: string;
  confirmText: string;
  confirmVariant: 'default' | 'destructive';
  formId?: string;
  showActions: boolean;
  className?: string;
  onConfirm?: (data?: any) => void | Promise<void>;
  onAction?: () => void;
  registeredAction?: (data?: any) => void | Promise<void>;

  // Actions
  openDialog: (config: {
    title?: string;
    description?: string;
    children?: ReactNode;
    actionText?: string;
    confirmText?: string;
    confirmVariant?: 'default' | 'destructive';
    showActions?: boolean;
    isLoading?: boolean;
    formId?: string;
    className?: string;
    onConfirm?: (data?: any) => void | Promise<void>;
    onAction?: () => void;
  }) => void;
  closeDialog: () => void;
  setLoading: (loading: boolean) => void;
  setFormId: (formId?: string) => void;
  updateDialogButtons: (config: {
    actionText?: string;
    confirmText?: string;
    confirmVariant?: 'default' | 'destructive';
    showActions?: boolean;
  }) => void;

  // Handlers
  handleAction: () => void;
  handleOpenChange: (open: boolean) => void;
  handleConfirm: (data?: any) => Promise<void>;
  registerAction: (fn: (data?: any) => void | Promise<void>) => void;
  unregisterAction: () => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  isLoading: false,
  title: '',
  description: undefined,
  children: undefined,
  formId: undefined,
  onConfirm: undefined,
  onAction: undefined,
  actionText: 'Cancel',
  confirmText: 'Submit',
  confirmVariant: 'default',
  showActions: true,
  className: null,
  registeredAction: undefined,

  // Actions
  openDialog: (config) => set({
    isOpen: true,
    title: config.title,
    description: config.description,
    children: config.children,
    actionText: config.actionText || 'Cancel',
    confirmText: config.confirmText || 'Confirm',
    confirmVariant: config.confirmVariant || 'default',
    showActions: config.showActions ?? true,
    isLoading: config.isLoading || false,
    formId: config.formId,
    className: config.className,
    onConfirm: config.onConfirm,
    onAction: config.onAction,
  }),

  closeDialog: () => set({
    isOpen: false,
    isLoading: false,
    title: '',
    description: undefined,
    children: undefined,
    actionText: 'Cancel',
    confirmText: 'Confirm',
    confirmVariant: 'default',
    showActions: true,
    formId: undefined,
    onConfirm: undefined,
    onAction: undefined,
    className: null,
  }),

  setLoading: (loading) => set({ isLoading: loading }),
  setFormId: (formId) => set({ formId }),

  handleAction: () => {
    const { onAction, registeredAction, closeDialog } = get();
    if (registeredAction) {
      registeredAction();
    } else if (onAction) {
      onAction();
    } else {
      closeDialog();
    }
  },

  handleOpenChange: (open) => {
    if (!open) {
      const { onAction, closeDialog } = get();
      if (onAction) onAction();
      closeDialog();
    }
  },

  handleConfirm: async (data) => {
    const { onConfirm, setLoading, closeDialog } = get();
    if (onConfirm) {
      setLoading(true);
      try {
        await onConfirm(data);
        closeDialog();
      } catch (error) {
        setLoading(false);
        throw error;
      }
    }
  },

  updateDialogButtons: (config) => set((state) => ({
    actionText: config.actionText ?? state.actionText,
    confirmText: config.confirmText ?? state.confirmText,
    confirmVariant: config.confirmVariant ?? state.confirmVariant,
    showActions: config.showActions ?? state.showActions,
  })),

  registerAction: (fn) => set({ registeredAction: fn }),
  unregisterAction: () => set({ registeredAction: undefined }),
}));