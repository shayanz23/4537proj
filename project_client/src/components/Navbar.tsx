import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./Navbar.css";

function NavBar() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const logout = () => {
    cookies.remove("user");
    navigate("/", { replace: true });
  };
  const login = () => {
    navigate("/login", { replace: true });
  };
  const signUp = () => {
    navigate("/signup", { replace: true });
  };
  if (cookies.get("user") !== null && cookies.get("user") !== undefined) {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/" style={{ marginLeft: "10px" }}>
          Home
        </a>
        <a className="navbar-brand" href="/dashboard">
          Dashboard
        </a>
        <a className="navbar-brand" href="/answer">
          Answer
        </a>
        <a className="navbar-brand" href="/ask">
          Ask
        </a>
        <div className="navbar-brand end-item" onClick={logout}>
          Log Out
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar ">
        <a className="navbar-brand" href="/" style={{ marginLeft: "10px" }}>
          Home
        </a>
        <div className="end-item">
          <div className="navbar-brand" onClick={login}>
            Login
          </div>
          <div className="navbar-brand" onClick={signUp}>
            Sign Up
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
