import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

function Profile({ theme, toggleTheme }) {
  const navigate = useNavigate();

  const loggedUser = JSON.parse(localStorage.getItem("user")) || {};
  console.log("USER IN STORAGE:", loggedUser);

  const quizzesTaken =
    Number(localStorage.getItem("quizzesTaken")) || 0;
    
  const watchedVideos = JSON.parse(localStorage.getItem("watchedVideos")) || [];
  const uniqueSkills = [...new Set(watchedVideos.map(v => v.subject))];
  const skillsDisplay = uniqueSkills.length > 0 ? uniqueSkills.join(", ") : "Start learning to gain skills!";

  const [activeTab, setActiveTab] = useState("dashboard");

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [accountError, setAccountError] = useState("");
  const [accountSuccess, setAccountSuccess] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  /* 🔐 PASSWORD UPDATE */
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
      const res = await fetch(
        `http://localhost:5000/api/update-password`, // ✅ FIXED
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: loggedUser.email,
            oldPassword: currentPassword,
            newPassword: newPassword
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

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



  /* ❌ DELETE ACCOUNT */
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/delete-account`, {
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

  /* 🚫 DELETE SUBSCRIPTION */
  const handleDeleteSubscription = () => {
    if (!loggedUser?.isMember) {
      alert("You don't currently have an active subscription.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete your subscription? You will lose access to premium courses immediately.")) {
      return;
    }

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
            <h1>My Learning Dashboard</h1>

            <div className="card">
              {/* ✅ FIXED NAME */}
              <h3>👋 Hello, {loggedUser?.fullName || loggedUser?.name}</h3>
              <p style={{ fontWeight: 'bold', color: 'var(--primary-accent)', margin: "5px 0 15px 0" }}>
                Current Subscription: {loggedUser?.isMember && loggedUser?.plan ? loggedUser.plan : "Free"}
              </p>
              <p>
                Welcome back! Track your learning journey
                below.
              </p>
            </div>

              <div className="grid">
              <div className="card">
                <h3>📊 Course Progress</h3>
                <p>{watchedVideos.length > 0 ? `${watchedVideos.length} videos completed` : "No courses started yet"}</p>
              </div>

              <div className="card">
                <h3>🧠 Quizzes Attempted</h3>
                <p>{quizzesTaken} quizzes completed</p>
              </div>

              <div className="card">
                <h3>🎯 Skills Gained</h3>
                <p>{skillsDisplay}</p>
              </div>

              <div className="card">
                <h3>📺 Videos Watched</h3>
                <p>{watchedVideos.length} total videos</p>
              </div>

              <div
                className="card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/quizzes")}
              >
                <h3>📝 Take a Quiz</h3>
                <p>Test your knowledge & track scores</p>
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
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
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                  />

                  {passwordError && <p className="error">{passwordError}</p>}
                  {successMessage && <p className="success">{successMessage}</p>}

                  <button onClick={handlePasswordUpdate}>
                    Confirm Update
                  </button>
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
              <p style={{ marginBottom: "20px" }}>Change the visual theme of the application.</p>
              
              <button 
                onClick={toggleTheme} 
                style={{ background: "var(--primary-btn)", color: "#fff", padding: "12px 28px", borderRadius: "30px", border: "none", cursor: "pointer", fontWeight: "bold" }}
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
              <p style={{ marginBottom: "15px" }}>Once you perform these actions, there is no going back. Please be certain.</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-start" }}>
                <button 
                  onClick={handleDeleteAccount}
                  style={{ background: "#dc2626" }}
                >
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