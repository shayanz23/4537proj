export function checkEmailValidity(email: string) {
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(email)) {
    throw new Error("Invalid email");
  }
}

export function checkPasswordValidity(password: string) {
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters!");
    }
}