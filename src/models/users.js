const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  avatar: { type: String, default: 'default-avatar.jpg' }, // Đường dẫn đến ảnh đại diện
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', User);