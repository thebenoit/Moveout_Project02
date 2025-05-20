<script setup>
import { ref, onMounted } from "vue";
import utils from "../utils/utils";
import Searchbar from "../components/Searchbar.vue";
import TitreAleatoire from "../components/TitreAleatoire.vue";
// Référence pour le message de chat
const chatMessage = ref("");
// Référence pour stocker les messages
const messages = ref([]);
// État de chargement
const isLoading = ref(false);
// Gestion des erreurs
const error = ref(null);

const sessionInfo = ref({
  sessionId: null,
  isTemp: false,
  iat: null,
  exp: null,
});

const initSession = async () => {
  try {
    const token = await utils.getToken();
    if (!token) {
      console.error("Impossible d'obtenir un token");
      return;
    } else {
      console.log("Token obtenu:", token);
    }

    const decoded = utils.decodeToken();
    sessionInfo.value.isTemp = decoded?.isTemp || false;
    sessionInfo.value.sessionId = decoded?.sessionId || null;
    sessionInfo.value.iat = decoded?.iat || null;
    sessionInfo.value.exp = decoded?.exp || null;

    console.log("decoded:", decoded);

    if (decoded) {
      await loadMessages(decoded.sessionId || decoded.userId);
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la session:", error);
  }
};

const loadMessages = async (id) => {
  try {
    console.log("Chargement des messages pour l'id:", id);
  } catch (error) {
    console.error("Erreur lors du chargement des messages:", error);
  }
};

onMounted(async () => {
  await initSession();
});

/**
 * Envoie un message au serveur via l'API chat
 */
const sendMessage = async () => {
  if (!chatMessage.value.trim()) return;

  try {
    isLoading.value = true;
    error.value = null;

    //  if(utils.isTokenExpired()){
    //   try{
    //     const newToken = await utils.refreshToken();
    //     if(!newToken){

    //     }

    //   }catch(error){

    //   }
    //  }

    // Ajouter le message à la liste locale
    messages.value.push({
      text: chatMessage.value,
      isUser: true,
      timestamp: new Date().toISOString(),
    });

    // Appel à l'API en utilisant l'utilitaire
    const response = await utils.post("api/chat/message", {
      message: chatMessage.value,
      sessionId: sessionInfo.value.sessionId,
    });

    if (response.error) {
      error.value = response.error;
      console.error("Erreur lors de l'envoi du message:", response.error);
    } else {
      // Ajouter la réponse du serveur si disponible
      if (response.n8nResponse) {
        messages.value.push({
          text: response.n8nResponse,
          isUser: false,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Réinitialiser le champ de saisie
    chatMessage.value = "";
  } catch (err) {
    error.value = err.message;
    console.error("Erreur inattendue:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container-fluid min-vh-100 d-flex flex-column">
    <section
      class="row flex-grow-1 justify-content-center align-items-center p-4"
    >
      <!-- <TitreAleatoire /> -->
      <Searchbar :sessionId="sessionInfo.sessionId" />
    </section>
  </div>
</template>
