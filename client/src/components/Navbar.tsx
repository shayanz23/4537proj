import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

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
        <a className="navbar-brand" href="/ask">
          Ask
        </a>

        <div className="nav-item dropdown end-item">
          <p
            className=" dropdown-toggle"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {cookies.get("user").username}
          </p>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" onClick={logout}>
                Logout
              </a>
            </li>
          </ul>
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
