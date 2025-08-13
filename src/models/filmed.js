const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const filmed = new Schema({
  userId: { type: ObjectId, ref: 'user' },
  slug: { type: String },
  watchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('filmed', filmed);