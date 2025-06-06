<template>
  <main>
    <Board />
    <!-- <BoardCard
      :card="{
        id: '123',
        title: 'asd',
        description: 'asdsad',
        createdAt: new Date(),
      }"
      columnId="column.id"
    /> -->
  </main>
</template>
<script setup lang="ts">
import Board from "./components/Board.vue";
import BoardCard from "./components/BoardCard.vue";
</script>

<style scoped lang="scss">
main {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
