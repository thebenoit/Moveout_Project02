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
          <div v-if="message.role === 'assistant'" class="avatar">
            <div class="assistant-avatar">AI</div>
          </div>
          <div
            :class="[
              'message-content',
              message.role === 'user' ? 'user-message' : 'assistant-message',
            ]"
          >
            <div class="message-text">{{ message.content }}</div>
          </div>
          <div v-if="message.role === 'user'" class="avatar">
            <div class="user-avatar">U</div>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="message-wrapper assistant-wrapper">
        <div class="message-container">
          <div class="avatar">
            <div class="assistant-avatar">AI</div>
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
        @keydown.enter.prevent="sendMessage"
        placeholder="Décrivez votre appartement idéal..."
        class="message-input"
        rows="1"
        ref="inputRef"
      ></textarea>
      <button @click="sendMessage" class="send-button" :disabled="isLoading">
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
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from "vue";
import utils from "../utils/utils.js";
import { processChatResponse, validateChatHistory } from "../utils/utils.js";

const emit = defineEmits(["auth-error"]);

const messages = ref([]);
const inputMessage = ref("");
const messagesContainer = ref(null);
const inputRef = ref(null);
const isLoading = ref(false);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Fonction pour charger l'historique des messages
const loadChatHistory = async () => {
  try {
    isLoading.value = true;
    const response = await utils.get("chat", "chat");

    // Utiliser la fonction utilitaire pour traiter la réponse
    const processedMessages = processChatResponse(response);
    const validatedMessages = validateChatHistory(processedMessages);

    messages.value = validatedMessages;
  } catch (error) {
    console.error("Erreur lors du chargement de l'historique:", error);
    if (error.message && error.message.includes("401")) {
      emit("auth-error");
    }
  } finally {
    isLoading.value = false;
  }
};

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = inputMessage.value.trim();

  // Ajouter le message utilisateur
  messages.value.push({
    role: "user",
    content: userMessage,
  });

  inputMessage.value = "";

  // Activer le loading IMMÉDIATEMENT
  isLoading.value = true;

  await scrollToBottom();

  try {
    const response = await utils.post(
      "chat",
      {
        messages: messages.value, // Envoyer tout l'historique
      },
      "chat"
    );

    if (response.error) {
      messages.value.push({
        role: "assistant",
        content: `Erreur: ${response.error}`,
      });
    } else {
      // Utiliser la fonction utilitaire pour traiter la réponse
      const processedMessages = processChatResponse(response);

      if (processedMessages.length > 0) {
        // Si le serveur retourne un nouvel historique complet, le remplacer
        const validatedMessages = validateChatHistory(processedMessages);
        messages.value = validatedMessages;
      } else {
        // Sinon, ajouter juste la nouvelle réponse
        messages.value.push({
          role: "assistant",
          content: response.content || response.message || "Réponse reçue",
        });
      }
    }
  } catch (error) {
    // Vérifier si c'est une erreur 401 (Token manquant)
    if (error.message && error.message.includes("401")) {
      emit("auth-error");
    } else {
      messages.value.push({
        role: "assistant",
        content: `Erreur: ${error.message}`,
      });
    }
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

// Charger l'historique au montage du composant
onMounted(() => {
  loadChatHistory();
});

// Scroll automatique quand de nouveaux messages arrivent
watch(
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  max-width: 768px;
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
