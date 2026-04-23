import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./courses.css";
import { getQuizQuestions } from "./quizBank.js";

function QuizPage() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const questions = getQuizQuestions(subject);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [finished, setFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime] = useState(Date.now());
  const [finalScore, setFinalScore] = useState(0);

  /* TIMER */
  useEffect(() => {
    if (finished) return;

    if (timeLeft <= 0) {
      finishQuiz(score, userAnswers);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  const getCategoryFromSubject = (subject) => {
    if (["React", "JavaScript", "HTML & CSS", "Node & Express"].includes(subject)) {
      return "Full Stack Development";
    } else if (["Python", "Machine Learning", "Deep Learning"].includes(subject)) {
      return "Data Science & AI";
    } else if (["Android Development", "Flutter", "React Native"].includes(subject)) {
      return "Mobile App Development";
    }
    return "Programming Languages";
  };

  // Takes finalScore and finalAnswers as params to avoid stale state
  const finishQuiz = async (finalScoreVal, finalAnswersVal) => {
    setFinished(true);
    setFinalScore(finalScoreVal);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const percentage = Math.round((finalScoreVal / questions.length) * 100);
    const passed = percentage >= 60;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id;

    if (!userId) {
      console.warn("No userId found — quiz result not saved to DB.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/quiz-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          subject,
          category: getCategoryFromSubject(subject),
          questions: finalAnswersVal,
          score: percentage,
          totalQuestions: questions.length,
          correctAnswers: finalScoreVal,
          timeSpent,
          passed
        })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Server error saving quiz:", err);
      } else {
        console.log("✅ Quiz results saved to MongoDB");
      }
    } catch (error) {
      console.error("❌ Error saving quiz results:", error);
    }
  };

  const handleNext = () => {
    const isCorrect = selected === questions[index].a;

    const answer = {
      question: questions[index].q,
      options: questions[index].options,
      userAnswer: selected,
      correctAnswer: questions[index].a,
      isCorrect
    };

    const newAnswers = [...userAnswers, answer];
    const newScore = isCorrect ? score + 1 : score;

    setUserAnswers(newAnswers);
    if (isCorrect) setScore(newScore);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      // Pass computed values directly — avoids stale state bug
      finishQuiz(newScore, newAnswers);
    }
  };

  return (
    <div className="page">
      <h1>{subject} Quiz</h1>

      <p style={{ textAlign: "center" }}>
        ⏱ Time Left: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </p>

      {!finished ? (
        <div className="card">
          <h3>
            Q{index + 1}. {questions[index].q}
          </h3>

          {questions[index].options.map((op, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              style={{
                margin: "12px 0",
                padding: "14px 20px",
                borderRadius: "14px",
                cursor: "pointer",
                position: "relative",
                zIndex: 2,
                border:
                  selected === i
                    ? "2px solid #5624d0"
                    : "1px solid #e2e8f0",
                background:
                  selected === i
                    ? "rgba(86, 36, 208, 0.1)"
                    : "#f7f9fb",
                color: "#1c1d1f"
              }}
            >
              {op}
            </div>
          ))}

          <button
            onClick={handleNext}
            disabled={selected === null}
            style={{ position: "relative", zIndex: 2 }}
          >
            {index + 1 === questions.length ? "Submit Quiz" : "Next"}
          </button>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center" }}>
          <h2>🎉 Quiz Completed!</h2>
          <p style={{ fontSize: "20px", margin: "16px 0" }}>
            Your Score: {finalScore} / {questions.length}
          </p>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "20px" }}>
            {Math.round((finalScore / questions.length) * 100)}%
            {" — "}
            {Math.round((finalScore / questions.length) * 100) >= 60
              ? "✅ Passed"
              : "❌ Failed — Try again!"}
          </p>

          <button
            onClick={() => navigate("/profile")}
            style={{ position: "relative", zIndex: 2 }}
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;