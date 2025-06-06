<template>
  <button
    class="chip-button"
    :class="[props.disabled ? `chip-button--disabled` : '']"
    @click="handleClick"
  >
    <img
      v-if="props.icon"
      :src="getIconSrc(props.icon)"
      class="chip-img"
      alt="img"
    />
    <p class="text-black-base text-bold text-body-2">{{ props.label }}</p>
    <slot name="sub-label"/>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  icon?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const getIconSrc = (name?: string): string | undefined => {
  if (!name) return undefined;
  return new URL(`../../assets/icons/${name}.svg`, import.meta.url).href;
};

const handleClick = () => {
  if (props.disabled) return;
  emit("click");
};
</script>

<style scoped lang="scss">
.chip-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 4px 4px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.05);
  border-radius: 50px;
  background: white;
  width: fit-content;
  max-width: 140px;
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
  .chip-img {
    max-width: 13.33px;
    max-height: 13.33px;
    margin-bottom: -2px;
  }
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
