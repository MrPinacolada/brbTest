<template>
  <button class="chip-button" v-bind="$attrs">
    <img
      v-if="props.icon"
      :src="getIconSrc(props.icon)"
      class="chip-img"
      alt="img"
    />
    <p class="text-black-base text-bold text-body-2">{{ props.label }}</p>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  icon?: string;
}

const props = defineProps<Props>();

const getIconSrc = (name?: string): string | undefined => {
  if (!name) return undefined;
  return new URL(`../../assets/icons/${name}.svg`, import.meta.url).href;
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
}
</style>
