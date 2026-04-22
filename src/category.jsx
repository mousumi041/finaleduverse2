import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { premiumCourses } from "./premiumCourses";
import "./courses.css";

export default function Category() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState({});
  const [premiumSubjects, setPremiumSubjects] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(fetchedData => {
        const user = JSON.parse(localStorage.getItem("user"));
        const data = user?.isMember ? [...fetchedData, ...premiumCourses] : fetchedData;

        const standard = {};
        const premium = {};

        data.forEach(course => {
          if (course.category === category) {
            if (course.isPremium) {
              premium[course.subject] = course.videos;
            } else {
              standard[course.subject] = course.videos;
            }
          }
        });

        setSubjects(standard);
        setPremiumSubjects(premium);
      });
  }, [category]);

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>{category}</h1>

      <div className="grid">
        {Object.keys(subjects).map((sub) => (
          <div
            key={sub}
            className="card"
            onClick={() => navigate(`/courses/${category}/${sub}`)}
          >
            <h3>{sub}</h3>
            <p>{subjects[sub].length} videos</p>
          </div>
        ))}
      </div>

      {Object.keys(premiumSubjects).length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ marginBottom: "20px", color: "var(--primary-accent)" }}>Premium Content</h2>
          <div className="grid">
            {Object.keys(premiumSubjects).map((sub) => (
              <div
                key={sub}
                className="card"
                onClick={() => navigate(`/courses/${category}/${sub}`)}
                style={{ border: "2px solid var(--primary-accent)" }}
              >
                <h3>{sub}</h3>
                <p>{premiumSubjects[sub].length} premium videos</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}