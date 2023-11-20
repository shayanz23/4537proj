import { useState } from "react";
import Ask from "./pages/Ask.tsx";
import NavBar from "./components/navbar.tsx";
import Body from "./components/body.tsx";

function App() {
  return (
    <div>
      <NavBar />
      <Body />
    </div>
  );
}

export default App;
