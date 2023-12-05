import { Navigate, useNavigate } from "react-router-dom";
import "./container.css";
import "../components/EditUserModal.css";
import currentUser from "../currentUser";


export default function Dashboard() {

  const navigate = useNavigate();

  function checkAuth() {
    if (currentUser.status === "") {
      setTimeout(checkAuth, 1000);
    } else if (currentUser.status === "Authorized" && currentUser.isAdmin) {
      navigate("/admin");
    } else if (currentUser.status === "Unauthorized") {
      navigate("/login");
    }
  }

  checkAuth();

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Your total number of requests: {currentUser.numOfReqs}</p>
    </div>
  );
}
