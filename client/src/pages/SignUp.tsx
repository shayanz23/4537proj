import { useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from ".././components/firebaseConfig.tsx";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./container.css";
import { pwValidate } from "../components/Validate.tsx";
import currentUser from "../currentUser";

function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const navigate = useNavigate();
  const cookies = new Cookies();

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

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid(username, password)) {
      return;
    }
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setResponse("Username already used!");
        return;
      }
      if (password != confirmedPassword) {
        setResponse("Passwords don't match!");
        return;
      }
      await addDoc(collection(db, "users"), {
        admin: false,
        username: username,
        password,
      });
      cookies.set(
        "user",
        { admin: false, username: username, password },
        { path: "/" }
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };
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
