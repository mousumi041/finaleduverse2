import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  videosWatched: [{
    videoId: String,
    category: String,
    subject: String,
    watchedAt: {
      type: Date,
      default: Date.now
    },
    duration: Number, // in seconds
    completed: {
      type: Boolean,
      default: false
    }
  }],
  coursesInProgress: [{
    category: String,
    subject: String,
    startedAt: {
      type: Date,
      default: Date.now
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    videosCompleted: [String], // array of video IDs
    totalVideos: Number,
    progressPercentage: {
      type: Number,
      default: 0
    }
  }],
  coursesCompleted: [{
    category: String,
    subject: String,
    completedAt: {
      type: Date,
      default: Date.now
    },
    totalVideos: Number,
    timeSpent: Number // in seconds
  }],
  skillsGained: [{
    skill: String,
    category: String,

    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastActive: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const UserProgress = mongoose.model("UserProgress", userProgressSchema, "userprogress");

export default UserProgress;
