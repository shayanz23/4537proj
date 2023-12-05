import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./container.css";
import { useState } from "react";
import currentUser from "../currentUser";

export default function Dashboard() {
  const [numOfReqs, setNumOfReqs] = useState(0);
  const cookies = new Cookies();
  if (
    cookies.get("user") !== null &&
    cookies.get("user") !== undefined &&
    cookies.get("user").admin
  ) {
    return <Navigate to="/admin" />;
  } else if (
    cookies.get("user") !== null &&
    cookies.get("user") !== undefined
  ) {
    return (
      <div className="container">
        <h1>Dashboard</h1>
        <p>Your total number of requests: {numOfReqs}</p>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
