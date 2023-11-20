import { useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import db from ".././components/firebaseConfig.tsx";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { UserContext } from "../Contexts.tsx";
import { useContext } from "react";
import Cookies from "universal-cookie";

function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const cookies = new Cookies();

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      const docRef = await addDoc(collection(db, "users"), {
        admin: false,
        username,
        password,
      });
      cookies.set("user", { admin: false, username, password }, { path: "/" });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };
  console.log(cookies.get("user"));
  if (
    user ||
    (cookies.get("user") !== null && cookies.get("user") !== undefined && !cookies.get("user").admin)
  ) {
    return <Navigate to="/dashboard" />;
  } else {
    return (
      <UserContext.Provider value={user}>
        <div className="container">
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
      </UserContext.Provider>
    );
  }
}

export default SignUp;
