const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  role:{type: String, required:true},
  content:{type: String, required:true},
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
});

module.exports = mongoose.model('Message', messageSchema);