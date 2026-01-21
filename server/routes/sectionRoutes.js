const express = require('express');
const router = express.Router();
const SectionImage = require('../models/SectionImage');
const upload = require('../middleware/upload'); // Assuming this exists from previous context
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Get all section images
router.get('/', async (req, res) => {
    try {
        const images = await SectionImage.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update or Create section image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { section } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Cloudinary URL
        const imageUrl = req.file.path;

        // Check if section exists
        let sectionImage = await SectionImage.findOne({ section });

        if (sectionImage) {
            // Delete old image file if it exists
            const oldUrl = sectionImage.imageUrl;

            if (oldUrl.includes('cloudinary.com')) {
                // Extract public_id from URL
                const parts = oldUrl.split('/');
                const filenameWithExtension = parts.pop();
                const folder = parts.pop(); // 'rawfilims'
                const publicId = `${folder}/${filenameWithExtension.split('.')[0]}`;

                // Sections are images usually, but could be video? Assuming image for now as it says 'image' field
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (cloudErr) {
                    console.error('Cloudinary Delete Error:', cloudErr);
                }
            } else {
                // Legacy local file
                // oldUrl is like '/uploads/filename.jpg'
                if (oldUrl.startsWith('/uploads/')) {
                    const filename = oldUrl.split('/uploads/')[1];
                    const oldPath = path.join(__dirname, '..', 'uploads', filename);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            }

            sectionImage.imageUrl = imageUrl;
            await sectionImage.save();
        } else {
            sectionImage = new SectionImage({
                section,
                imageUrl
            });
            await sectionImage.save();
        }

        res.status(200).json(sectionImage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
