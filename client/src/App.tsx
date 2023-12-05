import NavBar from "./components/Navbar.tsx";
import Body from "./components/Body.tsx";
import Footer from "./components/Footer.tsx";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import "./App.css";
import "./pages/container.css";
import currentUser from "./currentUser.tsx";
import apiUrl from "./apiUrl.tsx";
import { useEffect, useState } from "react";

function App() {
  useEffect(() => {
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
        console.log("Unauthorized");
        currentUser.status = "Unauthorized";
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
        console.log("Unauthorized");
        currentUser.status = "Unauthorized";
        return;
      }
      response.json().then((data) => {
        console.log(data);
        currentUser.isAdmin = data.adminStatus;
        console.log(currentUser.isAdmin);
      }); // parses JSON response into native JavaScript objects
    }
    fetchCalls();
    fetchAdmin();
  });
  return (
    <div className="main-div">
      <div>{currentUser.status}</div>
      <NavBar />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
