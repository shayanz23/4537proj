import Modal from "react-modal";
import React from "react";
import { remove } from "firebase/database";

export default function DeleteUserModal(props: {
  userId: string;
  userUsername: string;
  removeUser: Function;
}) {
  const username = props.userUsername;
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
