<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MetricsChart from "../components/MetricsChart.vue";

const router = useRouter();

// État des données
const loading = ref(true);
const error = ref(null);
const summary = ref(null);
const recentJobs = ref([]);
const performance = ref(null);
const timeline = ref([]);
const timeRange = ref(24); // heures

// URL de l'API backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Récupère les métriques depuis l'API
 */
const fetchMetrics = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Appel parallèle des 4 endpoints
    const [summaryRes, jobsRes, perfRes, timelineRes] = await Promise.all([
      fetch(`${API_URL}/api/metrics/workflow/summary?hours=${timeRange.value}`),
      fetch(`${API_URL}/api/metrics/workflow/recent-jobs?limit=10`),
      fetch(
        `${API_URL}/api/metrics/workflow/performance?hours=${timeRange.value}`
      ),
      fetch(
        `${API_URL}/api/metrics/workflow/timeline?hours=${timeRange.value}&interval_minutes=60`
      ),
    ]);

    if (!summaryRes.ok || !jobsRes.ok || !perfRes.ok || !timelineRes.ok) {
      throw new Error("Erreur lors de la récupération des métriques");
    }

    const summaryData = await summaryRes.json();
    const jobsData = await jobsRes.json();
    const perfData = await perfRes.json();
    const timelineData = await timelineRes.json();

    summary.value = summaryData.data;
    recentJobs.value = jobsData.data;
    performance.value = perfData.data;
    timeline.value = timelineData.data;
  } catch (err) {
    console.error("Erreur:", err);
    error.value =
      "Impossible de charger les métriques. Vérifiez que le backend est démarré.";
  } finally {
    loading.value = false;
  }
};

// Charger les métriques au montage
onMounted(() => {
  fetchMetrics();
});

// Rafraîchir quand on change la période
const changeTimeRange = (hours) => {
  timeRange.value = hours;
  fetchMetrics();
};

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Formater la durée
const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}m ${secs}s`;
};
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <!-- Header -->
    <div class="navbar bg-base-100 shadow-lg">
      <div class="flex-1">
        <h1 class="text-2xl font-bold ml-4">📊 Dashboard Métriques</h1>
      </div>
      <div class="flex-none gap-2">
        <!-- Sélecteur de période -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost">
            {{ timeRange }}h
            <svg
              class="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"
          >
            <li><a @click="changeTimeRange(1)">1 heure</a></li>
            <li><a @click="changeTimeRange(6)">6 heures</a></li>
            <li><a @click="changeTimeRange(24)">24 heures</a></li>
            <li><a @click="changeTimeRange(168)">7 jours</a></li>
          </ul>
        </div>

        <!-- Bouton rafraîchir -->
        <button class="btn btn-ghost" @click="fetchMetrics" :disabled="loading">
          <svg
            class="w-5 h-5"
            :class="{ 'animate-spin': loading }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="container mx-auto p-6">
      <!-- Message d'erreur -->
      <div v-if="error" class="alert alert-error mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ error }}</span>
      </div>

      <!-- Loading -->
      <div
        v-if="loading && !summary"
        class="flex justify-center items-center h-64"
      >
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- Contenu principal -->
      <div v-else-if="summary">
        <!-- Cartes de statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- Total Jobs -->
          <div class="stats shadow bg-base-100">
            <div class="stat">
              <div class="stat-figure text-primary">
                <svg
                  class="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <div class="stat-title">Total Jobs</div>
              <div class="stat-value text-primary">
                {{ summary.total_jobs }}
              </div>
              <div class="stat-desc">Dernières {{ timeRange }}h</div>
            </div>
          </div>

          <!-- Taux de succès -->
          <div class="stats shadow bg-base-100">
            <div class="stat">
              <div class="stat-figure text-success">
                <svg
                  class="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div class="stat-title">Taux de succès</div>
              <div class="stat-value text-success">
                {{ summary.success_rate }}%
              </div>
              <div class="stat-desc">
                {{ summary.successful_jobs }} réussis /
                {{ summary.failed_jobs }} échoués
              </div>
            </div>
          </div>

          <!-- Durée moyenne -->
          <div class="stats shadow bg-base-100">
            <div class="stat">
              <div class="stat-figure text-info">
                <svg
                  class="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div class="stat-title">Durée moyenne</div>
              <div class="stat-value text-info">
                {{ formatDuration(summary.avg_duration_seconds) }}
              </div>
              <div class="stat-desc">Par job</div>
            </div>
          </div>

          <!-- Total listings -->
          <div class="stats shadow bg-base-100">
            <div class="stat">
              <div class="stat-figure text-secondary">
                <svg
                  class="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </div>
              <div class="stat-title">Listings trouvés</div>
              <div class="stat-value text-secondary">
                {{ summary.total_listings }}
              </div>
              <div class="stat-desc">Total</div>
            </div>
          </div>
        </div>

        <!-- Graphiques de tendances -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Graphique Jobs -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <MetricsChart
                :timeline-data="timeline"
                title="📊 Tendance des Jobs"
                metric="jobs"
              />
            </div>
          </div>

          <!-- Graphique Durée -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <MetricsChart
                :timeline-data="timeline"
                title="⏱️ Durée Moyenne d'Exécution"
                metric="duration"
              />
            </div>
          </div>

          <!-- Graphique Listings -->
          <div class="card bg-base-100 shadow-xl lg:col-span-2">
            <div class="card-body">
              <MetricsChart
                :timeline-data="timeline"
                title="🏠 Nombre de Listings Trouvés"
                metric="listings"
              />
            </div>
          </div>
        </div>

        <!-- Performance par étape -->
        <div v-if="performance" class="card bg-base-100 shadow-xl mb-6">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4">⚡ Performance par étape</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Session Check -->
              <div class="stat bg-base-200 rounded-lg">
                <div class="stat-title">Vérification Session</div>
                <div class="stat-value text-sm">
                  {{
                    formatDuration(
                      performance.session_check?.avg_duration_seconds || 0
                    )
                  }}
                </div>
                <div class="stat-desc">
                  {{ performance.session_check?.count || 0 }} checks
                </div>
              </div>

              <!-- Google Places -->
              <div class="stat bg-base-200 rounded-lg">
                <div class="stat-title">Google Places API</div>
                <div class="stat-value text-sm">
                  {{
                    formatDuration(
                      performance.google_places?.avg_duration_seconds || 0
                    )
                  }}
                </div>
                <div class="stat-desc">
                  {{ performance.google_places?.count || 0 }} appels
                </div>
              </div>

              <!-- OnePage Enrich -->
              <div class="stat bg-base-200 rounded-lg">
                <div class="stat-title">Enrichissement OnePage</div>
                <div class="stat-value text-sm">
                  {{
                    formatDuration(
                      performance.onepage_enrich?.avg_duration_seconds || 0
                    )
                  }}
                </div>
                <div class="stat-desc">
                  {{ performance.onepage_enrich?.count || 0 }} enrichissements
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Jobs récents -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4">📋 Jobs récents</h2>
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Date</th>
                    <th>Durée</th>
                    <th>Listings</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="job in recentJobs" :key="job.job_id">
                    <td>
                      <code class="text-xs"
                        >{{ job.job_id?.substring(0, 12) }}...</code
                      >
                    </td>
                    <td>{{ formatDate(job.timestamp) }}</td>
                    <td>{{ formatDuration(job.duration_seconds) }}</td>
                    <td>
                      <span class="badge badge-primary">{{
                        job.listings_count
                      }}</span>
                    </td>
                    <td>
                      <span v-if="job.success" class="badge badge-success"
                        >✓ Succès</span
                      >
                      <span
                        v-else
                        class="badge badge-error"
                        :title="job.error_message"
                        >✗ Échec</span
                      >
                    </td>
                  </tr>
                  <tr v-if="recentJobs.length === 0">
                    <td colspan="5" class="text-center text-gray-500">
                      Aucun job récent
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
