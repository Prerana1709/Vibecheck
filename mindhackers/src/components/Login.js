import React, { useState } from "react";
import "./Login.css";

export default function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      setShowQuestionnaire(true); // Show questionnaire instead of redirect
    }
  };

  const handleSignUpRedirect = () => {
    console.log("Redirect to the signup page");
    // You can use navigate("/signup") here if needed
  };

  const handleQuestionnaireSubmit = (e) => {
    e.preventDefault();
    alert("Thanks for sharing! 🚀 You're now entering the home zone.");
    // You can navigate("/home") here if needed after questionnaire
  };

  if (showQuestionnaire) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Quick Check-In 🧠</h2>
          <form className="login-form" onSubmit={handleQuestionnaireSubmit}>
            <label>
              How are you feeling today?
              <select className="login-input" required>
                <option value="">Choose one</option>
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="anxious">😰 Anxious</option>
                <option value="motivated">💪 Motivated</option>
              </select>
            </label>
            <label>
              What's on your mind?
              <textarea
                className="login-input"
                placeholder="Type here..."
                rows="3"
              />
            </label>
            <button type="submit" className="login-button">
              Submit 🎯
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Yo, Welcome Back 👊</h1>
        <p className="login-subtitle">Unlock your vibe vault 🔓</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Drop your tag (email) 📧"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter the secret code 🕶"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Enter The Zone 🚀
          </button>
        </form>

        <p className="login-footer">
          First time?{" "}
          <button
            className="login-link"
            onClick={handleSignUpRedirect}
            type="button"
          >
            Join the crew 🎯
          </button>
        </p>
      </div>
    </div>
  );
}
