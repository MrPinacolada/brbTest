import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { Column } from "@/modules/board/models/column";
import { Card } from "@/modules/board/models/card";
import { getDefaultColumns } from "../utils/defaultBoard";

const STORAGE_KEY = "kanban-board-state";

const saveToLocalStorage = (columns: Column[], editingDisabled: boolean) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ columns, editingDisabled })
  );
};

const loadFromLocalStorage = (): {
  columns: Column[];
  editingDisabled: boolean;
} | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    const columns = parsed.columns.map((col: any) => {
      const cards = col.cards.map((c: any) => {
        const card = new Card();
        card.id = c.id;
        card.title = c.title;
        card.description = c.description;
        card.createdAt = new Date(c.createdAt);
        return card;
      });
      const column = new Column(col.title, cards);
      column.id = col.id;
      column.updatedAt = new Date(col.updatedAt ?? Date.now());
      return column;
    });

    return {
      columns,
      editingDisabled: parsed.editingDisabled ?? false,
    };
  } catch {
    return null;
  }
};

export const useBoardStore = defineStore("board", () => {
  const saved = loadFromLocalStorage();
  const columns = ref<Column[]>(saved?.columns ?? getDefaultColumns());
  const editingDisabled = ref<boolean>(saved?.editingDisabled ?? false);

  function persist() {
    saveToLocalStorage(columns.value, editingDisabled.value);
  }

  function addColumn(title: string) {
    columns.value.push(new Column(title));
    persist();
  }

  function removeColumn(columnId: string) {
    columns.value = columns.value.filter((col) => col.id !== columnId);
    persist();
  }

  function toggleEditing(disabled: boolean) {
    editingDisabled.value = disabled;
    persist();
  }

  function shuffleColumns() {
    columns.value = [...columns.value].sort(() => Math.random() - 0.5);
    persist();
  }

  function shuffleCards() {
    columns.value.forEach((col) => col.shuffleCards?.());
    persist();
  }

  function clearAllCards() {
    columns.value.forEach((col) => (col.cards = []));
    persist();
  }

  function moveCard(card: Card, fromId: string, toId: string) {
    if (fromId === toId) return;
    const from = columns.value.find((c) => c.id === fromId);
    const to = columns.value.find((c) => c.id === toId);
    if (!from || !to) return;

    from.removeCard(card.id);
    to.addCard(card);
    from.touch();
    to.touch();
    persist();
  }

  watch(columns, () => persist(), { deep: true });

  return {
    columns,
    editingDisabled,
    addColumn,
    removeColumn,
    toggleEditing,
    shuffleColumns,
    shuffleCards,
    clearAllCards,
    moveCard,
  };
});
