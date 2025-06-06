<template>
  <div
    class="board-card"
    :class="{
      'board-card--dragging': isDragging,
      'board-card--truncated': !isEditing,
      'board-card--disabled': props.disabled,
    }"
    :draggable="!props.disabled"
    @dragstart="!props.disabled && handleDragStart()"
    @dragend="!props.disabled && handleDragEnd()"
    @contextmenu.prevent="onContextMenu"
    @dblclick="startEditing"
  >
    <div class="board-card__content" key="view">
      <p
        class="board-card__title text-bold text-body-1 text-black-base"
        :contenteditable="isEditing && !props.disabled"
        ref="titleRef"
        @input="onInput"
        @keydown.enter.prevent="save"
        @focus="startEditing"
        v-text="editedTitle || 'Untitled Card'"
      ></p>
      <p
        class="board-card__description text-regular text-body-1 text-gray-3"
        :class="{ 'board-card__description--empty': !editedDesc }"
        :contenteditable="isEditing && !props.disabled"
        ref="descRef"
        @input="onInput"
        @keydown.enter.prevent
        @focus="startEditing"
        v-text="editedDesc || 'Add Description'"
      ></p>

      <div v-if="isEditing" class="board-card__actions">
        <ChipButton
          label="Save Changes"
          :icon="'save'"
          :disabled="!hasChanges"
          @click="save"
        />
        <ChipButton label="Cancel" icon="stop" @click="cancel" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Card } from "@/modules/board/models/card";
import { dragManager } from "@/modules/board/services/dummiDrag";
import ChipButton from "./additionals/ChipButton.vue";
import { useContentEditableLimiter } from "@/composables/useContentEditableLimiter";

const props = defineProps<{
  card: Card;
  columnId: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update-card", card: Card): void;
  (e: "remove-card", cardId: string): void;
}>();

const isEditing = ref(false);
const isDragging = ref(false);

const editedTitle = ref(props.card.title);
const editedDesc = ref(props.card.description);

const titleRef = ref<HTMLElement | null>(null);
const descRef = ref<HTMLElement | null>(null);

useContentEditableLimiter(titleRef, 100);
useContentEditableLimiter(descRef, 150);

const hasChanges = computed(() => {
  return (
    editedTitle.value.trim() !== props.card.title ||
    editedDesc.value.trim() !== props.card.description
  );
});

const cancel = () => {
  editedTitle.value = props.card.title;
  editedDesc.value = props.card.description;
  isEditing.value = false;
};

const save = () => {
  if (!hasChanges.value) return;
  emit("update-card", {
    ...props.card,
    title: editedTitle.value.trim(),
    description: editedDesc.value.trim(),
  });
  isEditing.value = false;
};

const emitRemoveCard = () => {
  emit("remove-card", props.card.id);
};

const handleDragStart = () => {
  dragManager.startDragging(props.card, props.columnId);
  isDragging.value = true;
};

const handleDragEnd = () => {
  isDragging.value = false;
  dragManager.reset();
};

const onInput = () => {
  if (titleRef.value) editedTitle.value = titleRef.value.innerText.trim();
  if (descRef.value) editedDesc.value = descRef.value.innerText.trim();
};

const startEditing = () => {
  if (props.disabled || isEditing.value) return;
  isEditing.value = true;
  editedTitle.value = props.card.title;
  editedDesc.value = props.card.description;
  nextTick(() => titleRef.value?.focus());
};

const onContextMenu = () => {
  if (props.disabled) return;
  const confirmed = confirm("Delete this card?");
  if (confirmed) emitRemoveCard();
};
</script>

<style scoped lang="scss">
.board-card {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 16px;
  cursor: grab;
  user-select: none;
  transition: box-shadow 0.2s;
  overflow: hidden;
  flex-shrink: 0;
  &--disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }

  &--dragging {
    opacity: 0.5;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    background: #f9f9f9;
  }

  &--truncated {
    .board-card__title,
    .board-card__description {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      max-height: 100px;
    }
  }

  &__description {
    margin-top: 8px;
    &--empty {
      font-weight: 600;
    }
  }

  &__editable-fields {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__editable {
    border: 1px solid #ddd;
    padding: 6px;
    border-radius: 4px;
    min-height: 24px;
    background: #fff;

    &:focus {
      outline: none;
      border-color: #999;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;

    button {
      padding: 4px 8px;
      font-size: 13px;
    }
  }
}
</style>
