require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const Ward = require('./models/Ward');  // Import the Ward model
const Patient = require('./models/Patient')

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

app.get('/', async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const wards = await Ward.find();
        const patients = await Patient.find(
            searchQuery
                ? { name: new RegExp(searchQuery, 'i') }
                : {}
        );

        res.render('index', {
            wards,
            patients,
            searchQuery // 🟢 Must be passed here
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const wardRoutes = require('./routes/wards');
app.use('/wards', wardRoutes);

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`UKMG NHS Staff Portal running on port ${port}`);
});
