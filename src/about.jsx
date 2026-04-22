import "./about.css";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <h1>About <span>EduVerse</span></h1>
        <p>
          India’s next-generation digital learning platform built to empower
          students, professionals, and lifelong learners.
        </p>
      </section>

      {/* MISSION */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make high-quality education accessible, affordable,
          and effective for every learner in India. We blend technology,
          expert educators, and real-world skills to create meaningful learning
          experiences.
        </p>
      </section>

      {/* VISION */}
      <section className="about-section glass">
        <h2>Our Vision</h2>
        <p>
          To become India’s most trusted digital education ecosystem, helping
          millions of learners upskill, reskill, and transform their careers.
        </p>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <h2>What We Believe In</h2>

        <div className="values-grid">
          <div className="value-card">
            <h3>📚 Quality Education</h3>
            <p>Industry-relevant content curated by expert educators.</p>
          </div>

          <div className="value-card">
            <h3>🚀 Career Growth</h3>
            <p>Learning that directly translates into real opportunities.</p>
          </div>

          <div className="value-card">
            <h3>🌏 Inclusive Learning</h3>
            <p>Education for students from every background across India.</p>
          </div>

          <div className="value-card">
            <h3>💡 Innovation</h3>
            <p>Using modern tech to enhance learning experiences.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Join the EduVerse Journey</h2>
        <p>Learn. Grow. Succeed — with EduVerse.</p>
        <button onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>Start Learning</button>
      </section>

    </div>
  );
}

export default About;
