const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  vehicle: {
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1
    },
    make: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    model: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    fuelType: {
      type: String,
      required: true,
      enum: ['Regular', 'Premium', 'Diesel'],
      default: 'Regular'
    },
    tankCapacity: {
      type: Number,
      required: true,
      min: 10,
      max: 200,
      validate: {
        validator: function(value) {
          return value > 0 && Number.isFinite(value);
        },
        message: 'Tank capacity must be a positive number'
      }
    }
  },
  preferences: {
    preferredBrands: [{
      type: String,
      enum: [
        'Petro-Canada',
        'Shell',
        'Esso',
        'Chevron',
        'Husky',
        'Costco',
        'Canadian Tire',
        'Ultramar',
        'Fas Gas',
        'Co-op',
        'Mohawk',
        'Pioneer',
        'Other'
      ]
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries (removed duplicate - using unique: true on userId instead)

// Update the updatedAt field before saving
userProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get or create profile
userProfileSchema.statics.getOrCreateProfile = async function(userId) {
  let profile = await this.findOne({ userId });
  if (!profile) {
    profile = new this({
      userId,
      vehicle: {
        year: new Date().getFullYear(),
        make: '',
        model: '',
        fuelType: 'Regular',
        tankCapacity: 50 // Default to 50L for most vehicles
      },
      preferences: {
        preferredBrands: []
      }
    });
  }
  return profile;
};

module.exports = mongoose.model('UserProfile', userProfileSchema);
