import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "universal-cookie";
import UserTableRow from "../components/UserTableRow";
import AddUserModal from "../components/AddUserModal";
import "./container.css";
import User from "../components/User";
import "../components/EditUserModal.css";
import { useEffect } from "react";
import currentUser from "../currentUser";


export default function Dashboard() {
  const cookies = new Cookies();
  // console.log(cookies.get("user"));

  const [userList, setUserList] = useState<User[]>([]);
  const [numOfReqs, setNumOfReqs] = useState([]);
  const URL = "http://localhost:3000/API/V1";
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const response = await fetch(URL + "/admin/getAllUsers");
      const users = await response.json();
      console.log(users);
      return users;
    } catch (error) {
      console.error("Error getting users", error);
      throw error;
    }
  };

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUserList(users);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);




  // Add a new user to the list of users.
  function addToList(id: string, username: string, isAdmin: boolean) {
    // Create a new array to hold the updated list of users, with the new user added.
    let new_array = [];
    for (let i = 0; i < userList.length; i++) {
      new_array.push(userList[i]);
    }
    // Add the new user to the new array.
    const new_user: User = {
      id: id,
      username: username,
      isAdmin: isAdmin,
      numOfReqs: 0,
      data: undefined,
      status: ""
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

  function checkAuth() {
    if (currentUser.status === "") {
      setTimeout(checkAuth, 1000);
    } else if (currentUser.status === "Authorized" && !currentUser.isAdmin) {
      navigate("/dashboard");
    } else if (currentUser.status === "Unauthorized") {
      navigate("/login");
    }
  }

  checkAuth();

  // If the user is not logged in, redirect them to the login page.
  // If the user is logged in but not an admin, redirect them to the dashboard.
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
        <tbody>
          <tr>
            <td>POST</td>
            <td>/API/V1/auth/register</td>
            <td>0</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/API/V1/auth/login</td>
            <td>0</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/API/V1/userInfo/getUserName</td>
            <td>0</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/API/V1/userInfo/getCalls</td>
            <td>0</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/API/V1/admin/getAllUsers</td>
            <td>0</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/API/V1/admin/deleteUser</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      <table style={{ width: "100%", marginTop: "10px" }}>
        {/* Table for User Details */}
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
              key={user.id}
              userId={user.id}
              userUsername={user.data.username}
              userAdmin={user.data.admin}
              numOfReqs={user.data.calls || 0}
              editUser={editUser}
              removeUser={removeUser}
            />
          ))}
        </tbody>
      </table>
      <AddUserModal addToList={addToList} />
    </div>
  );
}
