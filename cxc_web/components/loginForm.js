import { navigateTo, setCookie } from "../app.js";

export default function LoginForm() {
  const form = document.createElement("form");
  form.classList.add("bg-white", "p-4", "rounded", "shadow");

  form.innerHTML = `
        <h2 class="text-center mb-4">Login</h2>
        <div class="mb-3">
            <label for="loginEmail" class="form-label">Email:</label>
            <input type="email" id="loginEmail" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="loginPassword" class="form-label">Password:</label>
            <input type="password" id="loginPassword" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Login</button>
        <p id="loginMessage" class="text-center mt-3"></p>
    `;

  const forgotPasswordLink = document.createElement("p");
  forgotPasswordLink.classList.add("text-center", "mt-3");
  forgotPasswordLink.innerHTML = `<a href="#" id="forgotPasswordLink">Forgot your password?</a>`;
  forgotPasswordLink.querySelector("#forgotPasswordLink").onclick = (e) => {
    e.preventDefault();
    navigateTo("/forgotpassword");
  };

  form.appendChild(forgotPasswordLink);

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
      });

      if (response.ok) {
        const data = await response.text();
        message.textContent = "Login successful!";
        setCookie("token", data.token, 7);
        localStorage.setItem("userEmail", email);

        navigateTo("/users");
      } else {
        message.textContent = "Login failed";
      }
    } catch (error) {
      console.log = "Error: " + error.message;
    }
  };

  return form;
}
