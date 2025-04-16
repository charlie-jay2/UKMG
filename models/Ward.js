const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
    name: String,
    availableBeds: Number,
    activeStaff: [String]  // Array of staff members' names
});

module.exports = mongoose.model('Ward', wardSchema);
