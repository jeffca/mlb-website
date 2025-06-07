<script setup>
import { ref, onMounted } from 'vue';

import PitcherStatsTable from './tables/PitcherStatsTable.vue';

// const teams = ref([]);
const strikeouts = ref([]);
const hits = ref([]);
const walks = ref([]);
const earnedRuns = ref([]);
const dateRange = ref(15);
const inputRange = ref(dateRange.value);

const fetchStat = async (stat) => {
  const res = await fetch(`http://localhost:3010/pitching/today/${stat}/last/${dateRange.value}`);
  return res.json();
};


const updateDateRangeAndAllMetrics = async (newRange) => {
  dateRange.value = newRange;
  try {
    hits.value = await fetchStat('h');
    strikeouts.value = await fetchStat('k');
    walks.value = await fetchStat('bb');
    earnedRuns.value = await fetchStat('er');
  } catch (error) {
    console.error('Error updating all metrics:', error);
  }
};


onMounted(async () => {
  updateDateRangeAndAllMetrics(dateRange.value);
});

</script>

<template>
    <div>
    <label>
      Date Range:
      <input v-model.number="inputRange" type="number" min="1" style="width: 4em;" />
    </label>
    <button @click="() => updateDateRangeAndAllMetrics(inputRange)">
      Update All Metrics
    </button>

        <PitcherStatsTable :stats="hits" :title="'hits'" />
        <PitcherStatsTable :stats="strikeouts" :title="'strikeouts'" />
        <PitcherStatsTable :stats="walks" :title="'walks'" />
        <PitcherStatsTable :stats="earnedRuns" :title="'ERs'" />
    </div>

</template>

<style scoped>
</style>