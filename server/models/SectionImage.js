const mongoose = require('mongoose');

const sectionImageSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true, // 'hero', 'about', 'services', 'contact'
        enum: ['hero', 'about', 'services', 'contact', 'about-content']
    },
    imageUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SectionImage', sectionImageSchema);
