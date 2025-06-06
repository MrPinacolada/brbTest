<template>
  <div class="column" @dragover.prevent @drop="handleDrop">
    <!-- Header -->
    <div class="column__header">
      <div class="column__title-group">
        <span
          class="column__title text-bold text-body-2 text-gray-3"
          :contenteditable="!isEditingDisabledEffective"
          @keydown.enter.prevent
          @blur="emitTitleChange"
          ref="titleRef"
        >
          {{ column.title }}
        </span>
        <span class="column__count text-black-pale text-bold text-body-2">
          {{ column.cards.length }}
        </span>
      </div>

      <div class="column__header-actions">
        <ChipButton
          :label="isEditingDisabledEffective ?'Unlock Column': 'Disable Editing' "
          :icon="isEditingDisabledEffective ? 'play' : 'pause'"
          @click="toggleEditing"
        />
        <ChipButton label="Delete Column" icon="stop" @click="emitDelete" />
      </div>
    </div>

    <div class="column__cards">
      <BoardCard
        v-for="card in column.cards"
        :key="card.id"
        :card="card"
        :columnId="column.id"
        :disabled="isEditingDisabledEffective"
        @update-card="updateCard"
        @remove-card="removeCard"
      />
    </div>

    <AddNewCard :disabled="isEditingDisabledEffective" @add="addCard" />

    <div class="column__footer">
      <ChipButton label="Sort" @click="$emit('sort-cards', column.id)" />
      <ChipButton label="Clear All" @click="clearCards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Column } from "@/modules/board/models/column";
import { Card } from "@/modules/board/models/card";
import BoardCard from "./BoardCard.vue";
import AddNewCard from "./additionals/AddNewCard.vue";
import ChipButton from "./additionals/ChipButton.vue";
import { dragManager } from "@/modules/board/services/dummiDrag";

const props = defineProps<{
  column: Column;
  isEditingDisabled: boolean;
}>();

const emit = defineEmits<{
  (e: "update-card", columnId: string, card: Card): void;
  (e: "remove-card", columnId: string, cardId: string): void;
  (e: "add-card", columnId: string, card: Card): void;
  (e: "delete-column", columnId: string): void;
  (e: "update-title", columnId: string, newTitle: string): void;
  (e: "sort-cards", columnId: string): void;
  (e: "clear-cards", columnId: string): void;
  (e: "disable-editing"): void;
  (e: "drop-card", fromColumnId: string, toColumnId: string, card: Card): void;
}>();

const titleRef = ref<HTMLElement | null>(null);

const localEditgDisabled = ref(props.isEditingDisabled);
const isEditingDisabledEffective = computed(() => {
  return props.isEditingDisabled || localEditgDisabled.value
})

function updateCard(card: Card) {
  emit("update-card", props.column.id, card);
}

function removeCard(cardId: string) {
  emit("remove-card", props.column.id, cardId);
}

function addCard(card: Card) {
  emit("add-card", props.column.id, card);
}

function emitDelete() {
  emit("delete-column", props.column.id);
}

function clearCards() {
  emit("clear-cards", props.column.id);
}

function emitTitleChange() {
  if (titleRef.value) {
    const text = titleRef.value.innerText.trim();
    if (text && text !== props.column.title) {
      emit("update-title", props.column.id, text);
    }
  }
}

function handleDrop() {
  const card = dragManager.getDraggedCard();
  const from = dragManager.getSourceColumnId();
  if (card && from && from !== props.column.id) {
    emit("drop-card", from, props.column.id, card);
  }
  dragManager.reset();
}

function toggleEditing() {
  localEditgDisabled.value = !localEditgDisabled.value;
}

watch(
  () => props.isEditingDisabled,
  (val: boolean) => {
    localEditgDisabled.value = val;
  }
);
</script>

<style scoped lang="scss">
.column {
  background: var(--gray-1);
  border-radius: 12px;
  padding: 16px;
  min-width: 280px;
  max-width: 448px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  &__title-group {
    display: flex;
    align-items: flex-end;
    gap: 6px;
  }

  &__title {
    border-radius: 4px;

    &:focus {
      outline: 1px dashed var(--gray-2);
    }
  }

  &__count {
    color: var(--gray-3);
  }

  &__header-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 4px;
    border-top: 1px solid var(--gray-2);
  }
}
</style>
