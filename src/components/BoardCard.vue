<template>
  <div
    class="board-card"
    :class="{ dragging: isDragging }"
    :draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @contextmenu.prevent="emitRemoveCard"
    @dblclick="startEditing"
  >
    <template v-if="!isEditing">
      <p class="text-bold text-black-base text-body-1">{{ card.title || "Untitled Card" }}</p>
      <p v-if="card.description">{{ card.description }}</p>
    </template>

    <template v-else>
      <div class="editable-fields">
        <div
          class="editable text-bold text-black-base text-body-1"
          contenteditable
          ref="titleRef"
          @input="onInput"
          @keydown.enter.prevent="save"
        >
          {{ editedTitle }}
        </div>
        <div
          class="editable text-bold text-black-base text-body-1"
          contenteditable
          ref="descRef"
          @input="onInput"
          @keydown.enter.prevent
        >
          {{ editedDesc }}
        </div>
      </div>
      <div class="actions">
        <button @click="save" :disabled="!hasChanges">Save Changes</button>
        <button @click="cancel">Cancel</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Card } from "@/modules/board/models/card";
import { dragManager } from "@/modules/board/services/dummiDrag";

const props = defineProps<{
  card: Card;
  columnId: string;
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
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
  cursor: grab;
  transition: box-shadow 0.2s;
  user-select: none;

  &.dragging {
    opacity: 0.5;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    background: #f9f9f9;
  }

  

  .editable-fields {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .editable {
    border: 1px solid #ddd;
    padding: 6px;
    border-radius: 4px;
    min-height: 24px;

    &:focus {
      outline: none;
      border-color: #999;
    }
  }

  

  .actions {
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
