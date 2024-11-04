import UI_STRINGS from "../lang/en/user.js";
import { navigateTo, checkLoginStatus, logout } from "../app.js";

export default function HomePage() {
  const container = document.createElement("div");
  container.classList.add("text-center");

  const logoImage = document.createElement("img");
  logoImage.src = "./logo.png";
  logoImage.alt = "Crypts x Creatures";
  logoImage.classList.add("logo-image");
  container.appendChild(logoImage);
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  const loginButton = createButton("btn-primary", UI_STRINGS.login, () =>
    navigateTo("/login"),
  );
  const registerButton = createButton(
    "btn-secondary",
    UI_STRINGS.register,
    () => navigateTo("/register"),
  );
  const storyPageLink = createButton(
    "btn-success",
    UI_STRINGS.storyPageLink,
    () => navigateTo("/storypage"),
  );
  const logoutButton = createButton("btn-danger", UI_STRINGS.logout, () => {
    logout();
    renderButtons(false);
  });

  function createButton(btnClass, text, onClick) {
    const button = document.createElement("button");
    button.classList.add("btn", btnClass);
    button.textContent = text;
    button.onclick = onClick;
    return button;
  }
  async function renderButtons(isLoggedIn) {
    buttonsContainer.innerHTML = "";
    buttonsContainer.appendChild(storyPageLink);

    if (isLoggedIn) {
      buttonsContainer.appendChild(logoutButton);
    } else {
      buttonsContainer.appendChild(loginButton);
      buttonsContainer.appendChild(registerButton);
    }
    
    if (!container.contains(buttonsContainer)) {
      container.appendChild(buttonsContainer);
    }
  }
  checkLoginStatus().then(renderButtons);
  
  return container;
}