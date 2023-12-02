import "./EditUserModal.css";
import Modal from "react-modal";
import React from "react";

export default function EditUserModal(props: {
  userId: string;
  userEmail: string;
  userAdmin: boolean;
}) {
  const id = props.userId;
  const email = props.userEmail;
  const admin = props.userAdmin;
  const adminString = admin ? "true" : "false";
  let subtitle: string;
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
    closeModal();
  }

  return (
    <div>
      <button
        className="btn btn-primary btn-block btn-large"
        onClick={openModal}
      >
        Open Modal
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <div id="popup-container">
          <h3 id="popup-title">Edit User</h3>
          <input
            id="email-input"
            type="text"
            placeholder="User Email"
            defaultValue={email}
          />
          <label id="admin-label" htmlFor="admin">
            Admin?
          </label>
          <input type="checkbox" id="admin-checkbox" defaultChecked={admin} />
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
