import { defineStore } from "pinia";
import { NotificationType } from "../types";
import { useNotificationsStore } from "./useNotificationsStore";

import type { Note, NotesState, HistoryAction } from "../types";

export const useNotesStore = defineStore("notes", {
  state: (): NotesState => ({
    notes: [],
    history: [],
    currentIndex: -1
  }),

  actions: {
    initializeFromStorage() {
      if (process.client) {
        try {
          const stored = localStorage.getItem("notes");
          if (stored) {
            this.notes = JSON.parse(stored);
          }
          this.history = [];
          this.currentIndex = -1;
        } catch (error) {
          const notifications = useNotificationsStore();
          notifications.add({
            type: NotificationType.ERROR,
            message: "Failed to load notes from storage",
            timeout: 5000
          });
        }
      }
    },

    saveToStorage() {
      if (process.client) {
        try {
          localStorage.setItem("notes", JSON.stringify(this.notes));
        } catch (error) {
          const notifications = useNotificationsStore();
          notifications.add({
            type: NotificationType.ERROR,
            message: "Failed to save notes to storage",
            timeout: 5000
          });
        }
      }
    },

    addNote(note: Note) {
      const notifications = useNotificationsStore();

      if (!note.title.trim()) {
        notifications.add({
          type: NotificationType.ERROR,
          message: "Note title is required",
          timeout: 3000
        });
        return;
      }

      const newNote = {
        ...note,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.notes.push(newNote);
      this.saveToStorage();
      this.addToHistory({
        type: "ADD_NOTE",
        note: newNote,
        timestamp: new Date()
      });

      notifications.add({
        type: NotificationType.SUCCESS,
        message: "Note added successfully",
        timeout: 3000
      });
    },

    updateNote(note: Note) {
      const index = this.notes.findIndex((n) => n.id === note.id);
      if (index !== -1) {
        const previousNote = { ...this.notes[index] };
        const updatedNote = {
          ...note,
          updatedAt: new Date()
        };
        this.notes[index] = updatedNote;
        this.saveToStorage();
        this.addToHistory({
          type: "UPDATE_NOTE",
          note: updatedNote,
          previousNote,
          timestamp: new Date()
        });
      }
    },

    deleteNote(id: string) {
      const notifications = useNotificationsStore();
      const index = this.notes.findIndex((n) => n.id === id);
      if (index !== -1) {
        const deletedNote = { ...this.notes[index] };
        this.notes.splice(index, 1);
        this.saveToStorage();
        this.addToHistory({
          type: "DELETE_NOTE",
          note: deletedNote,
          timestamp: new Date()
        });

        notifications.add({
          type: NotificationType.SUCCESS,
          message: "Note deleted successfully",
          timeout: 3000
        });
      }
    },

    addToHistory(action: HistoryAction) {
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1);
      }
      this.history.push(action);
      this.currentIndex = this.history.length - 1;
    },

    undo() {
      if (this.currentIndex >= 0) {
        const action = this.history[this.currentIndex];

        switch (action.type) {
          case "ADD_NOTE": {
            const index = this.notes.findIndex((n) => n.id === action.note.id);
            if (index !== -1) {
              this.notes.splice(index, 1);
            }
            break;
          }
          case "UPDATE_NOTE": {
            if (action.previousNote) {
              const index = this.notes.findIndex(
                (n) => n.id === action.note.id
              );
              if (index !== -1) {
                this.notes[index] = { ...action.previousNote };
              }
            }
            break;
          }
          case "DELETE_NOTE": {
            this.notes.push({ ...action.note });
            break;
          }
        }

        this.currentIndex--;
        this.saveToStorage();
      }
    },

    redo() {
      if (this.currentIndex < this.history.length - 1) {
        this.currentIndex++;
        const action = this.history[this.currentIndex];

        switch (action.type) {
          case "ADD_NOTE": {
            this.notes.push({ ...action.note });
            break;
          }
          case "UPDATE_NOTE": {
            const index = this.notes.findIndex((n) => n.id === action.note.id);
            if (index !== -1) {
              this.notes[index] = { ...action.note };
            }
            break;
          }
          case "DELETE_NOTE": {
            const index = this.notes.findIndex((n) => n.id === action.note.id);
            if (index !== -1) {
              this.notes.splice(index, 1);
            }
            break;
          }
        }

        this.saveToStorage();
      }
    }
  }
});
