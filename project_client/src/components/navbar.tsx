import { Navigate, redirect, useNavigate } from "react-router-dom";
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          Home
        </a>
        <a className="navbar-brand" href="/answer">
          Answer
        </a>
        <a className="navbar-brand" href="/ask">
          Ask
        </a>
        <div className="navbar-brand" onClick={logout}>
          Log Out
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          Home
        </a>
        <div className="navbar-brand" onClick={login}>
          Login
        </div>
        <div className="navbar-brand" onClick={signUp}>
          Sign Up
        </div>
      </nav>
    );
  }
}

export default NavBar;
