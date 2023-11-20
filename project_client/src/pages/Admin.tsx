import { Navigate, redirect, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

// const user = useContext(UserContext);

export default function Dashboard() {
  const cookies = new Cookies();
  console.log(cookies.get("user"));
  if (
    cookies.get("user") !== null && cookies.get("user") !== undefined && !cookies.get("user").admin
  ) {
    return <Navigate to="/dashboard" />;
  } else if (cookies.get("user") !== null && cookies.get("user") !== undefined && cookies.get("user").admin) {
    return (
      <div>
        <h1>Admin Dashboard</h1>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
}