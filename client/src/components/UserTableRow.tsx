import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import currentUser from "../currentUser";

export default function UserTableRow(props: {
  userId: string;
  userUsername: string;
  userAdmin: boolean;
  numOfReqs: number;
  editUser: Function;
  removeUser: Function;
}) {
  const id = props.userId;
  const username = props.userUsername;
  const admin = props.userAdmin;
  const adminString = admin ? "true" : "false";

  if (username === currentUser.username) { 
    return (
      <tr key={id + "-row"}>
        <td key={id + "-username"}>{username}</td>
        <td key={id + "-admin"}>{adminString}</td>
        <td key={id + "-numOfReqs"}>{props.numOfReqs}</td>
        <td>
          
        </td>
        <td>
          <p>Current User</p>
        </td>
      </tr>
    );
  } else {
    return (
      <tr key={id + "-row"}>
        <td key={id + "-username"}>{username}</td>
        <td key={id + "-admin"}>{adminString}</td>
        <td key={id + "-numOfReqs"}>{props.numOfReqs}</td>
        <td>
          <EditUserModal
            key={id + "-edit"}
            userId={id}
            userUsername={username}
            userAdmin={admin}
            editUser={props.editUser}
          />
        </td>
        <td>
          <DeleteUserModal
            key={id + "-delete"}
            userId={id}
            userUsername={username}
            removeUser={props.removeUser}
          />
        </td>
      </tr>
    );
  }


  
}
