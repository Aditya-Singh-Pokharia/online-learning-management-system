const cloudinary = require('../config/cloudinary');

// Deletes a previously uploaded asset from Cloudinary by its publicId.
// Used whenever a course thumbnail or lecture video is replaced/deleted,
// so orphaned files don't pile up in Cloudinary storage.
const deleteAsset = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error(`Cloudinary delete failed for ${publicId}:`, error.message);
  }
};

module.exports = { deleteAsset };
