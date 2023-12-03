import "./DeleteUserModal.css";
import Modal from "react-modal";
import React from "react";
import { remove } from "firebase/database";

export default function DeleteUserModal(props: {
  userId: string;
  userEmail: string;
  removeUser: Function;
}) {
  const email = props.userEmail;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  function submit() {
    props.removeUser(props.userId);
    closeModal();
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
          <h4 id="popup-title">Delete {email}?</h4>
          <button
            id="close-button"
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
