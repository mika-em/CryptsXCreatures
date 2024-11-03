// TODO: use cookies instead of tokens

import HomePage from "./HomePage.js";
import LoginForm from "./LoginForm.js";
import RegistrationForm from "./RegistrationForm.js"

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
    } else {
      renderComponent(HomePage);
    }
  }

function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  window.location.href = "/";
}

window.onpopstate = router;

document.addEventListener("DOMContentLoaded", router);
export { navigateTo, isLoggedIn, logout };
