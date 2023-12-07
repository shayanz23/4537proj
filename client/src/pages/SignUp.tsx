import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./container.css";
import { pwValidate } from "../components/Validate.tsx";
import currentUser from "../currentUser";
import apiUrl from "../apiUrl.tsx";
import { fetchCalls, fetchAdmin, fetchUsername } from "../userFetches.tsx";

function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [strings, setStrings] = useState<any | null>(null); // Using 'any' for flexibility

  useEffect(() => {
    const fetchStrings = async () => {
      try {
        const response = await fetch('/strings.json'); // Adjust the path if needed
        const data = await response.json();
        setStrings(data);
      } catch (error) {
        console.error('Error fetching strings:', error);
      }
    };

    fetchStrings();
  }, []);
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

      const msg = JSON.parse(responseText);
      success = true;
      return msg;
    } catch (error) {
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
    if (username.replace(/ /g, "") === "") {
      setResponse("Username and password cannot be blank");
      return;
    }
    const apiResponse = await register(username, password);

    if (apiResponse.error !== undefined) {
      setResponse(apiResponse.error);
      return;
    } else {
      cookies.set("accessToken", apiResponse.accessToken, { path: "/" });
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
  } else {
    return (
      <div className="container form-container">
        <div className="sign-up">
          <h1>{strings.signup}</h1>
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
              {strings.signup}
            </button>
            <p>{response}</p>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;
