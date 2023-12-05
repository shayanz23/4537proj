import currentUser from "./currentUser";
import Cookies from "universal-cookie";
import apiUrl from "./apiUrl.tsx";

const cookies = new Cookies();

async function fetchCalls() {
    // Default options are marked with *
    const response = await fetch(apiUrl + "/userInfo/getCalls", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    console.log(response.status);
    if (response.status === 401 || response.status === 403) {
      return;
    }
    response.json().then((data) => {
      console.log(data);
      currentUser.numOfReqs = data.calls;
      console.log(currentUser.numOfReqs);
    }); // parses JSON response into native JavaScript objects
  }
  async function fetchAdmin() {
    // Default options are marked with *
    const response = await fetch(apiUrl + "/userInfo/getAdminStatus", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    console.log(response.status);
    if (response.status === 401 || response.status === 403) {
      return;
    }
    response.json().then((data) => {
      console.log(data);
      currentUser.isAdmin = data.adminStatus;
      console.log(currentUser.isAdmin);
    }); // parses JSON response into native JavaScript objects
  }

  async function fetchUsername() {
    // Default options are marked with *
    const response = await fetch(apiUrl + "/userInfo/getUserName", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    console.log(response.status);
    if (response.status === 401 || response.status === 403) {
      currentUser.status = "Unauthorized";
      return;
    }
    response.json().then((data) => {
      console.log(data);
      currentUser.username = data.username;
      console.log(currentUser.username);
      currentUser.status = "Authorized";
    }); // parses JSON response into native JavaScript objects
  }

  export { fetchCalls, fetchAdmin, fetchUsername };