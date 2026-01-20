const express = require('express');
const router = express.Router();
const Work = require('../models/Work');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// GET /api/works - Get all works
router.get('/', async (req, res) => {
    try {
        const works = await Work.find().sort({ dateAdded: -1 });
        res.json(works);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/works - Add new works (support multiple files)
router.post('/', upload.array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one file' });
        }

        const createdWorks = [];

        for (const file of req.files) {
            // Determine type based on mimetype
            const type = file.mimetype.startsWith('video/') ? 'video' : 'image';
            const imageUrl = file.path; // Cloudinary URL

            const work = new Work({
                title: req.body.title || 'Untitled', // Use title if provided, else default
                category: req.body.category || 'Wedding',
                imageUrl: imageUrl,
                type: type
            });

            const savedWork = await work.save();
            createdWorks.push(savedWork);
        }

        res.status(201).json(createdWorks);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/works/:id - Delete a work
router.delete('/:id', async (req, res) => {
    try {
        const work = await Work.findById(req.params.id);
        if (!work) return res.status(404).json({ message: 'Work not found' });

        // Delete image file from server
        // Note: With Cloudinary, we should delete using the public_id
        // const filename = work.imageUrl.split('/uploads/')[1];
        // const disconnectPath = path.join(__dirname, '..', 'uploads', filename);

        // Check if file exists before deleting
        // if (fs.existsSync(disconnectPath)) {
        //     fs.unlinkSync(disconnectPath);
        // }

        await work.deleteOne();
        res.json({ message: 'Work deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
