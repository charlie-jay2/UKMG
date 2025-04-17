require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const Ward = require('./models/Ward');
const Patient = require('./models/Patient');
const WaitTime = require('./models/WaitTime');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const patientRoutes = require('./routes/patients');
app.use('/patients', patientRoutes);

const wardRoutes = require('./routes/wards');
app.use('/wards', wardRoutes);

// ✅ Ensure file is named waitTime.js exactly (not WaitTime.js)
const waitTimeRoutes = require('./routes/waitTime');
app.use('/wait-times', waitTimeRoutes);

app.get('/', async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const wards = await Ward.find();
        const patients = await Patient.find(
            searchQuery
                ? { name: new RegExp(searchQuery, 'i') }
                : {}
        );
        const waitTime = await WaitTime.findOne();

        res.render('index', {
            wards,
            patients,
            searchQuery,
            waitTimes: waitTime || { minors: 0, majors: 0 }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`UKMG NHS Staff Portal running on port ${port}`);
});
