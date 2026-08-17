const cloudinary = require('cloudinary').v2;

// Central Cloudinary configuration, loaded once and reused everywhere
// a file needs to be uploaded (thumbnails, lecture videos, etc.)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
