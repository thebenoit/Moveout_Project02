import jwt from 'jsonwebtoken';
import express from 'express';
import User from '../../../mongo/schemas/user.js';
import utils from '../../../../vite-project/src/utils/utils.js';



const router = express.Router();

router.post('/refresh-token', async (req, res) => {
    const oldToken = req.headers.authorization?.split(' ')[1];
    
    if (!oldToken) {
      return res.status(401).json({ error: 'Token non fourni' });
    }

    try{
        const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);

        // Géneerer un nouveau token
        const newToken = generateToken(decoded.userId);

        res.json({token: newToken});

    }catch(error){
        res.status(401).json({error: 'Token invalide'});
    }


    
    
})
