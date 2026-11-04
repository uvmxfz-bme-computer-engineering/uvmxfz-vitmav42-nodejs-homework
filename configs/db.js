const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/uvmxfz');
}).then(x => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

module.exports = mongoose;