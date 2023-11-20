import Cookies from "universal-cookie";
import { Navigate, redirect, useNavigate } from "react-router-dom";

function Ask() {
  const cookies = new Cookies();
  if (
    cookies.get("user") !== null && cookies.get("user") !== undefined
  ) {
    return (
      <div className="container">
        <h2>Which answer is by AI?</h2>
        <label htmlFor="question">Question</label>
        <input type="text" name="question" id="question" placeholder="Question" />
        <p>{"\n"}</p>
        <button type="submit" className="btn btn-primary btn-block btn-large">
          Submit Question
        </button>
        <p>{"\n"}</p>
        <label htmlFor="answer_area_1">Answer 1</label>
        <label htmlFor="answer_area_2">Answer 2</label>
        <p>{"\n"}</p>
        <textarea
          name="text"
          id="answer_area_1"
          cols={30}
          rows={10}
          title="Answer 1"
        ></textarea>
        <textarea
          name="text"
          id="answer_area_2"
          cols={30}
          rows={10}
          title="Answer 2"
        ></textarea>
        <p>{"\n"}</p>
        <label htmlFor="answer_1">Answer 1</label>
        <input type="radio" name="answer" id="answer_1" value="1" />
        <label htmlFor="answer_2">Answer 2</label>
        <input type="radio" name="answer" id="answer_2" value="2" />
        <p>{"\n"}</p>
        <button type="submit" className="btn btn-primary btn-block btn-large">
          Submit Choice
        </button>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }

}

export default Ask;
