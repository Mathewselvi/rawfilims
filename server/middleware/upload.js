const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Verify config
console.log("Cloudinary Config Check:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Set" : "Missing");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'rawfilims',
            resource_type: 'auto', // Handle images/videos automatically
            public_id: file.originalname.split('.')[0] + '-' + Date.now(), // Unique filename
        };
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100 // 100MB limit
    }
});

module.exports = upload;
