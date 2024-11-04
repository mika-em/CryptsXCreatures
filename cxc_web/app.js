import HomePage from "./components/HomePage.js";
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

async function router() {
  const path = window.location.pathname;
  const isAuthenticated = await checkLoginStatus();

  if (isAuthenticated && (path === "/login" || path === "/register")) {
    navigateTo("/");
  } else {
    switch (path) {
      case "/login":
        renderComponent(LoginForm);
        break;
      case "/register":
        renderComponent(RegistrationForm);
        break;
      case "/forgotpassword":
        renderComponent(ForgotPasswordForm);
        break;
      default:
        renderComponent(HomePage);
        break;
    }
  }
}

export async function checkLoginStatus() {
  try {
    const response = await fetch("https://cheryl-lau.com/cxc/api/verifyjwt", {
      credentials: "include",
    });

    if (response.status === 401) {
      console.log("Status:", response.status);
      return false;
    } else if (!response.ok) {
      console.log("Unexpected response status:", response.status);
      return false;
    }
    return true;

  } catch (e) {
    console.error("Unexpected error checking login status:", e);
    return false;
  }
}

export async function logout() {
  try {
    const response = await fetch("https://cheryl-lau.com/cxc/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      localStorage.removeItem("userEmail");
      window.location.href = "/";
    } else {
      const errorText = await response.text();
      console.log("Logout failed:", errorText);
    }
  } catch (e) {
    console.log("Error during logout:", e);
  }
}

window.onpopstate = router;
document.addEventListener("DOMContentLoaded", router);

export { navigateTo };