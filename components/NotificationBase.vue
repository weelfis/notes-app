<script setup lang="ts">
import { useNotificationsStore } from "../stores/useNotificationsStore";
import type { Notification } from "../types";

const notifications = useNotificationsStore();
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="notification in notifications.notifications"
      :key="notification.id"
      :class="[
        'p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300',
        {
          'bg-green-500 text-white': notification.type === 'SUCCESS',
          'bg-red-500 text-white': notification.type === 'ERROR',
          'bg-yellow-500 text-white': notification.type === 'WARNING',
          'bg-blue-500 text-white': notification.type === 'INFO'
        }
      ]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>
