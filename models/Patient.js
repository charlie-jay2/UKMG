const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    notes: String,
    stage: { type: String, enum: ['Triage', 'Medical Treatment', 'Discharged'], default: 'Triage' },
    updatedAt: { type: Date, default: Date.now },
    // Added for triage-specific information
    clinicalDetails: {
        initialWorkupTime: String,
        presentingComplaint: String,
        eventsLeadingUpToComplaint: String,
        drugHistory: String,
        allergies: String,
        medicalHistory: String,
    },
    socialHistory: {
        drinkRegularly: Boolean,
        smokes: Boolean,
        livesAlone: Boolean,
        employed: Boolean,
    },
    observations: {
        time: String,
        hr: String,
        sp02: String,
        bp: String,
        rr: String,
        temp: String,
        takenBy: String,
    }
});

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    nhsNumber: String,
    condition: String,
    medicalRecords: [medicalRecordSchema]
});

module.exports = mongoose.model('Patient', patientSchema);
