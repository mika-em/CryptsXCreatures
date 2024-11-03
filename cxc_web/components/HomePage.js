import { navigateTo, isLoggedIn, logout } from "./app.js";

export default function HomePage() {
    const container = document.createElement("div");
    container.classList.add("text-center");

    const header = document.createElement("h1");
    header.classList.add("display-4");

    const userEmail = localStorage.getItem("userEmail");
    header.textContent = isLoggedIn() && userEmail
        ? `Hello, ${userEmail}!`
        : "Welcome to Crypts X Creatures!";

    const loginButton = document.createElement("button");
    loginButton.classList.add("btn", "btn-primary", "me-2");
    loginButton.textContent = "Login";
    loginButton.onclick = () => navigateTo("/login");

    const registerButton = document.createElement("button");
    registerButton.classList.add("btn", "btn-secondary");
    registerButton.textContent = "Register";
    registerButton.onclick = () => navigateTo("/register");

    const logoutButton = document.createElement("button");
    logoutButton.classList.add("btn", "btn-danger");
    logoutButton.textContent = "Logout";
    logoutButton.onclick = logout;


    container.appendChild(header);
    if (isLoggedIn()) {
        container.appendChild(logoutButton);
    } else {
        container.appendChild(loginButton);
        container.appendChild(registerButton);
    }

    return container;
}