import NavBar from "./components/Navbar.tsx";
import Body from "./components/Body.tsx";
import Footer from "./components/Footer.tsx";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import "./App.css";
import "./pages/container.css";
import currentUser from './userSingleTon.tsx'



function App() {
  if (cookies.get("accessToken") !== undefined) {
    currentUser
  }
  return (
    <div className="main-div">
      <NavBar />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
