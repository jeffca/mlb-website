<script setup>
import { defineProps, ref, computed } from 'vue'

const props = defineProps({
  stats: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const pageSize = 10;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.stats.length / pageSize));

const paginatedStats = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return props.stats.slice(start, start + pageSize);
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}
</script>

<template>
    <div class="container">
        <div class="title">{{ title }}</div>

        <table>
            <thead>
                <th>Team</th>
                <th>Opponent</th>
                <th>Avg</th>
            </thead>
        <tbody>
            <tr v-for="stat in paginatedStats" :key="stat.team">
            <td>{{ stat.team }}</td>
            <td>{{ stat.opponent }}</td>
            <td>{{ stat.metric_rate }}</td>
            </tr>
        </tbody>
        </table>
        <div style="margin-top: 1em;">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :disabled="currentPage === page"
            style="margin: 0 2px;"
        >
            {{ page }}
        </button>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
        </div>
    </div>

</template>

<style scoped>

    .container {
        margin: 0 auto;
        /* margin-right: 2%; */
    }

    .title {
        font-size: 18pt;
        text-align: center;
    }

    table {
        margin-top: 2%;
    }



</style>