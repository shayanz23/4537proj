import NavBar from "./components/Navbar.tsx";
import Body from "./components/Body.tsx";
import Footer from "./components/Footer.tsx";
import Cookies from "universal-cookie";
import "./App.css";
import "./pages/container.css";
import { fetchCalls, fetchAdmin, fetchUsername } from "./userFetches.tsx";
import { useEffect, useState } from "react";

const cookies = new Cookies();

function App() {
  useEffect(() => {
    fetchCalls();
    fetchAdmin();
    fetchUsername();
  });
  return (
    <div className="main-div">
      <NavBar />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
