import Cookies from "universal-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./container.css";
import currentUser from "../currentUser";
import "./container.css";
import "../components/EditUserModal.css";

type Message = {
  text: string;
  sender: "user" | "ai";
};

function Ask() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (text: string, sender: "user" | "ai") => {
    const newMessage = { text, sender };
    setMessages([...messages, newMessage]);
  };

  const QuestionEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: Message = { text: question, sender: "user" };
    addMessage(question, "user");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: question }),
      }
    );
    const result = await response.json();

    if (result && result.generated_text) {
      const aiMessage: Message = { text: result.generated_text, sender: "ai" };
      addMessage(result.generated_text, "ai");
      setMessages([...messages, userMessage, aiMessage]); // Append both user's and AI's messages
    } else {
      addMessage("No response from the AI.", "ai");
      setMessages([...messages, userMessage]); // Append only user's message if no AI response
    }
    setQuestion(""); // Clear input after submitting
  };

  const cookies = new Cookies();

  const navigate = useNavigate();

  function checkAuth() {
    if (currentUser.status === "") {
      setTimeout(checkAuth, 1000);
    } else if (currentUser.status === "Unauthorized") {
      navigate("/login");
    }
  }

  checkAuth();

  return (
    <div className="container">
      <div className="conversation">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={QuestionEventHandler}>
        <input
          type="text"
          name="question"
          id="question"
          placeholder="Type a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-block btn-large">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Ask;
