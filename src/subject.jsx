import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { premiumCourses } from "./premiumCourses";
import "./courses.css";

export default function Subject() {
  const { category, subject } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [watchedVideos, setWatchedVideos] = useState(() => {
    return JSON.parse(localStorage.getItem("watchedVideos")) || [];
  });

  const toggleWatch = (id) => {
    let updated;
    const existing = watchedVideos.find(v => v.id === id);
    if (existing) {
      updated = watchedVideos.filter(v => v.id !== id);
    } else {
      updated = [...watchedVideos, { id, subject }];
    }
    setWatchedVideos(updated);
    localStorage.setItem("watchedVideos", JSON.stringify(updated));
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(fetchedData => {
        const user = JSON.parse(localStorage.getItem("user"));
        const data = user?.isMember ? [...fetchedData, ...premiumCourses] : fetchedData;

        const course = data.find(
          c => c.category === category && c.subject === subject
        );

        if (course) {
          setVideos(course.videos);
        }
      });
  }, [category, subject]);

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>{subject}</h1>

      <div className="video-grid">
        {videos.map((id) => (
          <div key={id} className="video-card">
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              allowFullScreen
            />
            <button 
              onClick={() => toggleWatch(id)}
              style={{
                width: "100%", padding: "10px", marginTop: "10px", cursor: "pointer",
                background: watchedVideos.find(v => v.id === id) ? "#10b981" : "var(--primary-btn)",
                color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold"
              }}
            >
              {watchedVideos.find(v => v.id === id) ? "✅ Watched" : "Mark as Watched"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}