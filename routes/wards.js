const express = require('express');
const router = express.Router();
const Ward = require('../models/Ward');

// Show all wards
router.get('/', async (req, res) => {
    try {
        const wards = await Ward.find();
        res.render('index', { wards, patients: [] });  // Pass wards to index.ejs
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching wards.");
    }
});

// Show form to create a new ward
router.get('/new', (req, res) => {
    res.render('wards/new');
});

// Create a new ward
router.post('/', async (req, res) => {
    const { name, availableBeds, activeStaff } = req.body;
    const newWard = new Ward({ name, availableBeds, activeStaff });
    await newWard.save();
    res.redirect('/wards');
});

// Show form to edit a ward
router.get('/:id/edit', async (req, res) => {
    const ward = await Ward.findById(req.params.id);
    res.render('wards/edit', { ward });
});

// Update ward
router.put('/:id', async (req, res) => {
    const { name, availableBeds, activeStaff } = req.body;
    const updatedWard = await Ward.findByIdAndUpdate(req.params.id, { name, availableBeds, activeStaff }, { new: true });
    res.redirect('/wards');
});

module.exports = router;
