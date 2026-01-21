const express = require('express');
const router = express.Router();
const Work = require('../models/Work');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

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
            // Cloudinary URL is available in file.path
            const imageUrl = file.path;

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
        console.error("Upload Error:", err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/works/:id - Delete a work
router.delete('/:id', async (req, res) => {
    try {
        const work = await Work.findById(req.params.id);
        if (!work) return res.status(404).json({ message: 'Work not found' });

        // Check if it's a Cloudinary URL
        if (work.imageUrl.includes('cloudinary.com')) {
            // Extract public_id from URL
            // URL example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/rawfilims/filename.jpg
            const parts = work.imageUrl.split('/');
            const filenameWithExtension = parts.pop();
            const folder = parts.pop(); // 'rawfilims'
            const publicId = `${folder}/${filenameWithExtension.split('.')[0]}`;

            const resourceType = work.type === 'video' ? 'video' : 'image';

            try {
                await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
            } catch (cloudErr) {
                console.error('Cloudinary Delete Error:', cloudErr);
                // Continue to delete from DB even if cloud delete fails
            }
        } else {
            // Legacy: local file deletion
            try {
                // Note: 'work.imageUrl' is like '/uploads/filename.jpg'
                if (work.imageUrl.startsWith('/uploads/')) {
                    const filename = work.imageUrl.split('/uploads/')[1];
                    const disconnectPath = path.join(__dirname, '..', 'uploads', filename);
                    if (fs.existsSync(disconnectPath)) {
                        fs.unlinkSync(disconnectPath);
                    }
                }
            } catch (fsErr) {
                console.error("Local Delete Error:", fsErr);
            }
        }

        await work.deleteOne();
        res.json({ message: 'Work deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
