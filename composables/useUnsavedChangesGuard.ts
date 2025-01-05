import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { Ref } from "vue";
import type { RouteLocationNormalized } from "vue-router";
import type { INote } from "../types";

export function useUnsavedChangesGuard(note: Ref<INote>, isNew: Ref<boolean>) {
  const hasUnsavedChanges = ref(false);
  const showUnsavedDialog = ref(false);
  const pendingNavigation = ref<RouteLocationNormalized | null>(null);
  const isSaving = ref(false);
  const router = useRouter();

  const resetUnsavedChanges = () => {
    hasUnsavedChanges.value = false;
    showUnsavedDialog.value = false;
    pendingNavigation.value = null;
    isSaving.value = true;

    setTimeout(() => {
      isSaving.value = false;
    }, 100);
  };

  watch(
    () => note.value,
    () => {
      if (!hasUnsavedChanges.value && !isSaving.value) {
        hasUnsavedChanges.value = true;
      }
    },
    { deep: true }
  );

  router.beforeEach((to, from, next) => {
    if (hasUnsavedChanges.value && note.value.title && !isSaving.value) {
      showUnsavedDialog.value = true;
      pendingNavigation.value = to;
      next(false);
    } else {
      resetUnsavedChanges();
      next();
    }
  });

  const handleConfirmNavigation = () => {
    resetUnsavedChanges();
    router.push("/");
  };

  const handleCancelNavigation = () => {
    showUnsavedDialog.value = false;
    pendingNavigation.value = null;
  };

  return {
    showUnsavedDialog,
    handleConfirmNavigation,
    handleCancelNavigation,
    resetUnsavedChanges
  };
}
