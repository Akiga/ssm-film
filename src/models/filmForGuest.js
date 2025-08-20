const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const guestFilm = new Schema({
  userId: { type: Number },
  slug: { type: String },
  watchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('guestFilm', guestFilm);