<script setup>
import { ref, onMounted } from 'vue';

import BatterStatsTable from './tables/BatterStatsTable.vue';

// const teams = ref([]);
const strikeouts = ref([]);
const hits = ref([]);
const walks = ref([]);
const rbis = ref([]);
const dateRange = ref(7);
const inputRange = ref(dateRange.value);

const fetchStat = async (stat) => {
  const res = await fetch(`http://localhost:3010/batting/today/${stat}/top/50/last/${dateRange.value}`);
  return res.json();
};


const updateDateRangeAndAllMetrics = async (newRange) => {
  dateRange.value = newRange;
  try {
    hits.value = await fetchStat('h');
    strikeouts.value = await fetchStat('k');
    walks.value = await fetchStat('bb');
    rbis.value = await fetchStat('rbi');
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

        <BatterStatsTable :stats="hits" :title="'hits'" />
        <BatterStatsTable :stats="strikeouts" :title="'strikeouts'" />
        <BatterStatsTable :stats="walks" :title="'walks'" />
        <BatterStatsTable :stats="rbis" :title="'rbis'" />
    </div>

</template>

<style scoped>
</style>