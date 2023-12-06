export function pwValidate(password: string) {
  if (password.replace(/ /g,'').length < 6) {
    throw new Error("Password must be at least 6 characters!");
  }
}
