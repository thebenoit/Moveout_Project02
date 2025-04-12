import { jwtDecode } from 'jwt-decode';

const utils = {
    async get(endpoint) {

        try {
            let result = await fetch(`${import.meta.env.VITE_NODE_SERVER_URL}/${endpoint}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }
            console.log("url: ", `${import.meta.env.VITE_NODE_SERVER_URL}/${endpoint}`);
            return await result.json();
        } catch (error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
            return { error: error.message }; // Retourner un objet structuré
        }
    },
    async post(endpoint, body) {
        try {
            let result = await fetch(`${import.meta.env.VITE_NODE_SERVER_URL}/${endpoint}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            // if (!result.ok) { // Vérifier si la réponse est OK
            //     throw new Error(`HTTP error! status: ${result.status}`);
            // }
            return await result.json(); // Assurez-vous d'attendre le JSON
        } catch (error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
            return { error: error.message }; // Retourner un objet structuré
        }
    },
    logout() {
        sessionStorage.removeItem('auth');
    },
    setToken(token) {
        sessionStorage.setItem('auth', token);
        // Stocker le timestamp d'expiration
        const decoded = this.decodeToken();
        if(decoded && decoded.exp){
            sessionStorage.setItem(
              'tokenExpiration',decoded.exp * 1000  
            )
        }
    },
    isTokenExpired(){
        const expiration = sessionStorage.getItem('tokenExpiration');
        if(!expiration) return true;
        return Date.now() >= parseInt(expiration);
    },
    getToken() {
        if(this.isTokenExpired()){
            this.logout();
            return null;
        }
        return sessionStorage.getItem('auth');
    },
    refreshToken: async () => {
        try{
            const response = await fetch(`${import.meta.env.VITE_NODE_SERVER_URL}/refresh-token`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('auth')}`,
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok){
                const {token} = await response.json();
                utils.setToken(token);
                return token;
            }
            return null;
        }catch(error){
            console.error('Erreur lors du rafraichissement du token: ', error);
            return null;
            
        }
    },
    decodeToken() {
        const token = this.getToken();
        if (token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                console.error('Error decoding token:', error);
                return null;
            }
        }
        return null;
    },
    getUserId(){
        const decoded = this.decodeToken();
        return decoded ? decoded.userId : null;
    },
    getEmail(){
        const decoded = this.decodeToken();
        return decoded ? decoded.email : null;
    }

    
}

export default utils;
