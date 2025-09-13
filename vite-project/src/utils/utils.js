

const utils = {
  async get(endpoint, serverUrl) {
    try {
      // Déterminer l'URL du serveur selon le paramètre serverUrl
      let baseUrl;
      if (serverUrl === "chat") {
        // Pour les requêtes de chat, utiliser le port 8000
        baseUrl = import.meta.env.VITE_LLM_AGENT_ENDPOINT;
      } else {
        // Pour les autres requêtes, utiliser VITE_NODE_SERVER_URL
        baseUrl = import.meta.env.VITE_NODE_SERVER_URL;
      }

      console.log("URL de la requête GET:", `${baseUrl}/${endpoint}`);

      let result = await fetch(`${baseUrl}/${endpoint}`, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${this.getToken()}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Capturer le status code avant de vérifier result.ok
      const status = result.status;
      const statusText = result.statusText;

      if (!result.ok) {
        const error = new Error(`HTTP error! status: ${result.status}`);
        error.status = status;
        error.statusText = statusText;
        throw error;
      }

      return await result.json();
    } catch (error) {
      console.log(
        "There has been a problem with your fetch operation: ",
        error.message
      );

      // Retourner un objet structuré avec le status code
      return {
        error: error.message,
        status: error.status || null,
        statusText: error.statusText || null,
      };
    }
  },
  async post(endpoint, body, serverUrl) {
    try {
      // Déterminer l'URL du serveur selon le paramètre serverUrl
      let baseUrl;
      if (serverUrl === "chat") {
        // Pour les requêtes de chat, utiliser le port 8000
        baseUrl = import.meta.env.VITE_LLM_AGENT_ENDPOINT;
      } else {
        // Pour les autres requêtes, utiliser VITE_NODE_SERVER_URL
        baseUrl = import.meta.env.VITE_NODE_SERVER_URL;
      }

      console.log("URL de la requête:", `${baseUrl}/${endpoint}`);

      let result = await fetch(`${baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${this.getSessionCookie()}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      // Capturer le status code avant de parser le JSON
      const status = result.status;
      const statusText = result.statusText;

      const responseData = await result.json();

      // Vérifier si la réponse contient une erreur
      if (responseData.error) {
        const error = new Error(responseData.message || responseData.error);
        error.status = status;
        error.statusText = statusText;
        throw error;
      }

      return responseData; // Retourner les données si pas d'erreur
    } catch (error) {
      console.log(
        "There has been a problem with your post operation: ",
        error.message
      );

      // Retourner un objet structuré avec le status code
      return {
        error: error.message,
        status: error.status || null,
        statusText: error.statusText || null,
      };
    }
  },
  getSessionCookie() {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "session_id") {
        console.log("session_id trouvée dans le cookie ");
        return value;
      }
    }
    return null;
  },
  async logout() {
    try {
      console.log("Tentative de déconnexion...");

      const response = await fetch(
        import.meta.env.VITE_NODE_SERVER_URL + "/api/client/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Réponse du serveur:", response.status, response.statusText);

      if (response.ok) {
        console.log("Déconnexion réussie côté serveur");
      } else {
        console.log("Erreur côté serveur:", response.status);
      }

      // Nettoyer les cookies côté client de toute façon
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth;";
      document.cookie =
        "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Nettoyer le stockage local
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("temp_auth");
      sessionStorage.removeItem("auth_expiration");
      sessionStorage.removeItem("temp_auth_expiration");

      console.log("Déconnexion terminée côté client");
    } catch (error) {
      console.log("Erreur lors du logout: ", error);

      // En cas d'erreur, nettoyer quand même côté client
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth;";
      document.cookie =
        "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("temp_auth");
      sessionStorage.removeItem("auth_expiration");
      sessionStorage.removeItem("temp_auth_expiration");
    }
  },
  loginWithGoogle() {
    const baseUrl = import.meta.env.VITE_NODE_SERVER_URL;
    window.location.href = `${baseUrl}/api/client/auth/google`;
  },
  async isLoggedInViaChat() {
    try {
      const result = await this.get("user/info", "chat");
      return { isAuthenticated: result && !result.error };
    } catch (error) {
      console.error("isLoggedInViaChat error:", error);
      return { isAuthenticated: false, error };
    }
  },
};

// Fonction utilitaire pour traiter les données de chat
export const processChatResponse = (data) => {
  // Si la réponse contient un tableau 'response', l'utiliser
  if (data && data.response && Array.isArray(data.response)) {
    console.log(
      "data est un objet possedant une propriété response qui est un tableau"
    );
    return data.response;
  }

  // Si c'est directement un tableau de messages
  if (Array.isArray(data)) {
    console.log("data est un tableau");
    return data;
  }

  // Si c'est un objet avec une propriété 'messages'
  if (data && data.messages && Array.isArray(data.messages)) {
    console.log("messages est un tableau possedant des messages");
    return data.messages;
  }

  // Fallback : retourner un tableau vide
  return [];
};

// Fonction pour valider la structure d'un message
export const validateMessage = (message) => {
  return (
    message &&
    typeof message.role === "string" &&
    typeof message.content === "string" &&
    (message.role === "user" || message.role === "assistant")
  );
};

// Fonction pour nettoyer et valider un historique de messages
export const validateChatHistory = (messages) => {
  if (!Array.isArray(messages)) {
    console.log("messages n'est pas un tableau");
    return [];
  }

  return messages.filter(validateMessage);
};

export default utils;

