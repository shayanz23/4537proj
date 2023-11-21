import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";



export default function Dashboard() {
  const cookies = new Cookies();
  if (
    (cookies.get("user") !== null &&
      cookies.get("user") !== undefined &&
      cookies.get("user").admin)
  ) {
    return <Navigate to="/admin" />;
  } else if (
    (cookies.get("user") !== null && cookies.get("user") !== undefined)
  ) {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
}
