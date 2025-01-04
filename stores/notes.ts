import { defineStore } from "pinia";
import { ENotificationType } from "../types";
import { useNotificationsStore } from "./useNotificationsStore";

import type { INote, INotesState, HistoryAction } from "../types";

export const useNotesStore = defineStore("notes", {
  state: (): INotesState => ({
    notes: [],
    history: [],
    currentIndex: -1,
    isNewNoteRoute: false
  }),

  getters: {
    totalNotes: (state) => state.notes.length,

    isNewNote: (state) => state.isNewNoteRoute
  },

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
            type: ENotificationType.ERROR,
            message: "Failed to load notes from storage",
            timeout: 5000
          });
        }
      }
    },

    setNewNoteRoute(isNew: boolean) {
      this.isNewNoteRoute = isNew;
    },

    saveToStorage() {
      if (process.client) {
        try {
          localStorage.setItem("notes", JSON.stringify(this.notes));
        } catch (error) {
          const notifications = useNotificationsStore();
          notifications.add({
            type: ENotificationType.ERROR,
            message: "Failed to save notes to storage",
            timeout: 5000
          });
        }
      }
    },

    addNote(note: INote) {
      const notifications = useNotificationsStore();

      if (!note.title.trim()) {
        notifications.add({
          type: ENotificationType.ERROR,
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
        type: ENotificationType.SUCCESS,
        message: "Note successfully added",
        timeout: 3000
      });
    },

    updateNote(note: INote) {
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

        const notifications = useNotificationsStore();
        notifications.add({
          type: ENotificationType.SUCCESS,
          message: "Note successfully updated",
          timeout: 3000
        });
      }
    },

    deleteNote(id: string) {
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
      }
    },

    addToHistory(action: HistoryAction) {
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1);
      }
      this.history.push(action);
      this.currentIndex = this.history.length - 1;
    }
  }
});
