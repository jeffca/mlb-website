<script setup>
  import TeamsBattingToday from '../components/TeamsBattingToday.vue'
  import PitchingToday from '../components/PitchingToday.vue'
  import BattingToday from '../components/BattingToday.vue'
</script>

<template>
    <h1>MLB Data 2025</h1>
    <div class="layout">
      <TeamsBattingToday />
      <PitchingToday />
      <BattingToday />
    </div>
</template>

<style scoped>
.layout {
  display: flex;
  justify-content: flex-start;
}

.layout > * {
  flex: 0 0 33.33%;  /* Each takes up 1/3 of the container */
  max-width: 33.33%;
  box-sizing: border-box;
}

</style>
