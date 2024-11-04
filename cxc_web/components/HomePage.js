import { navigateTo, checkLoginStatus, logout } from "../app.js";

export default function HomePage() {
  const container = document.createElement("div");
  container.classList.add("text-center");

  const header = document.createElement("h1");
  header.classList.add("display-4");

  const loginButton = document.createElement("button");
  loginButton.classList.add("btn", "btn-primary", "me-2", "mt-3");
  loginButton.textContent = "Login";
  loginButton.onclick = () => navigateTo("/login");

  const registerButton = document.createElement("button");
  registerButton.classList.add("btn", "btn-secondary", "mt-3");
  registerButton.textContent = "Register";
  registerButton.onclick = () => navigateTo("/register");

  const logoutButton = document.createElement("button");
  logoutButton.classList.add("btn", "btn-danger");
  logoutButton.textContent = "Logout";
  logoutButton.onclick = () => {
    logout();
    renderButtons(false);
  };

    const storyPageLink = document.createElement("a");
  storyPageLink.href = "#";
  storyPageLink.classList.add("btn", "btn-success", "mt-3", "mb-4");
  storyPageLink.textContent = STRINGS.storyPageLink;
  storyPageLink.onclick = (e) => {
    e.preventDefault();
    navigateTo("/storypage");
  };

  async function renderButtons(isLoggedIn) {
    const email = localStorage.getItem("userEmail");
    header.textContent =
      isLoggedIn && email
        ? `Hello, ${email}!`
        : "Welcome to Crypts x Creatures!";

    container.innerHTML = "";
    container.appendChild(header);

    if (isLoggedIn) {
      container.appendChild(storyPageLink);
      container.appendChild(logoutButton);
    } else {
      container.appendChild(loginButton);
      container.appendChild(registerButton);
    }
  }
  checkLoginStatus().then(renderButtons);
  return container;
}
