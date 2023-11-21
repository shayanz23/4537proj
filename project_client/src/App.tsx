import NavBar from "./components/Navbar.tsx";
import Body from "./components/Body.tsx";
import Footer from "./components/Footer.tsx";
import "./App.css";

function App() {
  return (
    <div className="main-div">
      <NavBar />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
