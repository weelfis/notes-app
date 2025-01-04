import { defineStore } from "pinia";
import type { INote } from "../types/index";

export const useNotesStore = defineStore("notes", {
  state: () => ({
    notes: [] as INote[],
    history: [] as any[],
    currentIndex: -1
  }),

  actions: {
    initializeFromStorage() {
      if (process.client) {
        const stored = localStorage.getItem("notes");
        if (stored) {
          this.notes = JSON.parse(stored);
        }
      }
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem("notes", JSON.stringify(this.notes));
      }
    },

    addNote(note: INote) {
      this.notes.push(note);
      this.saveToStorage();
      this.addToHistory({ type: "ADD_NOTE", note });
    },

    updateNote(note: INote) {
      const index = this.notes.findIndex((n) => n.id === note.id);
      if (index !== -1) {
        this.notes[index] = note;
        this.saveToStorage();
        this.addToHistory({
          type: "UPDATE_NOTE",
          note,
          previousNote: this.notes[index]
        });
      }
    },

    deleteNote(id: string) {
      const index = this.notes.findIndex((n) => n.id === id);
      if (index !== -1) {
        const deletedNote = this.notes[index];
        this.notes.splice(index, 1);
        this.saveToStorage();
        this.addToHistory({ type: "DELETE_NOTE", note: deletedNote });
      }
    },

    addToHistory(action: any) {
      this.currentIndex++;
      this.history = this.history.slice(0, this.currentIndex);
      this.history.push(action);
    }
  }
});
