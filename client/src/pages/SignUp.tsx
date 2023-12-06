import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./container.css";
import { pwValidate } from "../components/Validate.tsx";
import currentUser from "../currentUser";
import apiUrl from "../apiUrl.tsx";
import { fetchCalls, fetchAdmin, fetchUsername } from "../fetches.tsx";

function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const navigate = useNavigate();
  const cookies = new Cookies();
  let success = false;

  function valid(username: string, password: string) {
    try {
      username;
      pwValidate(password);
    } catch (e) {
      if (typeof e === "string") {
        setResponse(e); // works, `e` narrowed to string
      } else if (e instanceof Error) {
        setResponse(e.message);
      }
      return false;
    }
    return true;
  }

  async function register(username: string, password: string) {
    try {
      const response = await fetch(apiUrl + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const responseText = await response.text();
      console.log(responseText); // Log the raw response text

      const msg = JSON.parse(responseText);
      success = true;
      return msg;
    } catch (error) {
      console.error("Error deleting user", error);
      throw error;
    }
  }

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid(username, password)) {
      return;
    }  
    if (password !== confirmedPassword) {
      setResponse("Passwords do not match!");
      return;
    }
    if (username.replace(/ /g,'') === "") {
      setResponse("Username and password cannot be blank");
      return;
    }
    const apiResponse = await register(username, password);

    if (apiResponse.error !== undefined) {
      setResponse(apiResponse.error);
      return;
    } else {
      console.log(apiResponse.message);
      cookies.set("accessToken", apiResponse.accessToken, { path: "/" });
      fetchCalls();
      fetchAdmin();
      fetchUsername();
      setTimeout(checkAuth, 2000);
    }
  };

  function checkAuth() {
    if (currentUser.status === "") {
      setTimeout(checkAuth, 1000);
    } else if (currentUser.status === "Authorized" && currentUser.isAdmin) {
      navigate("/admin");
    } else if (currentUser.status === "Authorized") {
      navigate("/dashboard");
    }
    console.log(currentUser.status);
  }

  checkAuth();

  console.log(cookies.get("user"));
  if (
    cookies.get("user") !== null &&
    cookies.get("user") !== undefined &&
    !cookies.get("user").admin
  ) {
    return <Navigate to="/dashboard" />;
  } else {
    return (
      <div className="container form-container">
        <div className="sign-up">
          <h1>Sign Up</h1>
          <form onSubmit={signUp}>
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
            <input
              type="password"
              name="password"
              placeholder="Confirm Password"
              required={true}
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
            />
            <p>{"\n"}</p>
            <button
              type="submit"
              className="btn btn-primary btn-block btn-large"
            >
              Sign Up
            </button>
            <p>{response}</p>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;
