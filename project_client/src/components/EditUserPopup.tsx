import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./EditUserPopup.css";

export default function EditUserPopup(props: {
  userId: string;
  userEmail: string;
  userAdmin: boolean;
}) {
  const id = props.userId;
  const email = props.userEmail;
  const admin = props.userAdmin;
  const adminString = admin ? "true" : "false";
  return (
    <Popup
      trigger={
        <button className="btn btn-primary btn-block btn-large">Edit</button>
      }
      modal
      nested
    >
      <div id="popup-container">
        <h3 id="popup-title">Edit User</h3>
        <input id="email-input" type="text" placeholder="User Email" defaultValue={email} />
        <label id="admin-label" htmlFor="admin">Admin?</label>
        <input type="checkbox" id="admin-checkbox" defaultChecked={admin} />
        <button
          id="submit-button"
          className="btn btn-primary btn-block btn-large"
          onClick={() => close()}
        >
          Submit
        </button>
      </div>
    </Popup>
  );
}
