import { collection, addDoc } from "firebase/firestore"; 



function SignUp() {
  return (
    <div className="container">
      <div className="sign-up">
        <h1>Sign Up</h1>
        <form action="sign-up" method="post">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required={true}
          />
          <p>{"\n"}</p>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required={true}
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

function SignUpEventHandler() {
    try {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

export default SignUp;
