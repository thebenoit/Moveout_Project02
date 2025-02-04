import { jwtDecode } from 'jwt-decode';

const utils = {
    async get(endpoint) {

        try {
            let result = await fetch(`${import.meta.env.NOTIFICATION_SERVER_URL}/${endpoint}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }
            console.log("url: ", `${import.meta.env.NOTIFICATION_SERVER_URL}/${endpoint}`);
            return await result.json();
        } catch (error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
            return { error: error.message }; // Retourner un objet structuré
        }
    },
    async post(endpoint, body) {
        try {
            let result = await fetch(`${import.meta.env.NOTIFICATION_SERVER_URL}/${endpoint}`, {
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
    }
    ,
    logout() {
        sessionStorage.removeItem('auth');
    },
    setToken(token) {
        sessionStorage.setItem('auth', token);
    },
    getToken() {
        return sessionStorage.getItem('auth');
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
    }
}

export default utils;