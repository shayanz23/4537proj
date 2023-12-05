import Modal from "react-modal";
import React from "react";
import { set } from "firebase/database";
import { pwValidate } from "./Validate";
import Cookies from "universal-cookie";

export default function AddUserModal(props: { addToList: Function }) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [usernameField, setUsernameField] = React.useState("");
  const [pwField, setPwField] = React.useState("");
  const [isAdminField, setIsAdminField] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [demoId, setDemoId] = React.useState(0);
  const cookies = new Cookies;

  const URL = 'http://localhost:3000/API/V1';

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

  const addUserToDb = async (username: string, password: string, isAdmin: boolean) => {
    try {

      console.log(username, password, isAdmin)
      const response = await fetch(URL + "/admin/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
        body: JSON.stringify({
          username: username,
          password: password,
          isAdmin: isAdmin,
        }),
      });
  
      const responseText = await response.text();
      console.log(responseText); // Log the raw response text
      
      const msg = JSON.parse(responseText);
      return msg;      
    } catch (error) {
      console.error("Error adding user", error);
      throw error;
    }
  };
  
  

  async function submit() {
    try {
      console.log("Username:", usernameField);
      console.log("Password:", pwField);
      console.log("isAdmin:", isAdminField);

  
      await addUserToDb(usernameField, pwField, isAdminField);
  
      const id = demoId;
      setDemoId(demoId + 1);
      props.addToList(id, usernameField, isAdminField);
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
