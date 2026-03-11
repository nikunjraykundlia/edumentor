/**
 * Generate a unique session ID: userId_subjectId_timestamp
 */
function generateSessionId(userId, subjectId) {
    return `${userId}_${subjectId}_${Date.now()}`;
}

module.exports = { generateSessionId };
