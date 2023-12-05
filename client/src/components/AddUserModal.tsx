import Modal from "react-modal";
import React from "react";
import { set } from "firebase/database";
import { pwValidate } from "./Validate";
import { Analytics } from "firebase/analytics";

export default function AddUserModal(props: { addToList: Function }) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [usernameField, setUsernameField] = React.useState("");
  const [pwField, setPwField] = React.useState("");
  const [isAdminField, setIsAdminField] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [demoId, setDemoId] = React.useState(0);

  const URL = 'http://localhost:3000/API/V1/admin';

  const addUser = async (username: any, password: any, isAdmin: Analytics) => {
    try {
      const response = await fetch(`${URL}/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          isAdmin,
        }),
      });
  
      const newUser = await response.json();
      return newUser;
    } catch (error) {
      console.error('Error adding user', error);
      throw error;
    }
  };
  

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
    setUsernameField("");
    setPwField("");
    setSubmitError("");
    setIsOpen(false);
  }

  function addUserToDb() {
    // throw Error("Not implemented");
  }

  async function submit() {
    try {
      pwValidate(pwField);
  
      await addUser(usernameField, pwField, isAdminField);
  
      const id = demoId;
      setDemoId(demoId + 1);
      props.addToList(id, usernameField, isAdminField);
  
      closeModal();
    } catch (e) {
      if (typeof e === 'string') {
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
            id="username-input"
            type="text"
            placeholder="User Username"
            value={usernameField}
            onChange={(e) => setUsernameField(e.target.value)}
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
