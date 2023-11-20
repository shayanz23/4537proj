function Login() {
  return (
    <div className="container">
      <div className="login">
        <h1>Log In</h1>
        <form action="login" method="post">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required={true}
          />
          <p>{"\n"}</p>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required={true}
          />
          <p>{"\n"}</p>
          <button type="submit" className="btn btn-primary btn-block btn-large">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
