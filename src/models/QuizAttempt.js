import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  questions: [{
    question: String,
    options: [String],
    userAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  },
  passed: {
    type: Boolean,
    required: true
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  }
}, { timestamps: true });

// Index for efficient querying
quizAttemptSchema.index({ userId: 1, subject: 1 });

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema, "quizattempts");

export default QuizAttempt;
