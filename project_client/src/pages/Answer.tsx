import Cookies from "universal-cookie";
import { Navigate, redirect, useNavigate } from "react-router-dom";

function Answer() {
  const cookies = new Cookies();
  if (cookies.get("user") !== null && cookies.get("user") !== undefined) {
    return (
      <div className="container">
        <p>Your Question is:</p>
        <p id="user_qn"></p>
        <textarea
          name="text"
          id="answer_area_1"
          cols={30}
          rows={10}
          title="Answer 1"
        ></textarea>
        <button
          type="submit"
          className="btn btn-primary btn-block btn-large"
          onClick={Submit}
        >
          Submit Answer
        </button>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
}

function Submit() {
  console.log("Submit Answer");
}

export default Answer;
