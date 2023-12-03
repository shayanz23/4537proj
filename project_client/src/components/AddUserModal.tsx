import Modal from "react-modal";
import React from "react";
import { set } from "firebase/database";
import { checkEmailValidity } from "./Validity";

export default function AddUserModal(props: { addToList: Function }) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [emailField, setEmailField] = React.useState("");
  const [pwField, setPwField] = React.useState("");
  const [isAdminField, setIsAdminField] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [demoId, setDemoId] = React.useState(0);

  function handleAdminChange() {
    setIsAdminField(!isAdminField);
  }

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsAdminField(false);
    setEmailField("");
    setPwField("");
    setSubmitError("");
    setIsOpen(false);
  }

  function addUserToDb() {
    // throw Error("Not implemented");
  }

  function submit() {
    try {
      checkEmailValidity(emailField);
      addUserToDb();
      const id = demoId;
      setDemoId(demoId + 1);
      props.addToList(id, emailField, isAdminField);
      closeModal();
    } catch (e) {
      if (typeof e === "string") {
        setSubmitError(e); // works, `e` narrowed to string
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
            value={emailField}
            onChange={(e) => setEmailField(e.target.value)}
          />
          <input
            id="password-input"
            type="password"
            placeholder="User Password"
            value={pwField}
            onChange={(e) => setPwField(e.target.value)}
          />
          <label id="admin-label" htmlFor="admin">
            Admin?
          </label>
          <input
            type="checkbox"
            id="admin-checkbox"
            checked={isAdminField}
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
