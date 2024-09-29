const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Remember to hash passwords in a real application
});

module.exports = mongoose.model('User', UserSchema);