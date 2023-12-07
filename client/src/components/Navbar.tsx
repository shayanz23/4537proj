import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import currentUser from "../currentUser";
import { useEffect, useState } from "react";
const cookies = new Cookies();

function NavBar() {
  const navigate = useNavigate();
  const [navbar, setNavbar] = useState(<></>);

  const login = () => {
    navigate("/login", { replace: true });
  };
  const signUp = () => {
    navigate("/signup", { replace: true });
  };

  const logout = () => {
    cookies.remove("accessToken");
    cookies.remove("adminAccessToken");
    currentUser.status = "Unauthorized";
    navigate("/login", { replace: true });
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    function checkAuth() {

      if (currentUser.status === "Authorized") {
        setNavbar(
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
                {currentUser.username}
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
        setNavbar(
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

    checkAuth();

    const intervalId = setInterval(checkAuth, 250);

    return () => clearInterval(intervalId);
  }, []);

  return <>{navbar}</>;
}

export default NavBar;
