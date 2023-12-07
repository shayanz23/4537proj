import "./EditUserModal.css";
import Modal from "react-modal";
import React from "react";
import {pwValidate} from "./Validate";
import apiUrl from "../apiUrl";
import Cookies from "universal-cookie";

export default function EditUserModal(props: {
  userId: string;
  userUsername: string;
  userAdmin: boolean;
  editUser: Function;
}) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [username, setUsername] = React.useState(props.userUsername);
  const [isAdmin, setIsAdmin] = React.useState(props.userAdmin);
  const [submitError, setSubmitError] = React.useState("");
  const cookies = new Cookies();

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    setUsername(props.userUsername);
  }

  function handleAdminChange() {
    setIsAdmin(!isAdmin);
  }

  function closeModal() {
    setIsAdmin(props.userAdmin);
    setUsername(props.userUsername);
    setIsOpen(false);
  }

  async function editUserInDb() {
    try {
      const response = await fetch(apiUrl + `/admin/modifyUser/${props.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("adminAccessToken")}`,
        },
        body: JSON.stringify({
          username: username,
          isAdmin: isAdmin,
        }),
      });

      const responsejson = await response.json();

      return responsejson;
    } catch (error) {
      return error;
    }
  }

  async function submit() {
    try {
      const res = await editUserInDb();
      if (res.error !== undefined) {
        setSubmitError(res.error);
        return;
      }
      props.editUser(props.userId, username, isAdmin);
      closeModal();
    } catch (e) {
      if (typeof e === "string") {
        setSubmitError(e);
      } else if (e instanceof Error) {
        setSubmitError(e.message);
      }
    }
  }

  return (
    <div>
      <button
        className="btn btn-primary btn-block btn-large"
        onClick={openModal}
      >
        Edit User
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Edit User Modal"
        ariaHideApp={false}
      >
        <div id="popup-container">
          <h3 id="popup-title">Edit User</h3>
          <input
            id="username-input"
            type="text"
            placeholder="User Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label id="admin-label" htmlFor="admin">
            Admin?
          </label>
          <input
            type="checkbox"
            id="admin-checkbox"
            checked={isAdmin}
            onChange={handleAdminChange}
          />
          <label id="error-label" htmlFor="admin">
            {submitError}
          </label>
          <button
            id="cancel-button"
            className="btn btn-primary btn-block btn-large"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            id="submit-button"
            className="btn btn-primary btn-block btn-large"
            onClick={submit}
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
}
