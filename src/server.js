import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import User from "./models/User.js";
import Course from "./models/Course.js";
import UserProgress from "./models/UserProgress.js";
import QuizAttempt from "./models/QuizAttempt.js";
import CourseProgress from "./models/CourseProgress.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("👉 DB Name:", mongoose.connection.name);
  })
  .catch(err => {
    console.log("❌ DB CONNECTION ERROR:", err.message);
    process.exit(1);
  });

// ─────────────────────────────────────────
// TEST ROUTE
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("API running...");
});

// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────
app.post("/api/users", async (req, res) => {
  try {
    console.log("\n📥 API HIT: /api/users");
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    console.log("✅ USER SAVED:", user);
    res.status(201).json(user);

  } catch (error) {
    console.log("❌ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
app.post("/api/login", async (req, res) => {
  try {
    console.log("\n📥 API HIT: /api/login");
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (password !== user.password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    console.log("✅ LOGIN SUCCESS");
    console.log("👉 user._id:", user._id);
    console.log("👉 user._id as string:", user._id.toString());

    res.json({
      message: "Login successful",
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log("❌ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// UPDATE PASSWORD
// ─────────────────────────────────────────
app.put("/api/update-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (user.password !== oldPassword) {
      return res.status(400).json({ error: "Old password incorrect" });
    }

    user.password = newPassword;
    await user.save();

    console.log("✅ PASSWORD UPDATED");
    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// DELETE ACCOUNT
// ─────────────────────────────────────────
app.delete("/api/delete-account", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOneAndDelete({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    console.log("✅ ACCOUNT DELETED");
    res.json({ message: "Account deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// GET ALL COURSES
// ─────────────────────────────────────────
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// GET USER PROGRESS
// ─────────────────────────────────────────
app.get("/api/progress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const progress = await UserProgress.findOne({ userId });

    if (!progress) {
      return res.json({ videosWatched: [], skillsGained: [] });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// SAVE VIDEO PROGRESS → userprogress collection
// ─────────────────────────────────────────
app.post("/api/progress/video", async (req, res) => {
  try {
    const { userId, videoId, category, subject } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    let userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      userProgress = new UserProgress({
        userId,
        videosWatched: [],
        coursesInProgress: [],
        coursesCompleted: [],
        skillsGained: []
      });
    }

    // Only add if not already recorded
    const alreadyWatched = userProgress.videosWatched.find(v => v.videoId === videoId);
    if (!alreadyWatched) {
      userProgress.videosWatched.push({
        videoId,
        category,
        subject,
        duration: 0,
        completed: true
      });
    }

    userProgress.lastActive = new Date();
    await userProgress.save();

    console.log(`✅ Video ${videoId} marked watched for user ${userId}`);
    res.json(userProgress);

  } catch (error) {
    console.log("❌ ERROR saving video progress:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// GET COURSE PROGRESS
// ─────────────────────────────────────────
app.get("/api/course-progress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const courseProgress = await CourseProgress.find({ userId });
    res.json(courseProgress);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// SAVE COURSE PROGRESS → courseprogress collection
// ─────────────────────────────────────────
app.post("/api/course-progress", async (req, res) => {
  try {
    const { userId, category, subject, videoId, title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    let courseProgress = await CourseProgress.findOne({ userId, category, subject });

    if (!courseProgress) {
      // Look up actual total videos for this course from the courses collection
      const courseDoc = await Course.findOne({ category, subject });
      const actualTotalVideos = courseDoc?.videos?.length || 1;

      console.log(`📊 Creating course progress for "${subject}" — total videos: ${actualTotalVideos}`);

      courseProgress = new CourseProgress({
        userId,
        category,
        subject,
        totalVideos: actualTotalVideos,
        videos: []
      });
    }

    // Add video entry if it doesn't exist yet
    const existingVideo = courseProgress.videos.find(v => v.videoId === videoId);
    if (!existingVideo) {
      courseProgress.videos.push({
        videoId,
        title: title || videoId,
        watched: false,
        watchTime: 0
      });
    }

    // Mark the video as watched (watchTime 0 since we removed learning time)
    courseProgress.markVideoWatched(videoId, 0);
    await courseProgress.save();

    console.log(`✅ Course progress updated: "${subject}" — ${courseProgress.videosCompleted}/${courseProgress.totalVideos} videos — ${courseProgress.progressPercentage}% complete`);

    // AWARD SKILL IF COMPLETED
    if (courseProgress.isCompleted) {
      let userProgress = await UserProgress.findOne({ userId });
      if (!userProgress) {
        userProgress = new UserProgress({ userId, videosWatched: [], skillsGained: [] });
      }

      const alreadyHasSkill = userProgress.skillsGained.find(s => s.skill === subject);
      if (!alreadyHasSkill) {
        userProgress.skillsGained.push({
          skill: subject,
          category,
          level: 'Beginner',
          earnedAt: new Date()
        });
        await userProgress.save();
        console.log(`🎯 Skill gained from course completion: ${subject}`);
      }
    }

    res.json(courseProgress);

  } catch (error) {
    console.log("❌ ERROR saving course progress:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// SAVE QUIZ ATTEMPT → quizattempts collection
// ─────────────────────────────────────────
app.post("/api/quiz-attempt", async (req, res) => {
  try {
    const {
      userId,
      subject,
      category,
      questions,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      passed
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const skillLevel =
      score >= 80 ? "Advanced" :
      score >= 60 ? "Intermediate" : "Beginner";

    const quizAttempt = new QuizAttempt({
      userId,
      subject,
      category,
      questions,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      passed,
      skillLevel
    });

    await quizAttempt.save();
    console.log(`✅ Quiz attempt saved: ${subject} — ${score}% — passed: ${passed}`);

    // Update UserProgress: add skill if passed
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({
        userId,
        videosWatched: [],
        coursesInProgress: [],
        coursesCompleted: [],
        skillsGained: []
      });
    }

    const alreadyHasSkill = userProgress.skillsGained.find(s => s.skill === subject);
    if (passed && !alreadyHasSkill) {
      userProgress.skillsGained.push({
        skill: subject,
        category,
        level: skillLevel,
        earnedAt: new Date()
      });
      console.log(`🎯 Skill gained: ${subject} (${skillLevel})`);
    }

    await userProgress.save();
    res.json(quizAttempt);

  } catch (error) {
    console.log("❌ ERROR saving quiz attempt:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// GET QUIZ ATTEMPTS FOR USER
// ─────────────────────────────────────────
app.get("/api/quiz-attempts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const attempts = await QuizAttempt.find({ userId })
      .sort({ attemptedAt: -1 })
      .limit(50);

    res.json(attempts);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// DASHBOARD — aggregates everything for profile page
// ─────────────────────────────────────────
app.get("/api/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const [userProgress, courseProgress, quizAttempts] = await Promise.all([
      UserProgress.findOne({ userId }),
      CourseProgress.find({ userId }),
      QuizAttempt.find({ userId }).sort({ attemptedAt: -1 }).limit(10)
    ]);

    res.json({
      userProgress: userProgress || { videosWatched: [], skillsGained: [] },
      courseProgress: courseProgress || [],
      quizAttempts: quizAttempts || [],
      stats: {
        totalVideosWatched: userProgress?.videosWatched?.length || 0,
        coursesInProgress: courseProgress?.filter(cp => !cp.isCompleted).length || 0,
        coursesCompleted: courseProgress?.filter(cp => cp.isCompleted).length || 0,
        quizzesAttempted: quizAttempts?.length || 0,
        skillsGained: userProgress?.skillsGained?.length || 0
      }
    });

  } catch (error) {
    console.log("❌ ERROR fetching dashboard:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});