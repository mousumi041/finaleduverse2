import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  videos: [{
    videoId: String,
    title: String,
    watched: {
      type: Boolean,
      default: false
    },
    watchTime: {
      type: Number, // in seconds
      default: 0
    },
    completedAt: Date
  }],
  totalVideos: {
    type: Number,
    required: true
  },
  videosCompleted: {
    type: Number,
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  quizAttempts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizAttempt'
  }],
  averageQuizScore: {
    type: Number,
    default: 0
  },
  skillsAcquired: [String],
  certificateEarned: {
    type: Boolean,
    default: false
  },
  certificateUrl: String
}, { 
  timestamps: true,
  // Compound index for efficient querying
  index: { userId: 1, category: 1, subject: 1 }
});

// Method to calculate progress percentage
courseProgressSchema.methods.calculateProgress = function() {
  if (this.totalVideos === 0) return 0;
  this.progressPercentage = Math.round((this.videosCompleted / this.totalVideos) * 100);
  this.isCompleted = this.progressPercentage === 100;
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  return this.progressPercentage;
};

// Method to mark video as watched
courseProgressSchema.methods.markVideoWatched = function(videoId, watchTime) {
  const video = this.videos.find(v => v.videoId === videoId);
  if (video && !video.watched) {
    video.watched = true;
    video.watchTime = watchTime;
    video.completedAt = new Date();
    this.videosCompleted++;
    this.lastAccessed = new Date();
    return this.calculateProgress();
  }
  return this.progressPercentage;
};

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema, "courseprogress");

export default CourseProgress;
