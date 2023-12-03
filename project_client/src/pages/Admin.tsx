import { Navigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "universal-cookie";
import UserTableRow from "../components/UserTableRow";
import AddUserModal from "../components/AddUserModal";
import "./container.css";
import ListUser from "../components/ListUser";

// const user = useContext(UserContext);

export default function Dashboard() {
  const cookies = new Cookies();
  // console.log(cookies.get("user"));

  const [userList, setUserList] = useState<ListUser[]>([]);

  function addToList(id: string, email: string, isAdmin: boolean) {
    console.log(userList);
    let new_array = [];
    for (let i = 0; i < userList.length; i++) {
      new_array.push(userList[i]);
    }
    const new_user: ListUser = { id: id, email: email, isAdmin: isAdmin };
    console.log(new_user);
    new_array.push(new_user);
    setUserList(new_array);
    console.log(userList);

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
  
  function editUser(id: string, email: string, isAdmin: boolean) {
    let new_array = [];
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].id !== id) {
        new_array.push(userList[i]);
      }
    }
    const new_user: ListUser = { id: id, email: email, isAdmin: isAdmin };
    new_array.push(new_user);
    setUserList(new_array);
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
            {userList.map(user =>
              <UserTableRow key={user.id} userId={user.id} userEmail={user.email} userAdmin={user.isAdmin} editUser={editUser} removeUser={removeUser}/>
              )}
          </tbody>
        </table>
        <AddUserModal addToList={addToList} />
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
