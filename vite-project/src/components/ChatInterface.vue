<template>
  <div class="chat-container">
    <!-- Messages -->
    <div class="messages-container" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'message-wrapper',
          message.role === 'user' ? 'user-wrapper' : 'assistant-wrapper',
        ]"
      >
        <div class="message-container">
          <div
            :class="[
              'message-content',
              message.role === 'user' ? 'user-message' : 'assistant-message',
            ]"
          >
            <div
              :class="[
                'message-text',
                {
                  'streaming-text':
                    isStreaming && streamingMessageIndex === index,
                },
              ]"
            >
              <template v-if="message.type === 'job_status'">
                <div
                  v-if="!loadingSkeletonItems.length"
                  class="job-status-card"
                >
                  <div v-if="message.loading" class="job-spinner"></div>
                  <div class="job-status-text">{{ message.text }}</div>
                </div>
                <div style="margin-top: 12px">
                  <div class="progress-wrap">
                    <div class="progress-track">
                      <div
                        class="progress-bar"
                        :style="{ width: progressPercent + '%' }"
                      ></div>
                    </div>
                  </div>
                  <div v-if="stageHistory.length" class="progress-stages">
                    <transition-group name="stage-fade" tag="div">
                      <div
                        v-for="item in stageHistory"
                        :key="item.id"
                        class="progress-stage"
                      >
                        <span class="stage-dot"></span>
                        <span class="stage-text">{{ item.text }}</span>
                      </div>
                    </transition-group>
                  </div>
                  <LoadingListings
                    v-if="loadingSkeletonItems.length"
                    :items="loadingSkeletonItems"
                    :showText="true"
                    :gap="isMobile ? 12 : 16"
                    :size="isMobile ? 72 : 96"
                    :shineDuration="isMobile ? 1.2 : 1.8"
                  />
                </div>
              </template>
              <template
                v-else-if="
                  message.type === 'listings' && Array.isArray(message.listings)
                "
              >
                <ListingsSlider :listings="message.listings" layout="grid" />
              </template>
              <template
                v-else-if="message.type === 'job_error' && showErrorMessage"
              >
                <div class="job-error-card">
                  <div class="job-error-icon">⚠️</div>
                  <div class="job-error-text">{{ message.text }}</div>
                </div>
              </template>
              <template v-else-if="message.type === 'job_info'">
                <div class="job-info-card">
                  <div class="job-info-dot"></div>
                  <div class="job-info-text">{{ message.text }}</div>
                </div>
              </template>
              <template v-else>
                {{ message.content }}
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="message-wrapper assistant-wrapper">
        <div class="message-container">
          <div class="avatar">
            <!-- <div class="assistant-avatar">AI</div> -->
          </div>
          <div class="message-content assistant-message">
            <div class="loading-container">
              <div class="loading-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero (title, subtitle, floating filters) shown until first user message -->
    <div v-if="showHero" class="hero-wrap">
      <h1 class="text-4xl font-bold text-black text-center mb-4">
        Trouvez enfin un appart sans galère.
      </h1>
      <p
        class="text-gray-600 text-center mb-8 max-w-2xl"
        style="margin: 0 auto"
      >
        Moveout votre assistant cherche sur internet à votre place pour trouver
        les annonces qui vous correspondent.
      </p>
      <div class="w-full max-w-2xl" style="margin: 0 auto">
        <!-- First Row -->
        <div class="flex flex-wrap gap-3 mb-4 justify-center">
          <button
            @click="addFilter('+ 2 chambres')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + 2 chambres
          </button>
          <button
            @click="addFilter('+ balcon')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + balcon
          </button>
          <button
            @click="addFilter('+ proche métro')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + proche métro
          </button>
        </div>
        <!-- Second Row -->
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            @click="addFilter('+ 800€ max')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + 800€ max
          </button>
          <button
            @click="addFilter('+ 50m²')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + à cotée de l'Udem
          </button>
          <button
            @click="addFilter('+ ascenseur')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + pas trop cher
          </button>
          <button
            @click="addFilter('+ parking')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + à Madrid
          </button>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="input-field-container">
      <textarea
        v-model="inputMessage"
        @keydown.enter.prevent="sendMessageStream"
        @focus="scrollToLastMessage(true)"
        placeholder="Décrivez votre appartement idéal..."
        class="message-input"
        rows="1"
        ref="inputRef"
      ></textarea>
      <button
        @click="sendMessageStream"
        class="send-button"
        :disabled="isLoading"
      >
        <svg
          v-if="!isLoading"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
        <div v-else class="button-loading">
          <div class="spinner"></div>
        </div>
      </button>
    </div>

    <!-- Modal: Limite quotidienne atteinte -->
    <div
      v-if="showLimitModal"
      class="modal-overlay"
      @click="showLimitModal = false"
    >
      <div class="limit-modal" @click.stop>
        <div class="limit-icon">
          <div class="limit-icon-circle">!</div>
        </div>
        <h3 class="limit-title">Limite quotidienne atteinte</h3>
        <p class="limit-subtitle">
          Vous avez atteint vos {{ FREE_LIMIT }} recherches gratuites.
        </p>
        <p class="limit-text">
          Réessayez demain ou passez en Premium pour un accès illimité.
        </p>
        <div class="limit-actions">
          <button class="btn muted" @click="showLimitModal = false">
            Plus tard
          </button>
          <button class="btn contrast" @click="goToPricing">
            Voir Premium
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import utils from "../utils/utils.js";
import { processChatResponse, validateChatHistory } from "../utils/utils.js";
import ListingsSlider from "@/components/ListingsSlider.vue";
import LoadingListings from "@/components/loading_listings.vue";

const emit = defineEmits(["auth-error"]);

const props = defineProps({
  messages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const messages = ref(props.messages);
const inputMessage = ref("");
const messagesContainer = ref(null);
const inputRef = ref(null);
const isLoading = ref(props.loading);
const loadingSkeletonItems = ref([]);
const isMobile = ref(false);
const progressPercent = ref(0);
let progressTimer = null;
const eventSource = ref(null);
const jobEventSource = ref(null);
const isStreaming = ref(false);
const streamingMessageIndex = ref(-1);
const lastAttemptedMessage = ref("");
const showLimitModal = ref(false);
const router = useRouter();
const FREE_LIMIT = 10;
const showErrorMessage = ref(false);
const stageHistory = ref([]);
const emptyStageShown = ref(false);

const showHero = computed(
  () => !messages.value.some((m) => m && m.role === "user")
);

const addFilter = (filter) => {
  if (!inputMessage.value.includes(filter)) {
    inputMessage.value =
      (inputMessage.value ? inputMessage.value + " " : "") + filter;
    nextTick(() => {
      if (inputRef.value) inputRef.value.focus();
    });
  }
};

const goToPricing = () => {
  router.push({ name: "pricing" });
};

// Mettre à jour isLoading si la prop change
watch(
  () => props.loading,
  (val) => {
    isLoading.value = val;
  },
  { immediate: true }
);

const scrollToLastMessage = async (smooth = false) => {
  await nextTick();
  const container = messagesContainer.value;
  if (!container) return;
  const lastChild = container.lastElementChild;
  if (lastChild && typeof lastChild.scrollIntoView === "function") {
    lastChild.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  } else {
    container.scrollTop = container.scrollHeight;
  }
};

// Normalise les listings pour le composant ListingsSlider
const normalizeListings = (items) => {
  const arr = Array.isArray(items) ? items : [];
  return arr.map((item, idx) => {
    const images = Array.isArray(item.images)
      ? item.images
          .map((img) => {
            if (typeof img === "string") return { src: img, alt: "" };
            if (img && typeof img === "object") {
              if (img.src) return { src: img.src, alt: img.alt || "" };
              if (img.url) return { src: img.url, alt: img.alt || "" };
            }
            return null;
          })
          .filter((x) => x && x.src)
      : [];

    return {
      id: String(item.id ?? `listing_${idx}`),
      title: item.title ?? item.name ?? "Annonce",
      price: item.price ?? item.price_text ?? "",
      bedrooms: item.bedrooms ?? item.nb_bedrooms ?? null,
      bathrooms: item.bathrooms ?? item.nb_bathrooms ?? null,
      // Expose full description for modal/details view
      description:
        item.description ?? item.full_description ?? item.summary ?? "",
      url: item.url ?? item.link ?? "#",
      images,
      location:
        (item.location && (item.location.city || item.location)) ||
        item.city ||
        "",
      neighborhood: item.neighborhood ?? item.area,
    };
  });
};
const JobSSE = (jobId) => {
  console.log("Démarrage du Job SSE:", jobId);
  if (jobEventSource.value) {
    jobEventSource.value.close();
  }
  const url = `${
    import.meta.env.VITE_LLM_AGENT_ENDPOINT
  }/events/jobs/${encodeURIComponent(jobId)}`;
  jobEventSource.value = new EventSource(url, {
    withCredentials: true,
  });

  // message.value.push({role:"assistant",content:""})

  jobEventSource.value.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (!data || !data.event) return;

      if (data.event === "start") {
        showErrorMessage.value = false;
        stageHistory.value = [];
        emptyStageShown.value = false;
        console.log("Démarrage du job", data);
        const text = data?.payload?.message || "Démarrage du scraping";
        messages.value.push({
          role: "assistant",
          type: "job_status",
          text,
          loading: true,
        });
        stageHistory.value = [
          {
            stage: "start",
            text,
            id: `start-${Date.now()}`,
          },
        ];
        nextTick(() => scrollToLastMessage());
        // reset progress and start gentle auto-increment
        progressPercent.value = 5;
        if (progressTimer) clearInterval(progressTimer);
        progressTimer = setInterval(() => {
          // Ease towards 90% max during loading
          if (progressPercent.value < 90) {
            progressPercent.value += Math.max(
              0.5,
              (90 - progressPercent.value) * 0.03
            );
          }
        }, 500);
      } else if (data.event === "progress") {
        if (showErrorMessage.value) return;
        console.log("Progression du job", data);
        const text = data?.payload?.message || "Scraping en cours…";

        // 1) S'assurer qu'un message job_status existe
        let hasJobStatus = false;
        for (let i = messages.value.length - 1; i >= 0; i--) {
          const m = messages.value[i];
          if (m && m.type === "job_status") {
            hasJobStatus = true;
            break;
          }
        }
        if (!hasJobStatus) {
          messages.value.push({
            role: "assistant",
            type: "job_status",
            text,
            loading: true,
          });
          // Démarre la barre si pas encore lancée
          if (!progressTimer) {
            progressPercent.value = Math.max(progressPercent.value || 5, 5);
            progressTimer = setInterval(() => {
              if (progressPercent.value < 90) {
                progressPercent.value += Math.max(
                  0.5,
                  (90 - progressPercent.value) * 0.03
                );
              }
            }, 500);
          }
          nextTick(() => scrollToLastMessage());
        }

        // 2) Mettre à jour le texte du dernier job_status
        for (let i = messages.value.length - 1; i >= 0; i--) {
          const m = messages.value[i];
          if (m && m.type === "job_status") {
            m.text = text;
            break;
          }
        }

        // 3) Skeletons + progression
        if (data?.payload?.status === "listing_loading") {
          const titre = data?.payload?.title || "Annonce";
          const sr = data?.payload?.image || "";
          const url = data?.payload?.url || undefined;
          loadingSkeletonItems.value = [
            ...loadingSkeletonItems.value,
            { titre, sr, url },
          ];
          progressPercent.value = Math.min(90, progressPercent.value + 2);
          nextTick(() => scrollToLastMessage(true));
        }

        const stage = data?.payload?.stage;
        const stageMsg = data?.payload?.message;
        if (stage && stageMsg) {
          const existingIndex = stageHistory.value.findIndex(
            (s) => s.stage === stage
          );
          const entry = {
            stage,
            text: stageMsg,
            id: `${stage}-${Date.now()}`,
          };
          if (existingIndex !== -1) {
            const updated = [...stageHistory.value];
            updated[existingIndex] = entry;
            stageHistory.value = updated;
          } else {
            const updated = [...stageHistory.value, entry];
            if (updated.length > 5) {
              updated.shift();
            }
            stageHistory.value = updated;
          }

          if (stage === "empty" && !emptyStageShown.value) {
            emptyStageShown.value = true;
            messages.value.push({
              role: "assistant",
              type: "job_info",
              text: stageMsg,
            });
            nextTick(() => scrollToLastMessage(true));
          }
        }
      } else if (data.event === "completed") {
        showErrorMessage.value = false;
        const raw = data?.payload?.listings || [];
        const listings = normalizeListings(raw);
        if (!emptyStageShown.value && (!listings || listings.length === 0)) {
          emptyStageShown.value = true;
          const emptyMsg = "Aucune annonce trouvée pour l'instant";
          stageHistory.value = [
            {
              stage: "empty",
              text: emptyMsg,
              id: `empty-${Date.now()}`,
            },
          ];
          messages.value.push({
            role: "assistant",
            type: "job_info",
            text: emptyMsg,
          });
        } else if (!emptyStageShown.value) {
          stageHistory.value = [
            {
              stage: "completed",
              text: "Résultats prêts",
              id: `completed-${Date.now()}`,
            },
          ];
        }
        console.log("Job terminé", data);
        // Finalise le statut
        for (let i = messages.value.length - 1; i >= 0; i--) {
          const m = messages.value[i];
          if (m && m.type === "job_status") {
            m.loading = false;
            m.text = "Scraping terminé";
            break;
          }
        }
        messages.value.push({ role: "assistant", type: "listings", listings });
        // Clear skeletons when real listings arrive
        loadingSkeletonItems.value = [];
        // complete the progress bar
        progressPercent.value = 100;
        setTimeout(() => {
          progressPercent.value = 0;
          if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
          }
        }, 600);
        nextTick(() => scrollToLastMessage());
        jobEventSource.value.close();
        jobEventSource.value = null;
      } else if (data.event === "error") {
        console.log("Erreur lors du job: ", data.event);
        showErrorMessage.value = true;
        for (let i = messages.value.length - 1; i >= 0; i--) {
          const m = messages.value[i];
          if (m && m.type === "job_status") {
            m.loading = false;
            m.text = "Erreur lors du scraping";
            break;
          }
        }
        loadingSkeletonItems.value = [];
        progressPercent.value = 0;
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }
        const errorText =
          data?.payload?.message ||
          data?.payload?.status ||
          "Une erreur est survenue pendant la recherche.";
        messages.value.push({
          role: "assistant",
          type: "job_error",
          text: errorText,
        });
        stageHistory.value = [];
        emptyStageShown.value = false;
        nextTick(() => scrollToLastMessage(true));
      }
    } catch (e) {
      console.error("Erreur parsing job SSE:", e);
    }
  };

  jobEventSource.value.onerror = () => {
    console.error("Erreur SSE job");
    if (jobEventSource.value) jobEventSource.value.close();
    jobEventSource.value = null;
  };
};
const connectToSSE = (text) => {
  if (eventSource.value) {
    //Fermer la connexion précédente si elle existe
    eventSource.value.close();
  }
  lastAttemptedMessage.value = text;
  const url = `${
    import.meta.env.VITE_LLM_AGENT_ENDPOINT
  }/chat/stream?message=${encodeURIComponent(text)}`;
  eventSource.value = new EventSource(url, {
    withCredentials: true,
  });

  let streamText = "";

  // Ajouter un message assistant vide pour le streaming
  const assistantMessageIndex = messages.value.length;

  messages.value.push({
    role: "assistant",
    content: "",
  });

  // Activer le mode streaming
  isStreaming.value = true;
  streamingMessageIndex.value = assistantMessageIndex;

  eventSource.value.onopen = () => {
    console.log("Connexion SSE ouverte");
  };
  eventSource.value.onmessage = (event) => {
    if (event.on_chat_model_stream) {
      console.log("Event: ", event);
    }
  };
  eventSource.value.onerror = (event) => {
    console.error("Erreur SSE:", event);
    eventSource.value.close();
    isLoading.value = false;
    isStreaming.value = false;
    streamingMessageIndex.value = -1;

    fetch(`${import.meta.env.VITE_LLM_AGENT_ENDPOINT}/user/info`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          emit("auth-error");
          messages.value = [];
          return { handled: true };
        }
        return { handled: false };
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
      })
      .then(async (res) => {
        if (res && res.handled) return;
        // Diagnostic rapide pour détecter 402 (limite atteinte)
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 1500);
          const probe = await fetch(
            `${
              import.meta.env.VITE_LLM_AGENT_ENDPOINT
            }/chat/stream?message=${encodeURIComponent(
              lastAttemptedMessage.value || "test"
            )}`,
            {
              method: "GET",
              credentials: "include",
              headers: { Accept: "text/event-stream" },
              signal: controller.signal,
            }
          );
          clearTimeout(timer);
          if (probe.status === 402) {
            showLimitModal.value = true;
          }
        } catch (e) {
          // ignorer timeout/abort
        }
      });

    if (
      messages.value[assistantMessageIndex] &&
      !messages.value[assistantMessageIndex].content
    ) {
      messages.value[assistantMessageIndex].content =
        "Désolé, une erreur s'est produite lors de la génération de la réponse. Veuillez réessayer.";
    }
  };

  eventSource.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    try {
      if (data && data.type === "[DONE]") {
        console.log("Fin de la conversation");
        eventSource.value.close();
        isLoading.value = false;
        isStreaming.value = false;
        streamingMessageIndex.value = -1;
        return;
      }

      if (data) {
        if (data.type === "content") {
          // Dès qu'on reçoit du contenu, on arrête le loading et on passe en streaming
          if (isLoading.value) {
            isLoading.value = false;
          }

          streamText += data.content;

          // Mettre à jour le message assistant avec le contenu accumulé
          if (messages.value[assistantMessageIndex]) {
            messages.value[assistantMessageIndex].content = streamText;
          }

          scrollToLastMessage();
        } else if (data.type === "job" && data.job_id) {
          JobSSE(data.job_id);
        } else if (data.type === "tool_end" && data.tool === "search_listing") {
          const status = data.result?.status;
          const jobId = data.result?.job_id;
          if ((status === "queued" || status === "processing") && jobId) {
            JobSSE(jobId);
          } else {
            console.log("Job id non trouvée");
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors du parsing des données SSE:", error);
    }
  };
};

const sendMessageStream = async () => {
  if (!inputMessage.value.trim() || isLoading.value || isStreaming.value)
    return;

  const userMessage = inputMessage.value.trim();

  // Fermer toute connexion SSE existante
  if (eventSource.value) {
    eventSource.value.close();
    isStreaming.value = false;
    streamingMessageIndex.value = -1;
  }

  // Ajouter le message utilisateur
  messages.value.push({
    role: "user",
    content: userMessage,
  });

  inputMessage.value = "";

  // Activer le loading IMMÉDIATEMENT
  isLoading.value = true;

  await scrollToLastMessage();

  connectToSSE(userMessage);
};

// Charger l'historique au montage du composant
onMounted(() => {
  const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 768;
    scrollToLastMessage();
  };
  updateIsMobile();
  window.addEventListener("resize", updateIsMobile);
  if (messages.value && messages.value.length > 0) {
    const last = messages.value[messages.value.length - 1];
    if (last && typeof last.content === "string" && last.content.trim()) {
      connectToSSE(last.content);
    }
  }
  // Cleanup resize listener on unmount
});

// Ensure cleanup
import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  const updateIsMobile = () => {};
  window.removeEventListener("resize", updateIsMobile);
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
});

// Scroll automatique quand de nouveaux messages arrivent
watch(
  () => props.messages,
  (newVal) => {
    messages.value = newVal;
    scrollToLastMessage();
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
.progress-wrap {
  padding: 0 6px 10px 6px;
}
.progress-track {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
  width: 0%;
  transition: width 300ms ease;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(var(--vh, 1vh) * 100);
  background: white;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Messages */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  padding-bottom: 140px;
}

.message-wrapper {
  padding: 16px 0;
  border-bottom: none;
  animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-wrapper {
  background: white;
}

.assistant-wrapper {
  background: white;
}

.message-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 12px;
}

.avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-avatar {
  background: #007aff;
  color: white;
}

.assistant-avatar {
  background: #34c759;
  color: white;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.user-message {
  display: flex;
  justify-content: flex-end;
}

.assistant-message {
  display: flex;
  justify-content: flex-start;
}

.message-text {
  line-height: 1.6;
  font-size: 16px;
  color: #333;
  white-space: pre-wrap;
  padding: 12px 0;
  border-radius: 0;
  max-width: 100%;
  word-wrap: break-word;
}

.user-message .message-text {
  background-color: #f0f0f0;
  color: #333;
  border-radius: 18px;
  border-bottom-right-radius: 4px;
  padding: 12px 16px;
  max-width: 70%;
  box-shadow: none;
  border: none;
}

.assistant-message .message-text {
  background-color: transparent;
  color: #333;
  border-radius: 0;
  padding: 12px 0;
  max-width: 100%;
  box-shadow: none;
  border: none;
}

/* Job status card */
.job-status-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
}

.job-spinner {
  width: 18px;
  height: 18px;
  border: 3px solid #ddd;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.job-status-text {
  color: #333;
  font-size: 14px;
}

/* Effet de frappe pour le streaming - désactivé */
.streaming-text {
  position: relative;
}

/* Loading animation */
.loading-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  max-width: 70%;
  border: none;
  box-shadow: none;
}

.loading-text {
  font-size: 14px;
  color: #333;
  font-style: italic;
  margin-bottom: 8px;
}

.loading-dots {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  background: #666;
  border-radius: 50%;
  animation: loading 1.4s infinite ease-in-out;
  opacity: 0.8;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Hero centered and spaced */
.hero-wrap {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1rem;
  width: 100%;
  max-width: 1000px;
  z-index: 5;
}
.hero-wrap h1 {
  margin: 0;
}
.hero-wrap p {
  margin: 0;
  max-width: 600px;
  text-align: center;
}
/* Adjust filter rows spacing */
.hero-wrap .flex.wrap {
  gap: 1rem;
  margin: 0;
}
/* Input-row separation when hero disappears */
.input-field-container {
  margin-top: 0.5rem;
}

/* Input */
.input-field-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 768px;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.message-input {
  flex: 1;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  padding: 20px 24px;
  padding-right: 60px;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  outline: none;
  font-family: inherit;
  min-height: 100px;
  max-height: 200px;
  background: white;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-input:focus {
  border-color: #007aff;
}

.message-input::placeholder {
  color: #999;
}

.send-button {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 40px;
  height: 40px;
  border: 2px solid #333;
  border-radius: 50%;
  background: white;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 5;
}

.send-button:hover {
  background: #333;
  color: white;
}

.send-button:disabled {
  background: #f5f5f5;
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Modal limite atteinte */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 9999;
}
.limit-modal {
  background: #fff;
  color: #111;
  width: 90%;
  max-width: 420px;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-align: center;
}
.limit-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.limit-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
}
.limit-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.limit-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
}
.limit-text {
  color: #444;
  line-height: 1.6;
}
.limit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
}
.btn {
  width: auto;
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #111;
  background: #fff;
  color: #111;
}
.btn.muted {
  background: #f5f5f5;
  color: #333;
  border-color: #e5e5e5;
}
.btn.contrast {
  background: #111;
  color: #fff;
}

/* Floating animation for filter buttons */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}
button[class*="px-4 py-2 bg-gray-100"] {
  animation: float 3s ease-in-out infinite;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(1) {
  animation-delay: 0s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(2) {
  animation-delay: 0.5s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(3) {
  animation-delay: 1s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(4) {
  animation-delay: 1.5s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(5) {
  animation-delay: 2s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(6) {
  animation-delay: 2.5s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(7) {
  animation-delay: 3s;
}

/* Responsive */
@media (max-width: 768px) {
  .chat-container {
    height: 100vh;
  }

  .message-container {
    padding: 0 16px;
  }

  .input-container {
    padding: 16px;
  }

  .input-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .message-container {
    padding: 0 12px;
  }

  .input-container {
    padding: 12px;
  }
}

.job-error-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fff7f5;
  border-radius: 12px;
  border: 1px solid rgba(255, 86, 48, 0.2);
  box-shadow: none;
}

.job-error-icon {
  font-size: 18px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 86, 48, 0.12);
  color: #d6412a;
}

.job-error-text {
  color: #b22915;
  font-size: 15px;
  line-height: 1.4;
  font-weight: 600;
}

.job-info-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.job-info-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
}

.job-info-text {
  font-size: 14px;
  color: #334155;
}

.progress-stages {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.progress-stage {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
}

.stage-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  opacity: 0.75;
  animation: stagePulse 2s ease-in-out infinite;
}

.stage-text {
  line-height: 1.3;
}

.stage-fade-enter-active,
.stage-fade-leave-active {
  transition: all 200ms ease;
}
.stage-fade-enter-from,
.stage-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@keyframes stagePulse {
  0%,
  100% {
    opacity: 0.65;
  }
  50% {
    opacity: 1;
  }
}

@keyframes jobErrorPulse {
  0% {
    transform: translateY(0);
    box-shadow: 0 8px 20px rgba(255, 86, 48, 0.06);
  }
  50% {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(255, 86, 48, 0.1);
  }
  100% {
    transform: translateY(0);
    box-shadow: 0 8px 20px rgba(255, 86, 48, 0.06);
  }
}
</style>
