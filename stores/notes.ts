import { defineStore } from "pinia";
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
        const stored = localStorage.getItem("notes");
        if (stored) {
          this.notes = JSON.parse(stored);
        }
        this.history = [];
        this.currentIndex = -1;
      }
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem("notes", JSON.stringify(this.notes));
      }
    },

    addNote(note: Note) {
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
