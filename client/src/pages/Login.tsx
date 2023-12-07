import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./container.css";
import currentUser from "../currentUser";
import { fetchCalls, fetchAdmin, fetchUsername } from "../userFetches.tsx";
import { set } from "firebase/database";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const cookies = new Cookies();
  const loginUrl = "http://localhost:3000/API/V1/auth/login";
  const navigate = useNavigate();
  const [strings, setStrings] = useState<any | null>(null); // Using 'any' for flexibility

  useEffect(() => {
    const fetchStrings = async () => {
      try {
        const response = await fetch('../strings.json'); // Adjust the path if needed
        const data = await response.json();
        setStrings(data);
      } catch (error) {
        console.error('Error fetching strings:', error);
      }
    };

    fetchStrings();
  }, []);

  ///Used fetch template from Mozila Docs
  ///Used fetch template from Mozila Docs
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
      body: JSON.stringify(data),
      // credentials: "include",
      // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const LoginInEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiResponse = await login(loginUrl, {
      username: username,
      password: password,
    });
    if (apiResponse.error !== undefined) {
      setResponse(apiResponse.error);
      return;
    } else {
      cookies.set("accessToken", apiResponse.accessToken, { path: "/" });
      if (apiResponse.adminAccessToken !== "") {
        cookies.set("adminAccessToken", apiResponse.adminAccessToken, {
          path: "/",
        });
      }
      await fetchCalls();
      await fetchAdmin();
      await fetchUsername();
      await setTimeout(checkAuth, 250);
    }
  };

  async function checkAuth() {
    if (currentUser.status === "") {
      setTimeout(checkAuth, 250);
    } else if (currentUser.status === "Authorized" && currentUser.isAdmin) {
      navigate("/admin");
    } else if (currentUser.status === "Authorized") {
      navigate("/dashboard");
    }
  }

  useEffect(() => {
    checkAuth();
  });

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
          <h1>{strings ? strings.login : 'Loading...'}</h1>
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
              {strings ? strings.login : 'Loading...'}
            </button>
          </form>
          <p>{response}</p>
        </div>
      </div>
    );
  }
}

export default Login;
