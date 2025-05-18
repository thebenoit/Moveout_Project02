<script setup>
import { ref } from "vue";
import utils from "../utils/utils_n8n";
import { useRouter } from "vue-router";


const chatMessage = ref("");

const sendMessage = async () => {
    console.log("Appuyer sur entrer");

    try {
        
        if(chatMessage.value.trim() === "") return;
        console.log("chatMessage.value:", chatMessage.value);

        console.log("Message envoyé:", chatMessage.value);

        const response = await utils.post(import.meta.env.VITE_TEST_CHATBOT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: chatMessage.value })
    });

    const data = await response;
    console.log(data);

    if(response.error) {
        console.error("Erreur lors de l'envoi du message:", response.error);
    }

    } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
    }
}
</script>

<template>
  <div class="col-12 col-md-8 col-lg-6">
    <div class="input-group shadow-sm rounded">
      <input
        type="text"
        class="form-control border-start-0"
        placeholder="Que cherchez-vous ?"
        v-model="chatMessage"
        @keyup.enter="sendMessage"
      />
      <span class="input-group-text bg-white border-end-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          
      </span>
    </div>
  </div>
</template>
