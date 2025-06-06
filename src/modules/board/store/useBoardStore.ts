import { defineStore } from "pinia";
import { Column } from "@/modules/board/models/column";
import { Card } from "@/modules/board/models/card";

export const useBoardStore = defineStore("board", {
  state: () => ({
    columns: [] as Column[],
    editingDisabled: false,
  }),

  actions: {
    initializeDefault() {
      this.columns = [
        new Column("TODO"),
        new Column("In Progress"),
        new Column("Done"),
      ];
    },

    addColumn(title: string) {
      this.columns.push(new Column(title));
    },

    removeColumn(columnId: string) {
      this.columns = this.columns.filter((col) => col.id !== columnId);
    },

    toggleEditing(disabled: boolean) {
      this.editingDisabled = disabled;
    },

    shuffleColumns() {
      this.columns = [...this.columns].sort(() => Math.random() - 0.5);
    },

    shuffleCards() {
      this.columns.forEach((col) => {
        col.cards = [...col.cards].sort(() => Math.random() - 0.5);
      });
    },

    clearAllCards() {
      this.columns.forEach((col) => (col.cards = []));
    },
  },
});
