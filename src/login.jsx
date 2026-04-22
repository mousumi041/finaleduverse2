import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      // ✅ FIXED URL (IMPORTANT)
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Server not responding properly");
      }

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // store user
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      }));

      navigate("/");
      window.location.reload();

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glass">

        <div className="login-left">
          <h1>EduVerse 🇮🇳</h1>
          <h2>Welcome Back!</h2>
          <p>
            Log in to continue your learning journey and unlock
            India’s smartest digital education platform.
          </p>
        </div>

        <div className="login-right">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Mail ID</label>
            </div>

            <div className="input-box">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>

            {error && (
              <p style={{ color: "red", marginBottom: "15px" }}>
                {error}
              </p>
            )}

            <button type="submit">Login</button>

            <p className="register">
              New here? <a href="/register">Create an account</a>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;