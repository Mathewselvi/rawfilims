const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

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
        // Determine resource type based on mimetype
        const isVideo = file.mimetype.startsWith('video/');
        return {
            folder: 'rawfilims',
            resource_type: isVideo ? 'video' : 'image',
            public_id: Date.now() + '-' + file.originalname.replace(/\s+/g, '-').split('.')[0], // custom filename without extension
        };
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100 // 100MB limit (increased for videos)
    }
});

module.exports = upload;
