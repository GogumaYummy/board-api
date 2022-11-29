const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postId: mongoose.Types.ObjectId,
});

module.exports = mongoose.model('Comments', commentsSchema);
