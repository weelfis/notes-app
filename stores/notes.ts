import { defineStore } from "pinia";
import { ENotificationType } from "../types";
import { useNotificationsStore } from "./useNotificationsStore";
import type { INote, INotesState, HistoryAction } from "../types";

export const useNotesStore = defineStore("notes", {
  state: (): INotesState => ({
    notes: [],
    history: [],
    currentIndex: -1,
    isNewNoteRoute: false,
    currentNote: null as INote | null
  }),

  getters: {
    totalNotes: (state) => state.notes.length,
    isNewNote: (state) => state.isNewNoteRoute,
    getCurrentNote: (state) => state.currentNote
  },

  actions: {
    initializeFromStorage() {
      if (process.client) {
        try {
          const storedNotes = localStorage.getItem("notes");
          const storedCurrentNote = localStorage.getItem("currentNote");

          if (storedNotes) {
            this.notes = JSON.parse(storedNotes);
          }
          if (storedCurrentNote) {
            this.currentNote = JSON.parse(storedCurrentNote);
          }

          this.history = [];
          this.currentIndex = -1;
        } catch (error) {
          this.notifyError("Failed to load notes from storage");
        }
      }
    },

    setNewNoteRoute(isNew: boolean) {
      this.isNewNoteRoute = isNew;
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem("notes", JSON.stringify(this.notes));
        if (this.currentNote) {
          localStorage.setItem("currentNote", JSON.stringify(this.currentNote));
        } else {
          localStorage.removeItem("currentNote");
        }
      }
    },

    addNote(note: INote) {
      if (!note.title.trim()) {
        this.notifyError("Note title is required");
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

      this.currentNote = null;
      localStorage.removeItem("currentNote");

      this.notifySuccess("Note successfully added");
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

        this.currentNote = null;
        localStorage.removeItem("currentNote");

        this.notifySuccess("Note successfully updated");
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
        this.notifySuccess("Note successfully deleted");
      }
    },

    addToHistory(action: HistoryAction) {
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1);
      }
      this.history.push(action);
      this.currentIndex = this.history.length - 1;
    },

    notifyError(message: string) {
      const notifications = useNotificationsStore();
      notifications.add({
        type: ENotificationType.ERROR,
        message,
        timeout: 5000
      });
    },

    notifySuccess(message: string) {
      const notifications = useNotificationsStore();
      notifications.add({
        type: ENotificationType.SUCCESS,
        message,
        timeout: 3000
      });
    },

    setCurrentNote(note: INote | null) {
      this.currentNote = note;
      this.saveToStorage();
    },
    removeCurrentNote(note: INote | null) {
      this.currentNote = null;
      localStorage.removeItem("currentNote");
    }
  }
});
