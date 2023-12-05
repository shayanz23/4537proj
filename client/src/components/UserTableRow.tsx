import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

export default function UserTableRow(props: {
  userId: string;
  userEmail: string;
  userAdmin: boolean;
  numOfReqs: number;
  editUser: Function;
  removeUser: Function;
}) {
  const id = props.userId;
  const email = props.userEmail;
  const admin = props.userAdmin;
  const adminString = admin ? "true" : "false";

  return (
    <tr key={id + "-row"}>
      <td key={id + "-email"}>{email}</td>
      <td key={id + "-admin"}>{adminString}</td>
      <td key={id + "-numOfReqs"}>{props.numOfReqs}</td>
      <td>
        <EditUserModal key={id+ "-edit"} userId={id} userEmail={email} userAdmin={admin} editUser={props.editUser}/>
      </td>
      <td>
        <DeleteUserModal key={id+ "-delete"} userId={id} userEmail={email} removeUser={props.removeUser}/>
      </td>
    </tr>
  );
}
