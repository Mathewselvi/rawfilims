const express = require('express');
const router = express.Router();
const SectionImage = require('../models/SectionImage');
const upload = require('../middleware/upload'); // Assuming this exists from previous context
const fs = require('fs');
const path = require('path');

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

        const imageUrl = `/uploads/${req.file.filename}`;

        // Check if section exists
        let sectionImage = await SectionImage.findOne({ section });

        if (sectionImage) {
            // Delete old image file if it exists (optional, good for cleanup)
            const oldPath = path.join(__dirname, '..', sectionImage.imageUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

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
