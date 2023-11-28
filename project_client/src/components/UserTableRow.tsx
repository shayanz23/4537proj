export default function UserTableRow(props: { UserId: string; UserEmail: string; UserAdmin: boolean; }) {
  const Id = props.UserId;
  const Email = props.UserEmail;
  const Admin = props.UserAdmin;
  return (
    <tr id={Id + "-row"}>
      <td id={Id + "-email"}>{Email}</td>
      <td id={Id + "-admin"}>{Admin.valueOf()}</td>
      <td>
        <button id={Id + "-edit"} className="btn btn-primary btn-block btn-large">Edit</button>
      </td>
      <td>
        <button id={Id + "-delete"} className="btn btn-primary btn-block btn-large">Delete</button>
      </td>
    </tr>
  );
}
