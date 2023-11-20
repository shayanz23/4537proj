import { useState } from "react"
import { collection, getDocs } from "firebase/firestore"; 
import db from ".././components/firebaseConfig.tsx";
import { useNavigate } from "react-router-dom";

function Login() {
    const [ username, setUsername ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const navigate = useNavigate();
  
    const LoginInEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      let found = false;
      try {
          const docRef = await getDocs(collection(db, "user"));
          docRef.docs.forEach((doc) => {
            const data = doc.data();
            if (data.username === username && data.password === password) {
              found = true;
              console.log("Document read with ID: ", doc.id);
              if (data.admin === true) {
                navigate("/admin");
              } else {
                navigate("/ask");
              }
            }
          });
        } catch (e) {
          console.error("Error getting document: ", e);
        }
        console.log("Login not found");
    }

  return (
    <div className="container">
      <div className="login">
        <h1>Log In</h1>
        <form onSubmit={ LoginInEventHandler }>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required={true}
            value={ username }
            onChange={(e) => setUsername(e.target.value)}
          />
          <p>{"\n"}</p>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required={true}
            value={ password }
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>{"\n"}</p>
          <button type="submit" className="btn btn-primary btn-block btn-large">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
