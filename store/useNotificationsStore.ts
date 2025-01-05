import { defineStore } from "pinia";
import type { INotification, INotificationsState } from "../types";

export const useNotificationsStore = defineStore("notifications", {
  state: (): INotificationsState => ({
    notifications: []
  }),

  actions: {
    timeoutIds: {} as Record<string, ReturnType<typeof setTimeout>>,

    add(notification: Omit<INotification, "id">) {
      const newNotification: INotification = {
        ...notification,
        id: crypto.randomUUID()
      };

      this.notifications.push(newNotification);

      if (newNotification.timeout) {
        const timeoutId = setTimeout(() => {
          this.remove(newNotification.id);
        }, newNotification.timeout);

        this.timeoutIds[newNotification.id] = timeoutId;
      }
    },

    remove(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        if (this.timeoutIds[id]) {
          clearTimeout(this.timeoutIds[id]);
          delete this.timeoutIds[id];
        }

        this.notifications.splice(index, 1);
      }
    }
  }
});
