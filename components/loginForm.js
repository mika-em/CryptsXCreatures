import { navigateTo } from "./app.js";

export default function LoginForm() {
  const form = document.createElement("form");
  form.classList.add("bg-white", "p-4", "rounded", "shadow");
  form.innerHTML = `
        <h2 class="text-center mb-4">Login</h2>
        <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="loginEmail" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input type="password" id="loginPassword" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Login</button>
        <p id="loginMessage" class="text-center mt-3"></p>
    `;

  form.onsubmit = async e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("https://cheryl-lau.com/cxc/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const message = document.getElementById("loginMessage");
      if (response.ok) {
        const data = await response.json();
        message.textContent = "Login successful!";
        localStorage.setItem("token", data.token); //switch to cookies later
        localStorage.setItem("userEmail", email);

        navigateTo("/users");
      } else {
        message.textContent = "Login failed";
      }
    } catch (error) {
      document.getElementById("loginMessage").textContent =
        "Error!" + error.message;
    }
  };

  return form;
}
