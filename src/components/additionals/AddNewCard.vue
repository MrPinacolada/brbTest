<template>
  <button class="add-button" :disabled="disabled" @click="addCard">
    <span class="add-button__content">
      <img :src="addIcon" alt="add" />
      <p class="text-bold text-body-2">New Card</p>
    </span>
  </button>
</template>

<script setup lang="ts">
import { Card } from '@/modules/board/models/card'
import addIconUrl from '@/assets/icons/add.svg'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'add', card: Card): void
}>()

const addIcon = addIconUrl

function addCard() {
  const newCard = new Card()
  emit('add', newCard)
}
</script>

<style scoped lang="scss">
.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 32px;
  padding: 12px;
  background-color: var(--gray-2);
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--gray-3);
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 7px;

    img {
      max-width: 13.33px;
      max-height: 13.33px;
      margin-bottom: -2px;
    }
  }
}
</style>
