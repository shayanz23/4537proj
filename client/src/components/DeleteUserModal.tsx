import Modal from "react-modal";
import React from "react";
import apiUrl from "../apiUrl";
import Cookies from "universal-cookie";

export default function DeleteUserModal(props: {
  userId: string;
  userUsername: string;
  removeUser: Function;
}) {
  const username = props.userUsername;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const cookies = new Cookies;
  let success = false;

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function deleteUserFromDb(username: string) {
    try {
      const response = await fetch(apiUrl + "/admin/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          Authorization: `Bearer ${cookies.get("adminAccessToken")}`,
        }),
      });

      const responseText = await response.text();
      console.log(responseText); // Log the raw response text

      const msg = JSON.parse(responseText);
      success = true;
      return msg;
    } catch (error) {
      console.error("Error deleting user", error);
      throw error;
    }
  }
  async function submit() {
    deleteUserFromDb(username);
    if (success) {
      props.removeUser(props.userId);
      closeModal();
    }
  }

  return (
    <div>
      <button
        className="btn btn-primary btn-block btn-large"
        onClick={openModal}
      >
        Delete
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Delete User Modal"
        ariaHideApp={false}
      >
        <div id="popup-container">
          <h4 id="popup-title">Delete {username}?</h4>
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
