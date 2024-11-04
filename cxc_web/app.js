
import HomePage from "./components/HomePage.js";
import LoginForm from "./components/loginForm.js";
import RegistrationForm from "./components/registrationForm.js";
import ForgotPasswordForm from "./components/forgotPasswordForm.js";
import StoryPage from "./components/StoryPage.js";
import NotFoundPage from "./components/NotFoundPage.js";

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

  switch (path) {
    case "/":
      renderComponent(HomePage);
      break;
    
    case "/login":
      renderComponent(LoginForm);
      break;

    case "/register":
      renderComponent(RegistrationForm);
      break;

    case "/forgotpassword":
      renderComponent(ForgotPasswordForm);
      break;

    case "/storypage":
      if (isAuthenticated) {
        renderComponent(StoryPage);
      } else {
        navigateTo("/");
      }
      break;
      
    default:
      renderComponent(NotFoundPage);
      break;
  }
}

export async function checkLoginStatus() {
  try {
    const response = await fetch("https://cheryl-lau.com/cxc/api/verifyjwt", {
      credentials: "include",
    });

    if (response.status === 200) {
      console.log("Status:", response.status);
      return true;
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
