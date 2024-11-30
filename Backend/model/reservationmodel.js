const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'restaurant' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  tables: {
    twoPerson: { type: Number, default: 0 },
    fourPerson: { type: Number, default: 0 },
    sixPerson: { type: Number, default: 0 }
  },
  entryCode: { type: String, required: true, unique: true },
  status: { type: String, enum: ['confirmed', 'cancelled'] },
  viewed: { type: Boolean, default: false }
});

const reservation = new mongoose.model('reservation', reservationSchema);
module.exports = reservation;