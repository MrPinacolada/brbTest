<template>
  <div class="column" @dragover.prevent @drop="handleDrop">
    <div class="column__header">
      <div class="column__title-group">
        <span
          class="column__title text-bold text-body-2 text-gray-3"
          :contenteditable="!isEditingDisabledEffective"
          @keydown.enter.prevent="emitTitleChange"
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
          :label="
            isEditingDisabledEffective ? 'Unlock Column' : 'Disable Editing'
          "
          :icon="isEditingDisabledEffective ? 'play' : 'pause'"
          @click="toggleEditing"
        />
        <ChipButton
          label="Delete Column"
          :disabled="isEditingDisabledEffective"
          icon="stop"
          @click="emitDelete"
        />
      </div>
    </div>

    <div class="column__cards">
      <BoardCard
        v-for="card in sortedCards"
        :key="card.id"
        :card="card"
        :columnId="column.id"
        :disabled="isEditingDisabledEffective"
        @update-card="updateCard"
        @remove-card="removeCard"
      />

      <AddNewCard :disabled="isEditingDisabledEffective" @add="addCard" />
    </div>

    <div class="column__footer">
      <ChipButton
        label="Sort"
        :icon="sortDirection === 'asc' ? 'sortA' : 'sortD'"
        :disabled="isEditingDisabledEffective"
        @click="toggleSortDirection"
      >
        <template #sub-label>
          <p
            v-if="!isEditingDisabledEffective"
            class="text-gray-3 text-bold text-body-2"
          >
            {{ sortDirection === "desc" ? "Descending" : "Ascending" }}
          </p>
        </template>
      </ChipButton>

      <ChipButton
        label="Clear All"
        :disabled="isEditingDisabledEffective"
        icon="clear"
        @click="clearCards"
      />
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
const sortDirection = ref<"asc" | "desc">("asc");
const sortedCards = computed(() => {
  return [...props.column.cards].sort((a, b) => {
    const aTime = a.createdAt.getTime();
    const bTime = b.createdAt.getTime();
    return sortDirection.value === "asc" ? aTime - bTime : bTime - aTime;
  });
});

const localEditgDisabled = ref(props.isEditingDisabled);
const isEditingDisabledEffective = computed(() => {
  return props.isEditingDisabled || localEditgDisabled.value;
});

function updateCard(card: Card) {
  emit("update-card", props.column.id, card);
}

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
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
      titleRef.value.blur()
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
  padding: 0;
  width: 448px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;

  &__title {
    &-group {
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }

  &__header,
  &__footer {
    position: sticky;
    background-color: var(--gray-1);
    z-index: 2;
    padding: 16px;
  }

  &__header {
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    &-actions{
        display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &__footer {
    bottom: 0;
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: auto;
  }

  &__cards {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
