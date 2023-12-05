import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./container.css";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const cookies = new Cookies();
  const loginUrl = "http://localhost:3000/API/V1/auth/login";
  const navigate = useNavigate();

  async function login(url = loginUrl, data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const LoginInEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiResponse = await login(loginUrl, { username: username, password: password })
    if (apiResponse.error !== undefined) {
      setResponse(apiResponse.error);
      return;
    } else {
      console.log(apiResponse.message);
      cookies.set("accessToken", apiResponse.accessToken, { path: "/" });
    }
    console.log(apiResponse);
    setResponse("Username or password is incorrect!");
  };

  if (
    cookies.get("user") !== null &&
    cookies.get("user") !== undefined &&
    !cookies.get("user").admin
  ) {
    return <Navigate to="/dashboard" />;
  } else if (
    cookies.get("user") !== null &&
    cookies.get("user") !== undefined &&
    cookies.get("user").admin
  ) {
    return <Navigate to="/admin" />;
  } else {
    return (
      <div className="container form-container">
        <div className="login">
          <h1>Log In</h1>
          <form onSubmit={LoginInEventHandler}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p>{"\n"}</p>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p>{"\n"}</p>
            <button
              type="submit"
              className="btn btn-primary btn-block btn-large"
            >
              Log In
            </button>
          </form>
          <p>{response}</p>
        </div>
      </div>
    );
  }
}

export default Login;
