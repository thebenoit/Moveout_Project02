import express from "express";
const app = express();
import client from "../../../mongo/interface/client.js";

import jwt from "jsonwebtoken";
import User from "../../../mongo/schemas/user.js";


app.post('logout', async(req, res) => {

    try{

       result = await client.logout(req,res);

       if(result.error){
        console.log('erreur dans le resultat du logout: ', result)
        return res.status(400).send(response);
       }

    }catch(error){
        console.log('erreur lors du post logout: ', error)
        res.status(500).send("Erreur lors du logout");

    }
})

export default app;
