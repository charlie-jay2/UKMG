const express = require('express');
const router = express.Router();
const WaitTime = require('../models/WaitTime');

// Route to create the WaitTime document if it doesn't exist
router.post('/create', async (req, res) => {
    try {
        const { minors, majors } = req.body;

        // Check if the document exists first
        const existingWaitTime = await WaitTime.findOne();

        if (!existingWaitTime) {
            await WaitTime.create({
                minors: minors || 0,
                majors: majors || 0
            });
            console.log('WaitTime document created');
        }

        res.redirect('/');  // Redirect to the home page to see the changes
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to get the current WaitTime document
router.get('/current', async (req, res) => {
    try {
        const waitTime = await WaitTime.findOne();
        if (waitTime) {
            res.json(waitTime);
        } else {
            res.status(404).json({ message: 'Wait time data not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Route to update the existing WaitTime document
router.post('/update', async (req, res) => {
    try {
        const { minors, majors } = req.body;

        const waitTime = await WaitTime.findOne();

        if (waitTime) {
            waitTime.minors = minors || waitTime.minors;
            waitTime.majors = majors || waitTime.majors;
            await waitTime.save();
            console.log('WaitTime document updated');
        }

        res.redirect('/');  // Redirect to the home page to see the changes
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
