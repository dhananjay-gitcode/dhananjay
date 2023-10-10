import React, { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setErrorMessage("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    // Static username and password
    const staticUsername = "admin";
    const staticPassword = "password";

    if (username === staticUsername && password === staticPassword) {
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true");
    } else {
      setErrorMessage("Invalid username or password");
    }
  };

  if (loggedIn) {
    return <Navbar />;
  }

  return (
    <div className="login-card">
      <h2>Login Page</h2>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          placeholder="Username"
          onChange={handleUsernameChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>
      <div>
        <button type="submit" onClick={handleSubmit}>
          Login
        </button>
        <br />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
