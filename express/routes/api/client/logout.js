const express = require("express");
const app = express();
const {logout} = require("../../../mongo/interface/client")

const jwt = require("jsonwebtoken");
const User = require("../../../mongo/schemas/user");


module.exports =  app.post('logout', async(req, res) => {

    try{

       result = await logout(req,res);

       if(result.error){
        console.log('erreur dans le resultat du logout: ', result)
        return res.status(400).send(response);
       }

    }catch(error){
        console.log('erreur lors du post logout: ', error)
        res.status(500).send("Erreur lors du logout");

    }
})