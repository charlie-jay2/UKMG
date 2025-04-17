const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const methodOverride = require('method-override');

// Enable method override for PUT requests
router.use(methodOverride('_method'));

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
    res.redirect('/');
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

// Update patient details (name, age, nhsNumber, condition)
router.put('/:id', async (req, res) => {
    const { name, age, nhsNumber, condition } = req.body;
    const patient = await Patient.findById(req.params.id);

    // Update the patient fields with new values
    patient.name = name;
    patient.age = age;
    patient.nhsNumber = nhsNumber;
    patient.condition = condition;

    // Save the updated patient details
    await patient.save();

    // Redirect to the patient's show page after update
    res.redirect(`/patients/${patient._id}`);
});

// Update patient record (add a new medical record)
router.put('/:id/record', async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    const { notes, stage } = req.body;

    // Create new medical record object
    const newRecord = {
        notes,
        stage,
    };

    // If stage is Triage, include the triage-specific fields
    if (stage === 'Triage') {
        newRecord.clinicalDetails = req.body.clinicalDetails;

        // Correctly handle boolean values for social history
        newRecord.socialHistory = {
            drinkRegularly: req.body.socialHistory.drinkRegularly === 'on',
            smokes: req.body.socialHistory.smokes === 'on',
            livesAlone: req.body.socialHistory.livesAlone === 'on',
            employed: req.body.socialHistory.employed === 'on'
        };

        newRecord.observations = req.body.observations;
    }

    // Push new record to the patient's medicalRecords array
    patient.medicalRecords.push(newRecord);
    await patient.save();

    // Redirect to the patient's show page
    res.redirect(`/patients/${patient._id}`);
});

module.exports = router;
