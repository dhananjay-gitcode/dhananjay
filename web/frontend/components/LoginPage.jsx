import React,{ useState,useEffect } from "react";
import "./App.css";
import axios from "axios";
import Navbar from "./Navbar";


export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
    }
    fetchData();
  }, []);


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setErrorMessage("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorMessage("");
  };

 
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    // try {
    //   const response = await axios.get("http://localhost:5011/data", {
    //     username,
    //     password,
    //   });
    //   var data = response.data; // Handle the response as needed
    //   console.log(data);
    // } catch (error) {
    //   console.error("Error during login:", error);
    // }

    // for (var datas of data) {
    //   if (datas.name === username && datas.password === password) {
    //     setLoggedIn(true);
    //     localStorage.setItem("loggedIn", "true");

    //     break;
    //   }
    // }
    
    // Static username and password
    const staticUsername = "admin";
    const staticPassword = "password";

    if (username === staticUsername && password === staticPassword) {
      setLoggedIn(true);
    } else {
      alert("Invalid username or password");
  }
};

if(loggedIn){
   
    return <Navbar/>
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
        <br></br>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
