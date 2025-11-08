// ====== DialogStore.ts (Multi-Dialog Stack System) ======
import { create } from 'zustand';
import { ReactNode } from 'react';
import { useMultiStepFormStore } from './MultiStepFormStore';
import { DialogSize, DialogWidth, DialogHeight } from '@/lib/dialogSizes';

interface ButtonConfig {
  form?: string;
  text: string;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline' | 'tertiary';
  icon?: string;
  loadingText?: string;
  onClick?: (data?: any) => void | Promise<void>;
  onConfirm?: (data?: any) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

interface DialogConfig {
  id: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  showButtons: boolean;
  size?: DialogSize;
  width?: DialogWidth;
  height?: DialogHeight;
  className?: string;
  resolve?: (value: any) => void;
  reject?: (reason?: any) => void;
}

interface DialogState {

  dialogs: DialogConfig[];
  isOpen: boolean;
  pushDialog: (config: {
    title?: string;
    description?: string;
    children?: ReactNode;
    primaryButton?: Partial<ButtonConfig>;
    secondaryButton?: Partial<ButtonConfig>;
    showButtons?: boolean;
    size?: DialogSize;
    width?: DialogWidth;
    height?: DialogHeight;
    className?: string;
  }) => Promise<any>;

  popDialog: (result?: any) => void;
  closeDialog: (id: string, result?: any) => void;
  closeAllDialogs: () => void;
  getCurrentDialog: () => DialogConfig | undefined;
  setPrimaryLoading: (loading: boolean) => void;
  setSecondaryLoading: (loading: boolean) => void;
  updatePrimaryButton: (config: Partial<ButtonConfig>, dialogId?: string) => void;
  updateSecondaryButton: (config: Partial<ButtonConfig>, dialogId?: string) => void;
  updateShowButtons: (show: boolean, dialogId?: string) => void;
  handlePrimaryClick: (dialogId: string, data?: any) => Promise<void>;
  handleConfirm: (data?: any) => Promise<void>;
  handleSecondaryClick: (dialogId: string, data?: any) => Promise<void>;
  handleOpenChange: (dialogId: string, open: boolean) => void;
  openDialog: (config: any) => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  dialogs: [],
  isOpen: false,

  getCurrentDialog: () => {
    const { dialogs } = get();
    return dialogs[dialogs.length - 1];
  },

  pushDialog: (config) => {
    return new Promise((resolve, reject) => {
      const id = `dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Only reset MultiStepForm if this is the first dialog (not a nested one)
      const { dialogs } = get();
      if (dialogs.length === 0) {
        const MultiStepFormStore = useMultiStepFormStore.getState();
        MultiStepFormStore.reset?.();
      }

      const primaryButtonConfig: ButtonConfig = {
        text: 'Confirm',
        variant: 'default',
        loading: false,
        disabled: false,
        loadingText: 'Processing...',
        icon: 'check',
        ...config.primaryButton,
      };

      const secondaryButtonConfig: ButtonConfig = {
        text: 'Cancel',
        variant: 'tertiary',
        loading: false,
        disabled: false,
        loadingText: 'Processing...',
        icon: 'x',
        ...config.secondaryButton,
      };

      const dialogConfig: DialogConfig = {
        id,
        title: config.title,
        description: config.description,
        children: config.children,
        primaryButton: primaryButtonConfig,
        secondaryButton: secondaryButtonConfig,
        showButtons: config.showButtons ?? true,
        size: config.size,
        width: config.width,
        height: config.height,
        className: config.className,
        resolve,
        reject,
      };

      set((state) => ({
        dialogs: [...state.dialogs, dialogConfig],
        isOpen: true,
      }));
    });
  },

  popDialog: (result) => {
    const { dialogs } = get();
    if (dialogs.length === 0) return;

    const dialog = dialogs[dialogs.length - 1];
    dialog.resolve?.(result);

    set((state) => ({
      dialogs: state.dialogs.slice(0, -1),
      isOpen: state.dialogs.length > 1,
    }));
  },

  closeDialog: (id, result) => {
    const { dialogs } = get();
    const dialog = dialogs.find(d => d.id === id);

    if (dialog) {
      dialog.resolve?.(result);

      set((state) => ({
        dialogs: state.dialogs.filter(d => d.id !== id),
        isOpen: state.dialogs.filter(d => d.id !== id).length > 0,
      }));
    }
  },

  closeAllDialogs: () => {
    const { dialogs } = get();
    dialogs.forEach(dialog => dialog.reject?.(new Error('All dialogs closed')));

    set({
      dialogs: [],
      isOpen: false,
    });
  },

  setPrimaryLoading: (loading) => {
    const { dialogs } = get();
    if (dialogs.length === 0) return;

    set((state) => {
      const newDialogs = [...state.dialogs];
      const lastIndex = newDialogs.length - 1;
      const dialog = newDialogs[lastIndex];

      if (dialog.primaryButton) {
        newDialogs[lastIndex] = {
          ...dialog,
          primaryButton: { ...dialog.primaryButton, loading },
        };
      }

      return { dialogs: newDialogs };
    });
  },

  setSecondaryLoading: (loading) => {
    const { dialogs } = get();
    if (dialogs.length === 0) return;

    set((state) => {
      const newDialogs = [...state.dialogs];
      const lastIndex = newDialogs.length - 1;
      const dialog = newDialogs[lastIndex];

      if (dialog.secondaryButton) {
        newDialogs[lastIndex] = {
          ...dialog,
          secondaryButton: { ...dialog.secondaryButton, loading },
        };
      }

      return { dialogs: newDialogs };
    });
  },

  updatePrimaryButton: (config, dialogId?: string) => {
    const { dialogs } = get();
    if (dialogs.length === 0) return;

    set((state) => {
      const newDialogs = [...state.dialogs];
      // If dialogId is provided, find that specific dialog. Otherwise use the last one.
      const targetIndex = dialogId
        ? newDialogs.findIndex(d => d.id === dialogId)
        : newDialogs.length - 1;

      if (targetIndex === -1) return state;

      const dialog = newDialogs[targetIndex];

      if (dialog.primaryButton) {
        newDialogs[targetIndex] = {
          ...dialog,
          primaryButton: { ...dialog.primaryButton, ...config },
        };
      }

      return { dialogs: newDialogs };
    });
  },

  updateSecondaryButton: (config, dialogId?: string) => {
    const { dialogs } = get();
    if (dialogs.length === 0) return;

    set((state) => {
      const newDialogs = [...state.dialogs];
      // If dialogId is provided, find that specific dialog. Otherwise use the last one.
      const targetIndex = dialogId
        ? newDialogs.findIndex(d => d.id === dialogId)
        : newDialogs.length - 1;

      if (targetIndex === -1) return state;

      const dialog = newDialogs[targetIndex];

      if (dialog.secondaryButton) {
        newDialogs[targetIndex] = {
          ...dialog,
          secondaryButton: { ...dialog.secondaryButton, ...config },
        };
      }

      return { dialogs: newDialogs };
    });
  },

  updateShowButtons: (show, dialogId?: string) => {
    const { dialogs } = get();
    if (dialogs.length === 0) return;

    set((state) => {
      const newDialogs = [...state.dialogs];
      // If dialogId is provided, find that specific dialog. Otherwise use the last one.
      const targetIndex = dialogId
        ? newDialogs.findIndex(d => d.id === dialogId)
        : newDialogs.length - 1;

      if (targetIndex === -1) return state;

      newDialogs[targetIndex] = {
        ...newDialogs[targetIndex],
        showButtons: show,
      };

      return { dialogs: newDialogs };
    });
  },

  handlePrimaryClick: async (dialogId, data) => {
    const { dialogs, setPrimaryLoading, closeDialog } = get();
    const dialog = dialogs.find(d => d.id === dialogId);

    if (!dialog?.primaryButton) return;

    const { onConfirm, onClick } = dialog.primaryButton;

    if (onConfirm) {
      setPrimaryLoading(true);
      const result = await onConfirm(data);
      closeDialog(dialogId, result);
      setPrimaryLoading(false);
    }

    else if (onClick) {
      setPrimaryLoading(true);
      await onClick(data);
      setPrimaryLoading(false);
    }
    else {
      closeDialog(dialogId, data);
    }
  },

  handleConfirm: async (data) => {
    const { dialogs, setPrimaryLoading, closeDialog } = get();
    const currentDialog = dialogs[dialogs.length - 1];

    if (!currentDialog?.primaryButton) return;

    const { onConfirm } = currentDialog.primaryButton;

    if (onConfirm) {
      setPrimaryLoading(true);
      try {
        const result = await onConfirm(data);
        closeDialog(currentDialog.id, result);
      } finally {
        setPrimaryLoading(false);
      }
    }
  },

  handleSecondaryClick: async (dialogId, data) => {
    const { dialogs, closeDialog } = get();
    const dialog = dialogs.find(d => d.id === dialogId);

    if (!dialog?.secondaryButton) {
      closeDialog(dialogId, null);
      return;
    }

    const { onConfirm, onClick } = dialog.secondaryButton;

    if (onConfirm) {
      await onConfirm(data);
      closeDialog(dialogId, null);
    }
    else if (onClick) {
      await onClick(data);
    }
    else {
      closeDialog(dialogId, null);
    }
  },

  handleOpenChange: (dialogId, open) => {
    if (!open) {
      const { dialogs, closeDialog } = get();
      const dialog = dialogs.find(d => d.id === dialogId);

      if (dialog?.secondaryButton?.onClick) {
        dialog.secondaryButton.onClick();
      }

      closeDialog(dialogId, null);
    }
  },

  openDialog: (config) => {
    get().pushDialog(config);
  },
}));