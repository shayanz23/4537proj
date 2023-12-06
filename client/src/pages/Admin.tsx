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

  const [userList, setUserList] = useState<User[]>([]);
  const [numOfReqs, setNumOfReqs] = useState([]);
  const URL = "http://localhost:3000/API/V1";
  const navigate = useNavigate();
  let success = false;

  const getAllUsers = async () => {
    // try {
    //   const response = await fetch(URL + "/admin/getAllUsers");
    //   const users = await response.json();
    //   return users;
    // } catch (error) {
    //   console.error("Error getting users", error);
    //   throw error;
    // }
    try {
      const response = await fetch(URL + "/admin/getAllUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("adminAccessToken")}`,
        },
      });

      const users = await response.json();
      success = true;
      return users;
    } catch (error) {
      console.error("Error deleting user", error);
      throw error;
    }
  };

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        let userArray = [];
        for (let i = 0; i < users.length; i++) {
          const user: User = {username: users[i].data.username, isAdmin: users[i].data.admin, numOfReqs: users[i].data.calls, id: users[i].id, status: ""};
          userArray.push(user);
        }
        setUserList(userArray);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);




  function addToList(id: string, username: string, isAdmin: boolean) {
    let new_array = [];
    for (let i = 0; i < userList.length; i++) {
      new_array.push(userList[i]);
    }
    const new_user: User = {
      id: id,
      username: username,
      isAdmin: isAdmin,
      numOfReqs: 0,
      status: ""
    };
    new_array.push(new_user);
    setUserList(new_array);
  }

  function removeUser(id: string) {
    let new_array = [];
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].id !== id) {
        new_array.push(userList[i]);
      }
    }
    setUserList(new_array);
  }

  function editUser(id: string, username: string, isAdmin: boolean) {
    let newArray = [];
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
              userUsername={user.username}
              userAdmin={user.isAdmin}
              numOfReqs={user.numOfReqs || 0}
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
