<script setup lang="ts">
import { useNotificationsStore } from "../stores/useNotificationsStore";
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
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="getNotificationStyles(notification.type)"
      >
        <div class="flex-1 mr-2">{{ notification.message }}</div>
        <button
          @click="removeNotification(notification.id)"
          class="text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
