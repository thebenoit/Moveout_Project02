const utils = {
    async get(endpoint) {
        try {
            let result = await fetch(`${import.meta.env.VITE_NODE_SERVER_URL}/${endpoint}`)
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
    }
}

export default utils