const Patient = require("../models/Patient");
const Ward = require("../models/Ward");

router.get('/', requireLogin, async (req, res) => {
    const wards = await Ward.find();
    const patients = await Patient.find();
    res.render('index', { wards, patients });
});
