import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from ".././components/firebaseConfig.tsx";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const cookies = new Cookies();
  const navigate = useNavigate();

  const LoginInEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const docRef = await getDocs(collection(db, "users"));
      docRef.docs.forEach((doc) => {
        const data = doc.data();
        if (data.username === username && data.password === password) {
          console.log("Document read with ID: ", doc.id);
          cookies.set("user", doc.data(), { path: "/" });
          if (data.admin === true) {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
      });
    } catch (e) {
      console.error("Error getting document: ", e);
    }
    setResponse("Username or password is incorrect!");
  };

  if (
    (cookies.get("user") !== null && cookies.get("user") !== undefined && !cookies.get("user").admin)
  ) {
    return <Navigate to="/dashboard" />;
  } else if (cookies.get("user") !== null && cookies.get("user") !== undefined && cookies.get("user").admin) {
    return <Navigate to="/admin" />;
  } else {
  return (
    <div className="container">
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
          <button type="submit" className="btn btn-primary btn-block btn-large">
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
