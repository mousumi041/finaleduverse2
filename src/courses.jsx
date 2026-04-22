import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { premiumCourses } from "./premiumCourses";
import "./courses.css";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(fetchedData => {
        const data = user?.isMember ? [...fetchedData, ...premiumCourses] : fetchedData;

        const grouped = {};

        data.forEach(course => {
          if (!grouped[course.category]) {
            grouped[course.category] = {};
          }
          grouped[course.category][course.subject] = course.videos;
        });

        setCourses(grouped);
      });
  }, []);

  return (
    <div className="page">
      <h1>All Categories</h1>

      <div className="grid">
        {Object.keys(courses).map((cat) => (
          <div
            key={cat}
            className="card"
            onClick={() => navigate(`/courses/${cat}`)}
          >
            <h3>{cat}</h3>
            <p>{Object.keys(courses[cat]).length} subjects</p>
          </div>
        ))}
      </div>

      {user?.isMember && (
        <div style={{ marginTop: "40px" }}>
          <h2>Premium Content</h2>
          <div className="grid">
            {premiumCourses.map((course, idx) => (
              <div
                key={idx}
                className="card"
                onClick={() => navigate(`/courses/${course.category}/${course.subject}`)}
                style={{ border: "2px solid var(--primary-accent)", background: "rgba(255, 215, 0, 0.05)" }}
              >
                <h3>{course.subject}</h3>
                <p>Premium • {course.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}