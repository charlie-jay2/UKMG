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
    res.redirect('/');
});

// Show form to edit a ward
router.get('/:id/edit', async (req, res) => {
    const ward = await Ward.findById(req.params.id);
    res.render('wards/edit', { ward });
});

// Update ward with confirmation code
router.put('/:id', async (req, res) => {
    const { name, availableBeds, activeStaff, confirmationCode } = req.body;

    // Check if confirmation code matches
    if (confirmationCode !== process.env.CONFIRMATION_CODE) {
        return res.status(403).send("Invalid confirmation code. Update not allowed.");
    }

    try {
        const updatedWard = await Ward.findByIdAndUpdate(
            req.params.id,
            {
                name,
                availableBeds,
                activeStaff: activeStaff.split(',').map(s => s.trim()) // clean up staff list
            },
            { new: true }
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating ward.");
    }
});

module.exports = router;
