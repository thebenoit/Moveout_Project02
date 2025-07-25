<script setup>
import { ref } from "vue";
import utils from "../../utils/utils_n8n";
import { useRouter } from "vue-router";

const props = defineProps({
  sessionId: {
    type: String,
    required: false,
  },
  messages: {
    type: Array,
    required: false,
  },
});

const chatMessage = ref("");

const sendMessage = async () => {
  console.log("Appuyer sur entrer");

  try {
    if (chatMessage.value.trim() === "") return;

    props.messages.push({
      text: chatMessage.value,
      isUser: true,
      timestamp: new Date().toISOString(),
    });
 
    
    const response = await utils.post(import.meta.env.VITE_TEST_CHATBOT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: chatMessage.value,
        sessionId: props.sessionId,
      }),
    });

     // Effacer le message
    chatMessage.value = "";

    const data = await response;
    console.log(data);
    props.messages.push({
      text: data.message,
      isUser: false,
      timestamp: new Date().toISOString(),
    });

    if (response.error) {
      console.error("Erreur lors de l'envoi du message:", response.error);
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
  }
};
</script>

<template>
  <div class="">
    <div class="input-group shadow-sm rounded">
      <input
        type="text"
        class="input"
        placeholder="Que cherchez-vous?"
        v-model="chatMessage"
        @keyup.enter="sendMessage"
      />
    </div>
  </div>
</template>
