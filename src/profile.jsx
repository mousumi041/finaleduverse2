import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

function Profile({ theme, toggleTheme }) {
  const navigate = useNavigate();

  const loggedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = loggedUser._id;

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/dashboard/${userId}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  const quizzesTaken = dashboardData?.stats?.quizzesAttempted ?? 0;
  const totalVideosWatched = dashboardData?.stats?.totalVideosWatched || 0;
  const coursesInProgress = dashboardData?.stats?.coursesInProgress || 0;
  const completedCourseNames = dashboardData?.courseProgress
    ?.filter(cp => cp.isCompleted)
    .map(cp => cp.subject) || [];
  const coursesCompleted = completedCourseNames.length;

  const quizSkills = dashboardData?.userProgress?.skillsGained
    ?.map(s => s.skill) || [];

  // Combine and remove duplicates
  const allSkills = Array.from(new Set([...completedCourseNames, ...quizSkills]));

  const skillsGained = allSkills.length;

  const skillsDisplay = allSkills.length > 0
    ? allSkills.join(", ")
    : "Start learning to gain skills!";

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [accountError, setAccountError] = useState("");
  const [accountSuccess, setAccountSuccess] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handlePasswordUpdate = async () => {
    setPasswordError("");
    setSuccessMessage("");

    if (!loggedUser.email) {
      setPasswordError("User not logged in.");
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loggedUser.email,
          oldPassword: currentPassword,
          newPassword: newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setSuccessMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowPasswordForm(false);
        setSuccessMessage("");
      }, 1500);

    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

    try {
      const res = await fetch("http://localhost:5000/api/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loggedUser.email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deletion failed");

      alert("Account deleted successfully.");
      handleLogout();
    } catch (err) {
      setAccountError(err.message);
    }
  };

  const handleDeleteSubscription = () => {
    if (!loggedUser?.isMember) {
      alert("You don't currently have an active subscription.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete your subscription?")) return;

    const updatedUser = { ...loggedUser };
    delete updatedUser.isMember;
    delete updatedUser.plan;

    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Subscription deleted successfully.");
    window.location.reload();
  };


  return (
    <div className="profile-layout">

      <aside className="sidebar">
        <h2>Settings</h2>
        <ul>
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeTab === "security" ? "active" : ""}
            onClick={() => setActiveTab("security")}
          >
            Password & Security
          </li>
          <li
            className={activeTab === "account" ? "active" : ""}
            onClick={() => setActiveTab("account")}
          >
            Account
          </li>
          <li
            className={activeTab === "appearance" ? "active" : ""}
            onClick={() => setActiveTab("appearance")}
          >
            Appearance
          </li>
          <li onClick={() => navigate("/membership")}>
            Membership
          </li>
        </ul>
      </aside>

      <main className="profile-content">

        {activeTab === "dashboard" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h1 style={{ margin: 0 }}>My Learning Dashboard</h1>
            </div>

            {/* No _id warning */}
            {!userId && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: "10px",
                padding: "14px 18px",
                marginBottom: "20px",
                color: "#dc2626",
                fontSize: "14px"
              }}>
                ⚠️ Your session is outdated. Please{" "}
                <span
                  onClick={handleLogout}
                  style={{ fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
                >
                  logout and login again
                </span>{" "}
                to enable progress tracking.
              </div>
            )}

            <div className="card">
              <h3>👋 Hello, {loggedUser?.fullName || loggedUser?.name}</h3>
              <p style={{ fontWeight: "bold", color: "var(--primary-accent)", margin: "5px 0 15px 0" }}>
                Current Subscription:{" "}
                {loggedUser?.isMember && loggedUser?.plan ? loggedUser.plan : "Free"}
              </p>
              <p>Welcome back! Track your learning journey below.</p>
            </div>

            {loading ? (
              <div className="card">
                <p>Loading your progress data...</p>
              </div>
            ) : (
              <div className="grid">

                <div className="card">
                  <h3>📊 Course Progress</h3>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--primary-accent)", margin: "8px 0" }}>
                    {coursesCompleted}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {coursesCompleted} course{coursesCompleted !== 1 ? "s" : ""} completed
                  </p>
                </div>

                <div className="card">
                  <h3>🧠 Quizzes Taken</h3>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--primary-accent)", margin: "8px 0" }}>
                    {quizzesTaken}
                  </p>
                  {dashboardData?.quizAttempts?.length > 0 && (
                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      Latest: {dashboardData.quizAttempts[0].subject} —{" "}
                      {dashboardData.quizAttempts[0].score}%{" "}
                      {dashboardData.quizAttempts[0].passed ? "✅" : "❌"}
                    </p>
                  )}
                </div>

                <div className="card">
                  <h3>🎯 Skills Gained</h3>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--primary-accent)", margin: "8px 0" }}>
                    {skillsGained}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {skillsDisplay}
                  </p>
                </div>

                <div
                  className="card"
                  style={{ cursor: "pointer", gridColumn: "1 / -1" }}
                  onClick={() => navigate("/quizzes")}
                >
                  <h3>📝 Take a Quiz</h3>
                  <p>Test your knowledge & earn skills</p>
                </div>

                {/* Recent quiz attempts */}
                {dashboardData?.quizAttempts?.length > 0 && (
                  <div className="card" style={{ gridColumn: "1 / -1" }}>
                    <h3>📊 Recent Quiz Attempts</h3>
                    <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {dashboardData.quizAttempts.slice(0, 5).map((attempt, i) => (
                        <div key={i} style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          background: "var(--bg-solid)",
                          borderRadius: "10px",
                          fontSize: "14px"
                        }}>
                          <span style={{ fontWeight: "600" }}>{attempt.subject}</span>
                          <span style={{ color: "var(--text-muted)" }}>{attempt.category}</span>
                          <span style={{
                            fontWeight: "700",
                            color: attempt.passed ? "#10b981" : "#ef4444"
                          }}>
                            {attempt.score}% {attempt.passed ? "✅" : "❌"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            <button className="logout-btn" onClick={handleLogout} style={{ marginTop: "30px" }}>
              Logout
            </button>
          </>
        )}

        {activeTab === "security" && (
          <>
            <h1>Password & Security</h1>
            <div className="card">
              <h3>Password</h3>
              {!showPasswordForm ? (
                <button onClick={() => setShowPasswordForm(true)}>
                  Update Password
                </button>
              ) : (
                <>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {passwordError && <p className="error">{passwordError}</p>}
                  {successMessage && <p className="success">{successMessage}</p>}
                  <button onClick={handlePasswordUpdate}>Confirm Update</button>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === "appearance" && (
          <>
            <h1>Appearance Settings</h1>
            <div className="card">
              <h3>Theme Mode</h3>
              <p style={{ marginBottom: "20px" }}>
                Change the visual theme of the application.
              </p>
              <button
                onClick={toggleTheme}
                style={{
                  background: "var(--primary-btn)",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: "30px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {theme === "light" ? "Switch to Dark Mode 🌙" : "Switch to Light Mode ☀️"}
              </button>
            </div>
          </>
        )}

        {activeTab === "account" && (
          <>
            <h1>Manage Account</h1>
            <div className="card">
              {accountError && <p className="error">{accountError}</p>}
              {accountSuccess && <p className="success">{accountSuccess}</p>}
              <h3 style={{ color: "#dc2626" }}>Danger Zone</h3>
              <p style={{ marginBottom: "15px" }}>
                Once you perform these actions, there is no going back. Please be certain.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-start" }}>
                <button onClick={handleDeleteAccount} style={{ background: "#dc2626" }}>
                  Delete Account
                </button>
                {loggedUser?.isMember && (
                  <button
                    onClick={handleDeleteSubscription}
                    style={{ background: "#f59e0b", color: "#fff" }}
                  >
                    Delete Subscription
                  </button>
                )}
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default Profile;