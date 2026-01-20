const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Seed default categories if empty
const seedCategories = async () => {
    try {
        const count = await Category.countDocuments();
        if (count === 0) {
            const defaults = ['Wedding', 'Reception', 'Engagement', 'Haldi', 'Pre-Wedding', 'Landing Page'];
            await Category.insertMany(defaults.map(name => ({ name })));
            console.log('Default categories seeded');
        }
    } catch (err) {
        console.error('Seeding error:', err);
    }
};
seedCategories();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create category
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
