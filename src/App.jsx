import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./login";
import About from "./about";
import Courses from "./courses";
import Category from "./category";
import Subject from "./subject";
import Register from "./register.jsx";
import Profile from "./profile";
import Membership from "./Membership";

/* 🔽 NEW IMPORTS (ADDED, NOTHING ELSE TOUCHED) */
import QuizSubjects from "./QuizSubjects";
import QuizPage from "./QuizPage";
import { useState, useEffect } from "react";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
    <Router>
      <>
        {/* NAVBAR */}
        <header className="navbar">
          <h1>EduVerse 🇮🇳</h1>

          <nav>
            <Link to="/">Home</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/about">About</Link>
            
            {user ? (
              <>
                <span style={{ marginLeft: "30px", color: "var(--primary-accent)" }}>
                  Hello, {user.fullName || user.name}
                </span>
                <Link to="/profile">My Profile</Link>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </nav>
        </header>

        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <section className="hero">
                  <div className="hero-text">
                    <h2>
                      India’s Smart <span>Digital Learning</span> Platform
                    </h2>
                    <p>
                      Learn from industry experts, crack exams, upskill yourself
                      and build your future with India’s next-gen LMS platform.
                    </p>
                    <Link to="/courses">
                      <button style={{cursor: "pointer"}}>Start Learning</button>
                    </Link>
                  </div>

                  <img
                    src="/hero-illustration.png"
                    alt="Learning"
                  />
                </section>

                <section className="stats">
                  <div className="stat">
                    <h3>1M+</h3>
                    <p>Students</p>
                  </div>
                  <div className="stat">
                    <h3>500+</h3>
                    <p>Courses</p>
                  </div>
                  <div className="stat">
                    <h3>200+</h3>
                    <p>Mentors</p>
                  </div>
                  <div className="stat">
                    <h3>98%</h3>
                    <p>Success Rate</p>
                  </div>
                </section>

                <section className="courses">
                  <h2>Popular Courses</h2>
                  <div className="course-grid">
                    <div className="course-card">
                      <h3>Full Stack MERN</h3>
                      <p>MongoDB, Express, React & Node with real projects.</p>
                    </div>
                    <div className="course-card">
                      <h3>Data Science</h3>
                      <p>Python, ML, AI & analytics from scratch.</p>
                    </div>
                    <div className="course-card">
                      <h3>Government Exams</h3>
                      <p>UPSC, SSC, Banking & State level prep.</p>
                    </div>
                    <div className="course-card">
                      <h3>School Learning</h3>
                      <p>CBSE, ICSE & State boards digital learning.</p>
                    </div>
                  </div>
                </section>

                <section className="cta">
                  <h2>Start Your Learning Journey Today</h2>
                  <button>Join EduVerse</button>
                </section>

                <footer>© 2026 EduVerse India. All Rights Reserved.</footer>
              </>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:category" element={<Category />} />
          <Route path="/courses/:category/:subject" element={<Subject />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile theme={theme} toggleTheme={toggleTheme} />} />


          
          <Route path="/quizzes" element={<QuizSubjects />} />
          <Route path="/quiz/:subject" element={<QuizPage />} />
          <Route path="/membership" element={<Membership />} />
          

        </Routes>
      </>
    </Router>
  );
}

export default App;
