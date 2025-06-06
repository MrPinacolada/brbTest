import { defineStore } from "pinia";
import { Column } from "@/modules/board/models/column";
import { Card } from "@/modules/board/models/card";
import { getDefaultColumns } from "../utils/defaultBoard";

export const useBoardStore = defineStore("board", {
  state: () => ({
    columns: getDefaultColumns(),
    editingDisabled: false,
  }),

  actions: {
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
      this.columns.forEach((col) => col.shuffleCards());
    },

    clearAllCards() {
      this.columns.forEach((col) => (col.cards = []));
    },

    moveCard(card: Card, fromColumnId: string, toColumnId: string) {
      if (fromColumnId === toColumnId) return;
      const from = this.columns.find((c) => c.id === fromColumnId);
      const to = this.columns.find((c) => c.id === toColumnId);
      if (!from || !to) return;

      from.removeCard(card.id);
      to.addCard(card);
    },
  },
});
