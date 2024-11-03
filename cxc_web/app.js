// TODO: use cookies instead of tokens

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
  } else if (path === "/register") {
    renderComponent(RegistrationForm);
  } else if (path === "/login") {
    renderComponent(LoginForm);
  } else if (path === "/forgotpassword") {
    renderComponent(ForgotPasswordForm);
  } else {
    renderComponent(HomePage);
  }
}

export function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function isLoggedIn() {
  return getCookie("token") !== null;
}

function logout() {
  document.cookie = "token=; Max-Age=0; path=/";
  localStorage.removeItem("userEmail");
  window.location.href = "/";
}

window.onpopstate = router;

document.addEventListener("DOMContentLoaded", router);
export { navigateTo, isLoggedIn, logout };
