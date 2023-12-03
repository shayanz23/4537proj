import "./AddUserModal.css";
import Modal from "react-modal";
import React from "react";

export default function AddUserModal(props: { addToList: Function }) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [demoId, setDemoId] = React.useState(0);

  function handleAdminChange() {
    setIsAdmin(!isAdmin);
  }

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
    const id = demoId
    setDemoId(demoId+1);
    props.addToList(id, email, isAdmin);
    setIsAdmin(false);
    setEmail("");
    setPw("");
    closeModal();
  }

  return (
    <div>
      <button
        className="btn btn-primary btn-block btn-large"
        onClick={openModal}
      >
        Add User
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Add User Modal"
        ariaHideApp={false}
      >
        <div id="popup-container">
          <h3 id="popup-title">Add User</h3>
          <input
            id="email-input"
            type="text"
            placeholder="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password-input"
            type="text"
            placeholder="User Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
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
