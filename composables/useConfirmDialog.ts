import type {
  IConfirmDialogButton,
  IUseConfirmDialogProps
} from "../types/index";

export function useConfirmDialog({
  onUpdateModelValue,
  onConfirm
}: IUseConfirmDialogProps) {
  function closeDialog() {
    onUpdateModelValue(false);
  }

  function confirm() {
    onConfirm();
    closeDialog();
  }

  const buttons: IConfirmDialogButton[] = [
    {
      text: "Cancel",
      class: "px-4 py-2 text-gray-600 hover:text-gray-800",
      onClick: closeDialog
    },
    {
      text: "Confirm",
      class: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-600",
      onClick: confirm
    }
  ];

  return {
    buttons,
    confirm,
    closeDialog
  };
}
