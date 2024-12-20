import { defineStore } from "pinia";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Note {
  id: string;
  title: string;
  todos: TodoItem[];
}

export const useNotesStore = defineStore("notes", {
  state: () => ({
    notes: [] as Note[],
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

    addNote(note: Note) {
      this.notes.push(note);
      this.saveToStorage();
      this.addToHistory({ type: "ADD_NOTE", note });
    },

    updateNote(note: Note) {
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
    },

    undo() {
      if (this.currentIndex >= 0) {
        const action = this.history[this.currentIndex];
        switch (action.type) {
          case "ADD_NOTE":
            this.notes = this.notes.filter((n) => n.id !== action.note.id);
            break;
          case "UPDATE_NOTE":
            const index = this.notes.findIndex((n) => n.id === action.note.id);
            if (index !== -1) {
              this.notes[index] = action.previousNote;
            }
            break;
          case "DELETE_NOTE":
            this.notes.push(action.note);
            break;
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
          case "ADD_NOTE":
            this.notes.push(action.note);
            break;
          case "UPDATE_NOTE":
            const index = this.notes.findIndex((n) => n.id === action.note.id);
            if (index !== -1) {
              this.notes[index] = action.note;
            }
            break;
          case "DELETE_NOTE":
            this.notes = this.notes.filter((n) => n.id !== action.note.id);
            break;
        }
        this.saveToStorage();
      }
    }
  }
});
