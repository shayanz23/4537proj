import { Navigate, useNavigate } from "react-router-dom";
import "./container.css";
import "../components/EditUserModal.css";
import currentUser from "../currentUser";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [calls, setCalls] = useState<number>(0);

  function setCalls2() {
    setCalls(currentUser.numOfReqs)
  }
  function checkAuth() {
    if (currentUser.status === "") {
      setTimeout(checkAuth, 1000);
    } else if (currentUser.status === "Authorized" && currentUser.isAdmin) {
      navigate("/admin");
    } else if (currentUser.status === "Unauthorized") {
      navigate("/login");
    } else {
      setTimeout(setCalls2, 1000);
    }
  }

  checkAuth();

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Your total number of requests: {calls}</p>
    </div>
  );
}
