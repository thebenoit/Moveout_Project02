

import express from 'express';
const router = express.Router();
import axios from 'axios';
import messages from '../../../mongo/interface/messages.js';

// Configuration du webhook N8N
const N8N_WEBHOOK_URL = process.env.N8N_TEST_WEBHOOK_URL; // À remplacer par l'URL réelle de votre webhook N8N

/**
 * Route POST pour recevoir les messages du front-end et les transférer à N8N
 * @route POST /api/chat/message
 * @param {string} req.body.message - Le message envoyé depuis l'input du front-end
 * @returns {Object} Réponse indiquant le statut de l'opération
 */
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;

    console.log("message réçu",message);
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Le message est requis' });
    }
    


    const messageData = {
      sessionId: message.sessionId,
      content: message.content,
      type: message.type,
      status: message.status
    }
   
    // Traite le message
    const messageTraite = await messages.traiterMessage(messageData);
    console.log("message traite: ",messageTraite);

    // Envoi du message au webhook N8N
    const response = await axios.post(N8N_WEBHOOK_URL, {
      message: messageTraite,
      timestamp: new Date().toISOString(),
      source: 'chat-application'
    });





    
    return res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès à N8N',
      n8nResponse: response.data
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message à N8N:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'envoi du message à N8N',
      details: error.message
    });
  }
});

export default router;
