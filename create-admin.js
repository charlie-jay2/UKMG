const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/ukmg', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function createUser() {
    const passwordHash = await bcrypt.hash('password123', 12);
    await User.create({ username: 'admin', passwordHash });
    console.log('Admin user created!');
    mongoose.disconnect();
}

createUser();
