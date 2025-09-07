const mongoose = require('mongoose');

const recentSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  efficiency: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    default: 'Current Location'
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index to ensure efficient queries and limit searches per user
recentSearchSchema.index({ userId: 1, timestamp: -1 });

// Static method to clean up old searches (keep only latest 3 per user)
recentSearchSchema.statics.cleanupOldSearches = async function(userId) {
  const searches = await this.find({ userId }).sort({ timestamp: -1 });
  if (searches.length > 3) {
    const searchesToDelete = searches.slice(3);
    const idsToDelete = searchesToDelete.map(search => search._id);
    await this.deleteMany({ _id: { $in: idsToDelete } });
  }
};

module.exports = mongoose.model('RecentSearch', recentSearchSchema);


