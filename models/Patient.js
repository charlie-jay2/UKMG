const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    notes: String,
    stage: { type: String, enum: ['Triage', 'Medical Treatment', 'Discharged'], default: 'Triage' },
    updatedAt: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    nhsNumber: String,
    condition: String,
    medicalRecords: [medicalRecordSchema]
});

module.exports = mongoose.model('Patient', patientSchema);
