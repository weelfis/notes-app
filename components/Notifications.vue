<script setup lang="ts">
import { useNotificationsStore } from "../store/useNotificationsStore";
import { computed } from "vue";

const notificationsStore = useNotificationsStore();
const notifications = computed(() => notificationsStore.notifications);

const getNotificationStyles = (type: string) => {
  const baseStyles =
    "flex items-center justify-between p-4 rounded-lg shadow-md mb-4";

  switch (type) {
    case "success":
      return `${baseStyles} bg-green-100 text-green-800 border-l-4 border-green-500`;
    case "error":
      return `${baseStyles} bg-red-100 text-red-800 border-l-4 border-red-500`;
    case "warning":
      return `${baseStyles} bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500`;
    default:
      return `${baseStyles} bg-blue-100 text-blue-800 border-l-4 border-blue-500`;
  }
};

const removeNotification = (id: string) => {
  notificationsStore.remove(id);
};
</script>

<template>
  <div class="fixed top-4 right-4 z-50 w-96 space-y-2">
    <TransitionGroup
      name="notification"
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="opacity-0 translate-x-8"
      leave-to-class="opacity-0 translate-x-8"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="getNotificationStyles(notification.type)"
      >
        <div class="flex-1 mr-2">{{ notification.message }}</div>
        <button
          class="text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
          @click="removeNotification(notification.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
