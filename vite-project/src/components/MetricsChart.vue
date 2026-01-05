<script setup>
import { ref, watch, computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  timelineData: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "Timeline des métriques",
  },
  metric: {
    type: String,
    default: "jobs", // 'jobs', 'duration', 'listings'
  },
});

// Formater les données pour Chart.js
const chartData = computed(() => {
  if (!props.timelineData || props.timelineData.length === 0) {
    return {
      labels: [],
      datasets: [],
    };
  }

  // Extraire les labels (timestamps)
  const labels = props.timelineData.map((item) => {
    const date = new Date(item.timestamp);
    return date.toLocaleString("fr-CA", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  // Configurer les datasets selon la métrique choisie
  let datasets = [];

  if (props.metric === "jobs") {
    datasets = [
      {
        label: "Jobs réussis",
        data: props.timelineData.map((item) => item.successful_jobs),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Jobs échoués",
        data: props.timelineData.map((item) => item.failed_jobs),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ];
  } else if (props.metric === "duration") {
    datasets = [
      {
        label: "Durée moyenne (secondes)",
        data: props.timelineData.map((item) => item.avg_duration_seconds),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ];
  } else if (props.metric === "listings") {
    datasets = [
      {
        label: "Listings trouvés",
        data: props.timelineData.map((item) => item.total_listings),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ];
  }

  return {
    labels,
    datasets,
  };
});

// Options du graphique
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: true,
      text: props.title,
      font: {
        size: 16,
        weight: "bold",
      },
      padding: {
        bottom: 20,
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
}));
</script>

<template>
  <div class="chart-container">
    <div v-if="timelineData && timelineData.length > 0" class="relative h-80">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="flex items-center justify-center h-80 text-gray-500">
      <div class="text-center">
        <svg
          class="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
        <p class="text-lg">Aucune donnée à afficher</p>
        <p class="text-sm mt-2">
          Les graphiques apparaîtront une fois que des jobs seront traités
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  position: relative;
}
</style>
