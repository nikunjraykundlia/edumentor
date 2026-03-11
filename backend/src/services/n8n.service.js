const axios = require('axios');

/**
 * Trigger n8n upload notes webhook.
 */
async function triggerUploadWebhook({ fileUrl, sessionId, subjectId }) {
    const response = await axios.post(process.env.N8N_UPLOAD_WEBHOOK, {
        fileUrl,
        sessionId,
        subjectId,
    });
    return response.data;
}

/**
 * Trigger n8n chat feature webhook.
 */
async function triggerChatWebhook({ chatInput, subject, sessionId }) {
    const CHAT_WEBHOOK_URL = 'https://nikunjn8n.up.railway.app/webhook/chatfeature';
    const response = await axios.post(CHAT_WEBHOOK_URL, {
        chatInput,
        subject,
        sessionId,
    });
    return response.data;
}

module.exports = { triggerUploadWebhook, triggerChatWebhook };
