import { jwtDecode } from "jwt-decode";


const utils = {
  async get(endpoint) {
    try {
      let result = await fetch(
        `${import.meta.env.VITE_N8N_WEBHOOK}/${endpoint}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!result.ok) { 
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      console.log(
        "url: ",
        `${import.meta.env.VITE_N8N_WEBHOOK}/${endpoint}`
      );
      return await result.json();
    } catch (error) {
      console.log(
        "There has been a problem with your fetch operation: ",
        error.message
      );
      return { error: error.message }; // Retourner un objet structuré
    }
  },
  async post(endpoint, body) {
    try {
      let result = await fetch(
        `${import.meta.env.VITE_N8N_WEBHOOK}/${endpoint}`,
        {
          method: "POST",
          headers: {
            //Authorization: `Bearer ${this.getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      // if (!result.ok) { // Vérifier si la réponse est OK
      //     throw new Error(`HTTP error! status: ${result.status}`);
      // }
      return await result.json(); // Assurez-vous d'attendre le JSON
    } catch (error) {
      console.log(
        "There has been a problem with your fetch operation: ",
        error.message
      );
      return { error: error.message }; // Retourner un objet structuré
    }
  },
  logout() {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("auth_expiration");
    sessionStorage.removeItem("temp_auth");
    sessionStorage.removeItem("temp_auth_expiration");
  },
  setToken(token, isTemp = false) {
    const storageKey = isTemp ? "temp_auth" : "auth";
    sessionStorage.setItem(storageKey, token);
    // Stocker le timestamp d'expiration
    const decoded = this.decodeToken();
    if (decoded && decoded.exp) {
      sessionStorage.setItem(`${storageKey}_expiration`, decoded.exp * 1000);
    }
  },
  isTokenExpired(isTemp = false) {
    console.log("isTokenExpired");
    const storageKey = isTemp ? "temp_auth" : "auth";
    const expiration = sessionStorage.getItem(`${storageKey}_expiration`);
    if (!expiration) return true;
    return Date.now() >= parseInt(expiration);
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

    return this.initTempSession();
  },

  async initTempSession() {
    try {
      const response = await fetch(
        `${import.meta.env.N8N_WEBHOOK}/jwt/session/temp`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: "temp_" + Math.random().toString(36).substring(2, 15),
          }),
        }
      );
      if (response.ok) {
        const { token } = await response.json();
        this.setToken(token, true);
        return token;
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
        `${import.meta.env.N8N_WEBHOOK}/jwt/refresh-token`,
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
  decodeToken() {
    const token = this.getToken();
    if (token) {
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

export default utils;
