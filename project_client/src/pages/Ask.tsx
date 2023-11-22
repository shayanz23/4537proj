import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import "./container.css";

function Ask() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const QuestionEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        headers: {
          Authorization: `Bearer ${"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"}`,
        },
        method: "POST",
        body: JSON.stringify(question),
      }
    );
    const result = await response.json();
    setAnswer(
      result[0].generated_text
        .trim()
        .substring(question.length, result[0].generated_text.length)
    );
  };

  const cookies = new Cookies();
  if (cookies.get("user") !== null && cookies.get("user") !== undefined) {
    return (
      <div className="container">
        <h2>Which answer is by AI?</h2>
        <form onSubmit={QuestionEventHandler}>
          <label htmlFor="question">Question</label>
          <input
            type="text"
            name="question"
            id="question"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <p>{"\n"}</p>
          <button type="submit" className="btn btn-primary btn-block btn-large">
            Submit Question
          </button>
          <p>{"\n"}</p>
        </form>
        <label htmlFor="answer_area_1">Answer 1</label>
        <label htmlFor="answer_area_2">Answer 2</label>
        <p>{"\n"}</p>
        <textarea
          name="text"
          id="answer_area_1"
          className="form-control"
          cols={30}
          rows={15}
          title="Answer 1"
          value={answer}
          readOnly
        ></textarea>
        <textarea
          name="text"
          id="answer_area_2"
          className="form-control"
          cols={30}
          rows={15}
          title="Answer 2"
          value={answer}
          readOnly
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
