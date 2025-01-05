import { watch } from "vue";
import { useRoute } from "vue-router";
import { useNotesStore } from "../store/useNotesStore";

export function useRouteWatcher() {
  const route = useRoute();
  const notesStore = useNotesStore();

  const updateRouteState = () => {
    const isNewNote = route.path === "/notes/new";
    notesStore.setNewNoteRoute(isNewNote);
  };

  watch(() => route.path, updateRouteState, { immediate: true });

  return {
    updateRouteState
  };
}
