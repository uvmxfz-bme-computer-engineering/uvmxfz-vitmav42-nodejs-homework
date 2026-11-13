/**
 * MongoDB connection shared by every Mongoose model.
 *
 * The URI comes from `MONGODB_URI`, falling back to a local server on
 * `MONGO_PORT` (or 27017) using the `uvmxfz` database.
 *
 * @module configs/db
 */
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI
    || `mongodb://localhost:${process.env.MONGO_PORT || 27017}/uvmxfz`;

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

module.exports = mongoose; 