function NavBar() {
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
      <a className="navbar-brand" href="/logout">
        Log Out
      </a>
    </nav>
  );
}

export default NavBar;
