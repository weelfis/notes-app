import { computed } from "vue";
import { useNoteActions } from "../composables/useNoteActions";
import type { IButton } from "../types/index";

const { canUndo, canRedo, save, cancel, undoRedo } = useNoteActions();

export const buttons: IButton[] = [
  {
    label: "↩",
    action: () => undoRedo("undo"),
    class: "text-gray-600 hover:text-gray-800 disabled:opacity-50",
    disabled: computed(() => !canUndo.value)
  },
  {
    label: "↪",
    action: () => undoRedo("redo"),
    class: "text-gray-600 hover:text-gray-800 disabled:opacity-50",
    disabled: computed(() => !canRedo.value)
  },
  {
    label: "Сохранить",
    action: save,
    class: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",
    disabled: computed(() => false)
  },
  {
    label: "Отмена",
    action: cancel,
    class: "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600",
    disabled: computed(() => false) // Тоже не заблокирована
  }
];
