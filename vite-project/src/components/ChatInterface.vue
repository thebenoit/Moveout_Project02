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
                <div class="job-status-card">
                  <div v-if="message.loading" class="job-spinner"></div>
                  <div class="job-status-text">{{ message.text }}</div>
                </div>
              </template>
              <template
                v-else-if="
                  message.type === 'listings' && Array.isArray(message.listings)
                "
              >
                <ListingsSlider :listings="message.listings" layout="grid" />
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

    <!-- Input -->
    <div class="input-field-container">
      <textarea
        v-model="inputMessage"
        @keydown.enter.prevent="sendMessageStream"
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
          Vous avez atteint vos 3 recherches gratuites.
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
import { ref, nextTick, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import utils from "../utils/utils.js";
import { processChatResponse, validateChatHistory } from "../utils/utils.js";
import ListingsSlider from "@/components/ListingsSlider.vue";

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
const eventSource = ref(null);
const jobEventSource = ref(null);
const isStreaming = ref(false);
const streamingMessageIndex = ref(-1);
const lastAttemptedMessage = ref("");
const showLimitModal = ref(false);
const router = useRouter();

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

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
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
        console.log("Démarrage du job", data);
        const text = data?.payload?.message || "Démarrage du scraping";
        messages.value.push({
          role: "assistant",
          type: "job_status",
          text,
          loading: true,
        });
        nextTick(scrollToBottom);
      } else if (data.event === "progress") {
        console.log("Progression du job", data);
        const text = data?.payload?.message || "Scraping en cours…";
        // Met à jour le dernier message job_status si présent
        for (let i = messages.value.length - 1; i >= 0; i--) {
          const m = messages.value[i];
          if (m && m.type === "job_status") {
            m.text = text;
            break;
          }
        }
      } else if (data.event === "completed") {
        console.log("Job terminé", data);
        const raw = data?.payload?.listings || [];
        const listings = normalizeListings(raw);
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
        nextTick(scrollToBottom);
        jobEventSource.value.close();
        jobEventSource.value = null;
      } else if (data.event === "error") {
        console.log("Erreur lors du job");
        for (let i = messages.value.length - 1; i >= 0; i--) {
          const m = messages.value[i];
          if (m && m.type === "job_status") {
            m.loading = false;
            m.text = "Erreur lors du scraping";
            break;
          }
        }
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
        console.log("Données reçues:", data);
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

          scrollToBottom();
        } else if (data.type === "job" && data.job_id) {
          JobSSE(data.job_id);
        } else if (data.type === "tool_end" && data.tool === "search_listing") {
          const status = data.result?.status;
          const jobId = data.result?.job_id;
          if ((status === "queued" || status === "processing") && jobId) {
            JobSSE(jobId);
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

  await scrollToBottom();

  connectToSSE(userMessage);
};

// Charger l'historique au montage du composant
onMounted(() => {
  connectToSSE(messages.value[messages.value.length - 1].content);
});

// Scroll automatique quand de nouveaux messages arrivent
watch(
  () => props.messages,
  (newVal) => {
    messages.value = newVal;
    scrollToBottom();
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
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
</style>
