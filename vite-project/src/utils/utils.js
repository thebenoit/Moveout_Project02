import { jwtDecode } from "jwt-decode";

const utils = {
  async get(endpoint, serverUrl) {
    try {
      // Déterminer l'URL du serveur selon le paramètre serverUrl
      let baseUrl;
      if (serverUrl === "chat") {
        // Pour les requêtes de chat, utiliser le port 8000
        baseUrl = "http://localhost:8000";
      } else {
        // Pour les autres requêtes, utiliser VITE_NODE_SERVER_URL
        baseUrl = import.meta.env.VITE_NODE_SERVER_URL;
      }

      console.log("URL de la requête GET:", `${baseUrl}/${endpoint}`);

      let result = await fetch(`${baseUrl}/${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          "Content-Type": "application/json",
        },
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
        baseUrl = "http://localhost:8000";
      } else {
        // Pour les autres requêtes, utiliser VITE_NODE_SERVER_URL
        baseUrl = import.meta.env.VITE_NODE_SERVER_URL;
      }

      console.log("URL de la requête:", `${baseUrl}/${endpoint}`);

      let result = await fetch(`${baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getSessionCookie()}`,
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
  logout() {
    console.log("logout...");
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("auth_expiration");
    sessionStorage.removeItem("temp_auth");
    sessionStorage.removeItem("temp_auth_expiration");
  },
  setToken(token, isTemp = false) {
    const storageKey = isTemp ? "temp_auth" : "auth";
    sessionStorage.setItem(storageKey, token);
    // Stocker le timestamp d'expiration
    /* const decoded = this.decodeToken();
    if (decoded && decoded.exp) {
      sessionStorage.setItem(`${storageKey}_expiration`, decoded.exp * 1000);
    }*/
  },
  isTokenExpired(isTemp = false) {
    console.log("isTokenExpired");
    const storageKey = isTemp ? "temp_auth" : "auth";
    const expiration = sessionStorage.getItem(`${storageKey}_expiration`);
    if (!expiration) return true;
    return Date.now() >= parseInt(expiration);
  },
  onlyGetToken() {
    const authToken = sessionStorage.getItem("auth");
    if (authToken && !this.isTokenExpired(false)) {
      console.log("Token valide");
      return authToken;
    }
    //sinon vérifier si le token temporaire est valide
    const tempToken = sessionStorage.getItem("temp_auth");
    if (tempToken && !this.isTokenExpired(true)) {
      console.log("Token temporaire valide");
      return tempToken;
    }
    console.log("Aucun token valide");

    return null;
  },
  getToken() {
    // Vérifier si le token est valide
    const authToken = sessionStorage.getItem("auth");

    if (authToken && !this.isTokenExpired(false)) {
      console.log("Token valide");
      return authToken;
    }
    //sinon vérifier si le token temporaire est valide
    const tempToken = sessionStorage.getItem("temp_auth");
    if (tempToken && !this.isTokenExpired(true)) {
      console.log("Token temporaire valide");
      return tempToken;
    }

    const result = this.initTempSession();
    return result;
  },

  async initTempSession() {
    console.log("initTempSession");
    try {
      //fetch la session temporaire
      const response = await fetch(
        `${import.meta.env.VITE_NODE_SERVER_URL}/api/jwt/session/temp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: "temp_" + Math.random().toString(36).substring(2, 15),
          }),
        }
      );
      //si la réponse est ok
      if (response.ok) {
        const { token } = await response.json();
        if (token) {
          //stock le token dans le storage
          sessionStorage.setItem("temp_auth", token);
          // Décode ici pour stocker l'expiration
          try {
            const decoded = jwtDecode(token);
            if (decoded && decoded.exp) {
              sessionStorage.setItem(
                "temp_auth_expiration",
                decoded.exp * 1000
              );
            }
          } catch (e) {
            console.error("Error decoding token in initTempSession:", e);
          }
          return token;
        }
      }
      return null;
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation de la session temporaire: ",
        error
      );
      return null;
    }
  },
  refreshToken: async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NODE_SERVER_URL}/jwt/refresh-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const { token } = await response.json();
        utils.setToken(token);
        return token;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors du rafraichissement du token: ", error);
      return null;
    }
  },
  decodeToken2(token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token in decodeToken2:", error);
      return null;
    }
  },
  decodeToken() {
    const token = this.getToken();

    //si le token est une chaine de caractères et qu'il est plus long que 0
    if (typeof token === "string" && token.length > 0) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }

    return null;
  },
  getUserId() {
    const decoded = this.decodeToken();
    return decoded ? decoded.userId : null;
  },
  getEmail() {
    const decoded = this.decodeToken();
    return decoded ? decoded.email : null;
  },
};

// Fonction utilitaire pour traiter les données de chat
export const processChatResponse = (data) => {
  // Si la réponse contient un tableau 'response', l'utiliser
  if (data && data.response && Array.isArray(data.response)) {
    return data.response;
  }

  // Si c'est directement un tableau de messages
  if (Array.isArray(data)) {
    return data;
  }

  // Si c'est un objet avec une propriété 'messages'
  if (data && data.messages && Array.isArray(data.messages)) {
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
    return [];
  }

  return messages.filter(validateMessage);
};

export default utils;
