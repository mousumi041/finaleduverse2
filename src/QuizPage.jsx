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

  /* TIMER */
  useEffect(() => {
    if (finished) return;

    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  const handleNext = () => {
    if (selected === questions[index].a) {
      setScore((s) => s + 1);
    }

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setFinished(true);
    const count = Number(localStorage.getItem("quizzesTaken")) || 0;
    localStorage.setItem("quizzesTaken", count + 1);
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
          <h2>🎉 Quiz Completed</h2>
          <p>
            Your Score: {score} / {questions.length}
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
