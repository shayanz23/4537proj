import { useNavigate } from "react-router-dom";
import "./container.css";
import "../components/EditUserModal.css";
import currentUser from "../currentUser";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [calls, setCalls] = useState<number>(0);
  const [apiCountWarning, setApiCountWarning] = useState<string>("");

  function setCalls2() {
    setCalls(currentUser.numOfReqs)
  }
  async function checkAuth() {
    if (currentUser.status === "") {
      setTimeout(checkAuth, 250);
    } else if (currentUser.status === "Authorized" && currentUser.isAdmin) {
      navigate("/admin");
    } else if (currentUser.status === "Unauthorized") {
      navigate("/login");
    } else {
      setCalls2();
    }
  }

  useEffect(() => {
    checkAuth();
    if (calls > 20) {
      setApiCountWarning("You have passed your API call limit.")
    }  
  });

  
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Your total number of requests: {calls}</p>
      <p>{apiCountWarning}</p>
    </div>
  );
}
