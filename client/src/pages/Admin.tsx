import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import UserTableRow from "../components/UserTableRow";
import AddUserModal from "../components/AddUserModal";
import "./container.css";
import User from "../components/User";
import "../components/EditUserModal.css";
import { useEffect, useState } from "react";
import currentUser from "../currentUser";

export default function Dashboard() {
  const cookies = new Cookies();
  const [strings, setStrings] = useState<any | null>(null);

    useEffect(() => {
      const fetchStrings = async () => {
        try {
          const response = await fetch('../strings.json'); // Adjust the path if needed
          const data = await response.json();
          setStrings(data);
        } catch (error) {
          console.error('Error fetching strings:', error);
        }
      };
  
      fetchStrings();
    }, []);
  const [userList, setUserList] = useState<User[]>([]);
  const [endpointList, setEndpointList] = useState<
    { calls: number; endpointRoute: string; method: string }[]
  >([]);
  const URL = "http://localhost:3000/API/V1";
  const navigate = useNavigate();
  let success = false;
  const [apiCountWarning, setApiCountWarning] = useState<string>("");

  const getAllUsers = async () => {
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
      throw error;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        let userArray = [];
        for (let i = 0; i < users.length; i++) {
          const user: User = {
            username: users[i].data.username,
            isAdmin: users[i].data.admin,
            numOfReqs: users[i].data.calls,
            id: users[i].id,
            status: "",
          };
          userArray.push(user);
        }
        setUserList(userArray);
      } catch (error) {}
    };

    fetchUsers();
  }, []);

  const getAllEndpoints = async () => {
    try {
      const response = await fetch(URL + "/admin/getAllEndpoints", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("adminAccessToken")}`,
        },
      });

      const res = await response.json();
      success = true;
      return res.endpoints;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const users = await getAllEndpoints();

        setEndpointList(users);
      } catch (error) {}
    };

    fetchEndpoints();
  }, []);

  function addToUserList(id: string, username: string, isAdmin: boolean) {
    let new_array = [];
    for (let i = 0; i < userList.length; i++) {
      new_array.push(userList[i]);
    }
    const new_user: User = {
      id: id,
      username: username,
      isAdmin: isAdmin,
      numOfReqs: 0,
      status: "",
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

  async function checkAuth() {
    if (currentUser.status === "") {
      setTimeout(checkAuth, 500);
    } else if (currentUser.status === "Authorized" && !currentUser.isAdmin) {
      navigate("/dashboard");
    } else if (currentUser.status === "Unauthorized") {
      navigate("/login");
    } else {
    }
  }

  useEffect(() => {
    checkAuth();
    if (currentUser.numOfReqs > 20) {
      setApiCountWarning("Warning: You have passed your API call limit.");
    }
  });

  return (
    <div className="container">
      <h1 style={{ width: "100%", marginTop: "10px" }}>{strings ? strings.aDash: 'Loading...'}</h1>
      <table style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>{strings ? strings.method : 'Loading...'}</th>
            <th>{strings ? strings.endpoint : 'Loading...'}</th>
            <th>{strings ? strings.calls : 'Loading...'}</th>
          </tr>
        </thead>
        <tbody>
          {endpointList.map((endpoint) => (
            <tr key={endpoint.endpointRoute}>
              <td>{endpoint.method}</td>
              <td>{endpoint.endpointRoute}</td>
              <td>{endpoint.calls}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table style={{ width: "100%", marginTop: "10px" }}>
        {/* Table for User Details */}
        <thead>
          <tr>
            <th>{strings ? strings.userU : 'Loading...'}</th>
            <th>{strings ? strings.adminM : 'Loading...'}</th>
            <th>{strings ? strings.numOfReqs : 'Loading...'}</th>
            <th>{strings ? strings.edit : 'Loading...'}</th>
            <th>{strings ? strings.delete : 'Loading...'}</th>
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
      <AddUserModal addToList={addToUserList} />
      <p>{strings ? strings.warning : 'Loading...'}</p>
    </div>
  );
}
