const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Show all patients
router.get('/', async (req, res) => {
    const patients = await Patient.find();
    res.render('patients/list', { patients });
});

// New patient form
router.get('/new', (req, res) => {
    res.render('patients/new');
});

// Create patient
router.post('/', async (req, res) => {
    const { name, age, nhsNumber, condition } = req.body;
    await Patient.create({ name, age, nhsNumber, condition });
    res.redirect('/patients');
});

// View single patient
router.get('/:id', async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    res.render('patients/show', { patient });
});

// Edit form
router.get('/:id/edit', async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    res.render('patients/edit', { patient });
});

// Update patient record
router.put('/:id', async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    const { notes, stage } = req.body;
    patient.medicalRecords.push({ notes, stage });
    await patient.save();
    res.redirect(`/patients/${patient._id}`);
});

module.exports = router;
