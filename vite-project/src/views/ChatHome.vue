<script setup>
import { ref } from 'vue';
import utils from '../utils/utils';

// Référence pour le message de chat
const chatMessage = ref('');
// Référence pour stocker les messages
const messages = ref([]);
// État de chargement
const isLoading = ref(false);
// Gestion des erreurs
const error = ref(null);

/**
 * Envoie un message au serveur via l'API chat
 */
const sendMessage = async () => {
  if (!chatMessage.value.trim()) return;
  
  try {
    isLoading.value = true;
    error.value = null;
    
    // Ajouter le message à la liste locale
    messages.value.push({
      text: chatMessage.value,
      isUser: true,
      timestamp: new Date().toISOString()
    });
    
    // Appel à l'API en utilisant l'utilitaire
    const response = await utils.post('api/chat/message', {
      message: chatMessage.value
    });
    
    if (response.error) {
      error.value = response.error;
      console.error('Erreur lors de l\'envoi du message:', response.error);
    } else {
      // Ajouter la réponse du serveur si disponible
      if (response.n8nResponse) {
        messages.value.push({
          text: response.n8nResponse,
          isUser: false,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Réinitialiser le champ de saisie
    chatMessage.value = '';
  } catch (err) {
    error.value = err.message;
    console.error('Erreur inattendue:', err);
  } finally {
    isLoading.value = false;
  }
};


</script>

<template>
  <div>
    <Section>
      <div class="chat-container flex flex-col ">
        <div class="flex-grow-1"></div>
      </div>
    </Section>
    <section class="chat-container flex flex-col ">
      <div class="flex-grow-1"></div>

      <div class="chat-container flex flex-col">
        <div class="d-flex justify-content-center align-items-center">
          <div class="input-group mb-3 w-75">
            <input
              type="text"
              class="form-control"
              placeholder="Textez ici"
              aria-label="Search"
              aria-describedby="basic-addon1"
              v-model="chatMessage"
              @keyup.enter="sendMessage"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
