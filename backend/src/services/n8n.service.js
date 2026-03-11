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
    const response = await axios.post(process.env.N8N_CHAT_WEBHOOK, {
        chatInput,
        subject,
        sessionId,
    });
    return response.data;
}

module.exports = { triggerUploadWebhook, triggerChatWebhook };
