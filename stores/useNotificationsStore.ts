import { defineStore } from "pinia";
import type { INotification, INotificationsState } from "../types";

export const useNotificationsStore = defineStore("notifications", {
  state: (): INotificationsState => ({
    notifications: []
  }),

  actions: {
    add(notification: Omit<INotification, "id">) {
      const newNotification: INotification = {
        ...notification,
        id: crypto.randomUUID()
      };

      this.notifications.push(newNotification);

      if (newNotification.timeout) {
        setTimeout(() => {
          this.remove(newNotification.id);
        }, newNotification.timeout);
      }
    },

    remove(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    }
  }
});
