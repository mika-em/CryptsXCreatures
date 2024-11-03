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

  if (!isAuthenticated && path !== "/login") {
    navigateTo("/login");
  } else if (isAuthenticated && path === "/login") {
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
    const response = await fetch("/verifyjwt", { credentials: "include" });
    return response.ok;
  } catch (e) {
    console.log("Error checking login status");
    return false;
  }
}

export async function logout() {
  try {
    const response = await fetch("/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      localStorage.removeItem("userEmail");
      window.location.href = "/login";
    } else {
      console.log("Logout failed", await response.text());
    }
  } catch (e) {
    console.log("Error during logout:", e);
  }
}

window.onpopstate = router;
document.addEventListener("DOMContentLoaded", router);

export { navigateTo };
