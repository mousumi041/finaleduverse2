import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { premiumCourses } from "./premiumCourses";
import "./courses.css";

export default function Subject() {
  const { category, subject } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [watchedVideos, setWatchedVideos] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Load watched videos from DB on mount
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/progress/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data?.videosWatched) {
          setWatchedVideos(data.videosWatched.map(v => v.videoId));
        }
      })
      .catch(() => {});
  }, [userId]);

  // Load course videos
  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(fetchedData => {
        const data = user?.isMember
          ? [...fetchedData, ...premiumCourses]
          : fetchedData;

        const course = data.find(
          c => c.category === category && c.subject === subject
        );

        if (course) {
          setVideos(course.videos);
        }
      });
  }, [category, subject]);

  const toggleWatch = async (id) => {
    if (!userId) return;

    const isWatched = watchedVideos.includes(id);

    // Optimistic UI update
    setWatchedVideos(prev =>
      isWatched ? prev.filter(v => v !== id) : [...prev, id]
    );

    if (!isWatched) {
      try {
        // Save to userprogress collection
        await fetch("http://localhost:5000/api/progress/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            videoId: id,
            category,
            subject,
            duration: 0,
            completed: true
          })
        });

        // Save to courseprogress collection
        await fetch("http://localhost:5000/api/course-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            category,
            subject,
            videoId: id,
            title: id,
            watchTime: 0
          })
        });
      } catch (err) {
        console.error("Failed to save progress:", err);
        // Revert optimistic update on error
        setWatchedVideos(prev =>
          isWatched ? [...prev, id] : prev.filter(v => v !== id)
        );
      }
    }
  };

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
            {user && (
              <button
                onClick={() => toggleWatch(id)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "10px",
                  cursor: "pointer",
                  background: watchedVideos.includes(id)
                    ? "#10b981"
                    : "var(--primary-btn)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold"
                }}
              >
                {watchedVideos.includes(id) ? "✅ Watched" : "Mark as Watched"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}