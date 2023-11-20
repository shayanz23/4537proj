import { useState } from "react"
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import db from ".././components/firebaseConfig.tsx";
import { useNavigate } from 'react-router-dom'; 

function SignUp() {
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const navigate = useNavigate();

  const SignUpEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        let found = false;
        const check = await getDocs(collection(db, "user"));
        check.docs.forEach((doc) => {
          const data = doc.data();
          if (data.username === username) {
            found = true;
          }
        });
        if (found === false) {
          const docRef = await addDoc(collection(db, "user"), {
            admin: false,
            username,
            password
          });
          console.log("Document written with ID: ", docRef.id);
          
          navigate("/login", {replace: true});
        } else {
          console.log("Username", username, "taken");
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  }

  return (
    <div className="container">
      <div className="sign-up">
        <h1>Sign Up</h1>
        <form onSubmit={ SignUpEventHandler }>
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
          <input
            type="password"
            name="password"
            placeholder="Confirm Password"
            required={true}
          />
          <p>{"\n"}</p>
          <button type="submit" className="btn btn-primary btn-block btn-large">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
