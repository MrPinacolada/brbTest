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
    @contextmenu.prevent="!props.disabled && emitRemoveCard()"
    @dblclick="startEditing"
  >
    <Transition name="fade-slide" mode="out-in">
      <template v-if="!isEditing">
        <div class="board-card__content" key="view">
          <p class="board-card__title">
            {{ card.title || "Untitled Card" }}
          </p>
          <p v-if="card.description" class="board-card__description">
            {{ card.description }}
          </p>
          <p
            v-else
            class="board-card__description board-card__description--empty"
          >
            Add Description
          </p>
        </div>
      </template>

      <template v-else>
        <div class="board-card__edit" key="edit">
          <div class="board-card__editable-fields">
            <div
              class="board-card__editable board-card__title"
              :contenteditable="!props.disabled"
              ref="titleRef"
              @input="onInput"
              @keydown.enter.prevent="save"
            >
              {{ editedTitle }}
            </div>
            <div
              class="board-card__editable board-card__description"
              :contenteditable="!props.disabled"
              ref="descRef"
              @input="onInput"
              @keydown.enter.prevent
            >
              {{ editedDesc }}
            </div>
          </div>
          <div class="board-card__actions">
            <button @click="save" :disabled="!hasChanges">Save Changes</button>
            <button @click="cancel">Cancel</button>
          </div>
        </div>
      </template>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Card } from "@/modules/board/models/card";
import { dragManager } from "@/modules/board/services/dummiDrag";

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

const hasChanges = computed(() => {
  return (
    editedTitle.value.trim() !== props.card.title ||
    editedDesc.value.trim() !== props.card.description
  );
});

const onInput = () => {
  if (titleRef.value) editedTitle.value = titleRef.value.innerText;
  if (descRef.value) editedDesc.value = descRef.value.innerText;
};

const startEditing = () => {
  if (props.disabled) return;
  isEditing.value = true;
  nextTick(() => {
    titleRef.value?.focus();
  });
};

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
</script>

<style scoped lang="scss">
.board-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  cursor: grab;
  user-select: none;
  transition: box-shadow 0.2s;
  overflow: hidden;
  position: relative;
  
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

  &__title {
    font-weight: bold;
    font-size: 14px;
    color: var(--black-base);
    line-height: 1.4;
  }

  &__description {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-3);

    &--empty {
      font-weight: bold;
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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
