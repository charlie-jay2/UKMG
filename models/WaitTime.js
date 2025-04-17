const mongoose = require('mongoose');

const waitTimeSchema = new mongoose.Schema({
    minors: Number,
    majors: Number
});

module.exports = mongoose.model('WaitTime', waitTimeSchema);
