export default function RegistrationForm() {
  const form = document.createElement("form");
  form.classList.add("bg-white", "p-4", "rounded", "shadow");
  form.innerHTML = `
        <h2 class="text-center mb-4">Register</h2>
        <div class="mb-3">
            <label for="registerEmail" class="form-label">Email:</label>
            <input type="email" id="registerEmail" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="registerPassword" class="form-label">Password:</label>
            <input type="password" id="registerPassword" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password:</label>
            <input type="password" id="confirmPassword" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="recoveryQuestion" class="form-label">Recovery Question:</label>
            <input type="text" id="recoveryQuestion" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="recoveryAnswer" class="form-label">Recovery Answer:</label>
            <input type="text" id="recoveryAnswer" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-secondary w-100">Register</button>
        <p id="registerMessage" class="text-center mt-3"></p>
    `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const recovery_question = document.getElementById("recoveryQuestion").value;
    const recovery_answer = document.getElementById("recoveryAnswer").value;
    const message = document.getElementById("registerMessage");

    if (password !== confirmPassword) {
      message.textContent = "The passwords don't match!";
      return;
    }

    try {
      const response = await fetch("https://cheryl-lau.com/cxc/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          recovery_question,
          recovery_answer,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          message.textContent = "Successfully registered!";
          localStorage.setItem("token", data.token);
        } else {
          const text = await response.text();
          message.textContent = text || "Successfully registered!";
          message.classList.remove("text-danger");
          message.classList.add("text-success");
        }
      } else {
        const errorText = await response.text();
        message.textContent = "Registration failed: " + errorText;
        message.classList.add("text-danger");
      }
    } catch (e) {
      message.textContent = "Error: " + e.message;
      message.classList.add("text-danger");
      console.error("Registration Error:", e);
    }
  };

  return form;
}
