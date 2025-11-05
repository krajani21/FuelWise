const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for guests
  },
  guestId: {
    type: String, // Hashed IP for guests
    default: null
  },
  eventType: {
    type: String,
    enum: ['search', 'login', 'signup', 'profile_view', 'profile_update'],
    required: true
  },
  searchType: {
    type: String,
    enum: ['volume', 'distance', null],
    default: null
  },
  cacheHit: {
    type: Boolean,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false // Using timestamp field instead
});

// Compound indexes for efficient queries
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ guestId: 1, timestamp: -1 });
userActivitySchema.index({ eventType: 1, timestamp: -1 });
userActivitySchema.index({ timestamp: -1 });

// Auto-delete old events after 90 days (optional - saves storage)
userActivitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('UserActivity', userActivitySchema);

