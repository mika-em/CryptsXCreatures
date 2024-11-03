import HomePage from "./components/homePage.js";
import LoginForm from "./components/loginForm.js";
import RegistrationForm from "./components/registrationForm.js";
import ForgotPasswordForm from "./components/forgotPasswordForm.js";

function renderComponent(component) {
  const appDiv = document.getElementById("app");
  appDiv.innerHTML = "";
  appDiv.appendChild(component());
}

function navigateTo(route) {
  window.history.pushState({}, route, window.location.origin + route);
  router();
}

function router() {
  const path = window.location.pathname;

  if (path === "/login" && isLoggedIn()) {
    window.location.href = "/";
  } else if (path === "/register" && isLoggedIn()) {
    window.location.href = "/";
  } else if (path === "/forgotpassword") {
    renderComponent(ForgotPasswordForm);
  } else if (path === "/register") {
    renderComponent(RegistrationForm);
  } else if (path === "/login") {
    renderComponent(LoginForm);
  } else {
    renderComponent(HomePage);
  }
}

export function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, val] = cookie.split("=");
    if (key === name) return val;
  }
  return null;
}

export function isLoggedIn() {
  return getCookie("token") !== null;
}

export function logout() {
  document.cookie = "token=; Max-Age=0; path=/"; // Deletes the cookie
  localStorage.removeItem("userEmail");
  window.location.href = "/";
}

window.onpopstate = router;
document.addEventListener("DOMContentLoaded", router);

export { navigateTo, getCookie };