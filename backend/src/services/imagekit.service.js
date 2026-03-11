const ImageKit = require('imagekit');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload a file buffer to ImageKit.
 */
async function uploadToImageKit(fileBuffer, fileName, folder = '/notes') {
    const response = await imagekit.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: folder,
    });
    return {
        fileUrl: response.url,
        fileId: response.fileId,
        thumbnailUrl: response.thumbnailUrl || response.url,
    };
}

/**
 * Delete a file from ImageKit by fileId.
 */
async function deleteFromImageKit(fileId) {
    await imagekit.deleteFile(fileId);
}

/**
 * Get auth parameters for client-side upload (if needed).
 */
function getAuthParams() {
    return imagekit.getAuthenticationParameters();
}

module.exports = { uploadToImageKit, deleteFromImageKit, getAuthParams };
