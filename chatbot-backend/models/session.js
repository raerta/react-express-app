// models/session.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionId: { type: String, required: true },
  currentQuestionIndex: { type: Number, default: 0 },
  answers: [
    {
      question: String,
      answer: String,
    }
  ],
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
});

module.exports = mongoose.model('Session', sessionSchema);
