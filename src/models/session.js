const mongoose = require('mongoose');

export const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  accessTokenValidUntil: {
    type: Date,
    required: true
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
