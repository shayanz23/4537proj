import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import UserTableRow from "../components/UserTableRow";
import "./container.css";

// const user = useContext(UserContext);

export default function Dashboard() {
  const cookies = new Cookies();
  console.log(cookies.get("user"));
  function add_user() {
    console.log("add user");
  }
  if (
    cookies.get("user") !== null &&
    cookies.get("user") !== undefined &&
    !cookies.get("user").admin
  ) {
    return <Navigate to="/dashboard" />;
  } else if (
    cookies.get("user") !== null &&
    cookies.get("user") !== undefined &&
    cookies.get("user").admin
  ) {
    return (
      <div className="container">
        <h1 style={{ width: "100%", marginTop: "10px" }}>Admin Dashboard</h1>
        <table style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>User email</th>
              <th>Admin?</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <UserTableRow
              userId="1"
              userEmail="test@test.ca"
              userAdmin={true}
            />
          </tbody>
        </table>
        <button className="btn btn-primary btn-block btn-large">
          Add User
        </button>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
}
