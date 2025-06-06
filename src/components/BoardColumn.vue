<template>
  <div
    class="board-column"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="column-header">
      <h2
        class="column-title"
        :contenteditable="!isEditingDisabled"
        @keydown.enter.prevent
        @blur="emitTitleChange"
        ref="titleRef"
      >
        {{ column.title }}
      </h2>

      <div class="column-actions">
        <ChipButton label="Sort" @click="sortCards" />
        <ChipButton label="Clear All" @click="clearCards" />
        <ChipButton label="Delete Column" @click="emitDelete" />
      </div>
    </div>

    <div class="column-cards">
      <BoardCard
        v-for="card in column.cards"
        :key="card.id"
        :card="card"
        :columnId="column.id"
        @update-card="updateCard"
        @remove-card="removeCard"
      />
    </div>

    <AddNewCard
      :disabled="isEditingDisabled"
      @add="addCard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Column } from '@/modules/board/models/column'
import { Card } from '@/modules/board/models/card'
import BoardCard from './BoardCard.vue'
import AddNewCard from './additionals/AddNewCard.vue'
import ChipButton from './additionals/ChipButton.vue'
import { dragManager } from '@/modules/board/services/dummiDrag'

const props = defineProps<{
  column: Column
  isEditingDisabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update-card', columnId: string, card: Card): void
  (e: 'remove-card', columnId: string, cardId: string): void
  (e: 'add-card', columnId: string, card: Card): void
  (e: 'delete-column', columnId: string): void
  (e: 'update-title', columnId: string, newTitle: string): void
  (e: 'clear-cards', columnId: string): void
  (e: 'sort-cards', columnId: string): void
  (e: 'drop-card', fromColumnId: string, toColumnId: string, card: Card): void
}>()

const titleRef = ref<HTMLElement | null>(null)

function updateCard(card: Card) {
  emit('update-card', props.column.id, card)
}

function removeCard(cardId: string) {
  emit('remove-card', props.column.id, cardId)
}

function addCard(card: Card) {
  emit('add-card', props.column.id, card)
}

function emitDelete() {
  emit('delete-column', props.column.id)
}

function emitTitleChange() {
  if (titleRef.value) {
    const text = titleRef.value.innerText.trim()
    if (text && text !== props.column.title) {
      emit('update-title', props.column.id, text)
    }
  }
}

function clearCards() {
  emit('clear-cards', props.column.id)
}

function sortCards() {
  emit('sort-cards', props.column.id)
}

function handleDrop() {
  const card = dragManager.getDraggedCard()
  const from = dragManager.getSourceColumnId()
  if (card && from && from !== props.column.id) {
    emit('drop-card', from, props.column.id, card)
  }
  dragManager.reset()
}
</script>

<style scoped lang="scss">
.board-column {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;

  .column-title {
    font-size: 18px;
    font-weight: bold;
    padding: 4px 6px;
    border-radius: 4px;

    &:focus {
      outline: 1px dashed #888;
    }
  }

  .column-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
}

.column-cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
