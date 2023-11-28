import EditUserPopup from "./EditUserPopup";

export default function UserTableRow(props: {
  userId: string;
  userEmail: string;
  userAdmin: boolean;
}) {
  const id = props.userId;
  const email = props.userEmail;
  const admin = props.userAdmin;
  const adminString = admin ? "true" : "false";

  return (
    <tr id={id + "-row"}>
      <td id={id + "-email"}>{email}</td>
      <td id={id + "-admin"}>{adminString}</td>
      <td>
        <EditUserPopup userId={id} userEmail={email} userAdmin={admin} />
      </td>
      <td>
        <button
          id={id + "-delete"}
          className="btn btn-primary btn-block btn-large"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
