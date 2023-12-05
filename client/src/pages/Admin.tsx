import { Navigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "universal-cookie";
import UserTableRow from "../components/UserTableRow";
import AddUserModal from "../components/AddUserModal";
import "./container.css";
import ListUser from "../components/ListUser";
import "../components/EditUserModal.css";

// const user = useContext(UserContext);

export default function Dashboard() {
  const cookies = new Cookies();
  // console.log(cookies.get("user"));

  const [userList, setUserList] = useState<ListUser[]>([]);
  const [numOfReqs, setNumOfReqs] = useState([]);

  // Add a new user to the list of users.
  function addToList(id: string, username: string, isAdmin: boolean) {
    // Create a new array to hold the updated list of users, with the new user added.
    let new_array = [];
    for (let i = 0; i < userList.length; i++) {
      new_array.push(userList[i]);
    }
    // Add the new user to the new array.
    const new_user: ListUser = {
      id: id,
      username: username,
      isAdmin: isAdmin,
      numOfReqs: 0,
    };
    new_array.push(new_user);
    setUserList(new_array);
  }

  //Remove the user with the given id from the list of users
  function removeUser(id: string) {
    // Create a new array to hold the updated list of users, without the User being removed.
    let new_array = [];
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].id !== id) {
        new_array.push(userList[i]);
      }
    }
    // Update the list of users with the new array.
    setUserList(new_array);
  }

  //Find the user with the given id and update their username and admin status
  function editUser(id: string, username: string, isAdmin: boolean) {
    // Create a new array to hold the updated list of users.
    let newArray = [];
    // Find the user with the given id and update their username and admin status.
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].id !== id) {
        newArray.push(userList[i]);
      } else {
        userList[i].username = username;
        userList[i].isAdmin = isAdmin;
        newArray.push(userList[i]);
      }
    }
    setUserList(newArray);
  }

  // If the user is not logged in, redirect them to the login page.
  // If the user is logged in but not an admin, redirect them to the dashboard.
  if (cookies.get("user") !== undefined && !cookies.get("user").admin) {
    return <Navigate to="/dashboard" />;
  } else if (cookies.get("user") !== undefined && cookies.get("user").admin) {
    return (
      <div className="container">
        <h1 style={{ width: "100%", marginTop: "10px" }}>Admin Dashboard</h1>
        <table style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Requests</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <table style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>User username</th>
              <th>Admin?</th>
              <th>Number Of Requests</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <UserTableRow
                userId={user.id}
                userUsername={user.username}
                userAdmin={user.isAdmin}
                numOfReqs={user.numOfReqs}
                editUser={editUser}
                removeUser={removeUser}
              />
            ))}
          </tbody>
        </table>
        <AddUserModal addToList={addToList} />
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
