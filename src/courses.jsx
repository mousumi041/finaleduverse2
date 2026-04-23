import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { premiumCourses } from "./premiumCourses";
import "./courses.css";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
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

  const categories = Object.keys(courses);

  // Flatten all subjects for searching
  const allSubjects = [];
  categories.forEach(cat => {
    Object.keys(courses[cat]).forEach(sub => {
      allSubjects.push({ category: cat, subject: sub });
    });
  });

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubjects = allSubjects.filter(item =>
    item.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If searching, show matching subjects. If not, show categories.
  const isSearching = searchQuery.trim() !== "";

  return (
    <div className="page">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a course or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h1>All Categories</h1>

      {isSearching ? (
        <div className="grid">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((item, idx) => (
              <div
                key={idx}
                className="card"
                onClick={() => navigate(`/courses/${item.category}/${item.subject}`)}
              >
                <h3>{item.subject}</h3>
                <p>{item.category}</p>
              </div>
            ))
          ) : (
            <div className="no-results" style={{ gridColumn: "1 / -1" }}>
              Course not found
            </div>
          )}
        </div>
      ) : (
        <div className="grid">
          {categories.map((cat) => (
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
      )}

      {user?.isMember && !isSearching && (
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