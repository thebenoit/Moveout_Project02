const utils = {
    async get(endpoint) {
        try {
            let result = await fetch(`${import.meta.env.VITE_NODE_SERVER_URL}/${endpoint}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`,
                    'Content-Type': 'application/json'
                }
            })
            console.log("url:  ",`${import.meta.env.VITE_NODE_SERVER_URL}/${endpoint}` )
            return await result.json()
        }
        catch (error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
            return error
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
            })
            return result //await result.json()
        }
        catch (error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
            return error
        }
    },
    logout() {
        sessionStorage.removeItem('auth');
    },
    setToken(token) {
        sessionStorage.setItem('auth', token);
    },
    getToken() {
        return sessionStorage.getItem('auth');
    }
}

export default utils