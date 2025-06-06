<template>
  <div class="board-wrapper">
    <div class="board-columns">
      <BoardColumn
        v-for="col in columns"
        :key="col.id"
        :column="col"
        :isEditingDisabled="editingDisabled"
        @update-card="updateCard"
        @remove-card="removeCard"
        @add-card="addCard"
        @delete-column="deleteColumn"
        @update-title="updateColumnTitle"
        @clear-cards="clearColumnCards"
        @sort-cards="sortColumnCards"
        @drop-card="moveCardBetweenColumns"
      />
    </div>
    <div class="board-actions">
      <div class="actions">
        <ChipButton label="New Column" icon="add" @click="createColumn" />
        <ChipButton
          label="Shuffle Columns"
          icon="shuffle"
          @click="shuffleColumns"
        />
        <ChipButton
          label="Shuffle Cards"
          icon="shuffle"
          @click="shuffleCards"
        />
        <ChipButton
          :label="editingDisabled ? 'Enable Editing' : 'Disable Editing'"
          icon="pause"
          @click="toggleEditing"
        />
      </div>
      <p class="fancy-title text-bold text-body-1">Board Actions</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBoardStore } from "@/modules/board/store/useBoardStore";
import { Card } from "../modules/board/models/card";
import BoardColumn from "./BoardColumn.vue";
import ChipButton from "./additionals/ChipButton.vue";

const board = useBoardStore();
const { columns, editingDisabled } = storeToRefs(board);

function createColumn() {
  if (columns.value.length >= 4) {
    alert(`No more than 4 columns`);
    return;
  }
  board.addColumn("New Column");
}

function toggleEditing() {
  board.toggleEditing(!editingDisabled.value);
}

function shuffleColumns() {
  board.shuffleColumns();
}

function shuffleCards() {
  board.shuffleCards();
}

function updateCard(columnId: string, card: Card) {
  const col = columns.value.find((c) => c.id === columnId);
  if (!col) return;
  const idx = col.cards.findIndex((c) => c.id === card.id);
  if (idx !== -1) col.cards[idx] = card;
}

function removeCard(columnId: string, cardId: string) {
  const col = columns.value.find((c) => c.id === columnId);
  if (!col) return;
  col.removeCard(cardId);
}

function addCard(columnId: string, card: Card) {
  const col = columns.value.find((c) => c.id === columnId);
  if (!col) return;
  col.addCard(card);
}

function deleteColumn(columnId: string) {
  board.removeColumn(columnId);
}

function updateColumnTitle(columnId: string, newTitle: string) {
  const col = columns.value.find((c) => c.id === columnId);
  if (col) col.title = newTitle;
}

function clearColumnCards(columnId: string) {
  const col = columns.value.find((c) => c.id === columnId);
  if (col) col.cards = [];
}

function sortColumnCards(columnId: string) {
  const col = columns.value.find((c) => c.id === columnId);
  if (col)
    col.cards.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

function moveCardBetweenColumns(fromId: string, toId: string, card: Card) {
  board.moveCard(card, fromId, toId);
}
</script>

<style scoped lang="scss">
.board-wrapper {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  height: 100%;
}

.board-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 12px;
  .actions {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
  .fancy-title {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0.12)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.board-columns {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  height: 100%;
}
</style>
