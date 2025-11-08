
import { useDialogStore } from '@/stores/MultiDialogStore';
import DeleteConfirmation from '@/components/NMultiDialog/DeleteDialog';

const buildPrimaryButton = (options) => {
  if (options.primaryButton) {
    return options.primaryButton;
  }

  if (options.onConfirm) {
    return {
      text: options.confirmText || 'Confirm',
      variant: options.confirmVariant || 'default',
      onConfirm: options.onConfirm,
    };
  }

  return undefined;
};

const buildSecondaryButton = (options) => {
  if (options.secondaryButton !== undefined) {
    return options.secondaryButton;
  }

  return {
    text: options.cancelText || 'Cancel',
    variant: options.cancelVariant || 'tertiary',
    onConfirm: options.onCancel,
  };
};

export const useDialog = () => {
  const { pushDialog, popDialog, closeAllDialogs } = useDialogStore();


  const custom = async (options) => {
    try {
      const result = await pushDialog({
        title: options.title,
        description: options.description,
        children: options.children,
        primaryButton: buildPrimaryButton(options),
        secondaryButton: buildSecondaryButton(options),
        showButtons: options.showButtons ?? true,
        size: options.size,
        width: options.width,
        height: options.height,
        className: options.className,
      });

      return result;
    } catch (error) {
      return null;
    }
  };

  const confirmDelete = async (options) => {
    try {
      const result = await pushDialog({
        title: options.title,
        description: options.description,
        children: (<DeleteConfirmation itemName={options.itemName} />),
        size: options.size || 'sm', // Default to 'sm' for delete confirmations
        className: options.className,
        primaryButton: {
          text: options.confirmText || 'Delete',
          variant: 'destructive',
          form: 'delete-form',
          loading: options.loading,
          onConfirm: options.onConfirm,
        },
        secondaryButton: {
          text: options.cancelText || 'Cancel',
          variant: 'tertiary',
        },
        showButtons: true,
      });

      return result;
    } catch (error) {
      return null;
    }
  };

  return {
    custom,
    openDialog: custom,
    confirmDelete,
    closeAll: closeAllDialogs,
    push: pushDialog,
    pop: popDialog,
  };
};

export default useDialog;