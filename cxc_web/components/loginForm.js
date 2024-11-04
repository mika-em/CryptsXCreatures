import UI_STRINGS from "../lang/en/user.js";
import { navigateTo } from "../app.js";

export default function LoginForm() {
  const form = document.createElement("form");
  form.classList.add("bg-white", "p-4", "rounded", "shadow");

  form.innerHTML = `
    <h2 class="text-center mb-4">${UI_STRINGS.login}</h2>
    <div class="mb-3">
      <label for="loginEmail" class="form-label">${UI_STRINGS.email}</label>
      <input type="email" id="loginEmail" class="form-control" required>
    </div>
    <div class="mb-3">
      <label for="loginPassword" class="form-label">${UI_STRINGS.password}</label>
      <input type="password" id="loginPassword" class="form-control" required>
    </div>
    <button type="submit" class="btn btn-primary w-100">${UI_STRINGS.login}</button>
    <p id="loginMessage" class="text-center mt-3 text-danger"></p>
    <p class="text-center mt-3"><a href="#" id="forgotPasswordLink">${UI_STRINGS.forgotPassword}</a></p>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    try {
      const response = await fetch("https://cheryl-lau.com/cxc/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        message.textContent = UI_STRINGS.loginSuccess;
        message.classList.remove("text-danger");
        message.classList.add("text-primary");
        localStorage.setItem("userEmail", email);
        navigateTo("/");
      } else {
        console.log("Login response:", await response.text());
        message.textContent = UI_STRINGS.loginFailed;
        message.classList.remove("text-primary");
        message.classList.add("text-danger");
      }
    } catch (e) {
      console.log("Error during login:", e);
      message.textContent = UI_STRINGS.errorOccurred;
      message.classList.remove("text-primary");
      message.classList.add("text-danger");
    }
  };

  form.querySelector("#forgotPasswordLink").onclick = (e) => {
    e.preventDefault();
    navigateTo("/forgotpassword");
  };

  return form;
}
