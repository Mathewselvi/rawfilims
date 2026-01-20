const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Wedding', 'Reception', 'Engagement', 'Haldi', 'Pre-Wedding', 'Landing Page', 'All'],
        default: 'Wedding',
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        default: 'image',
    },
    imageUrl: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Work', workSchema);
