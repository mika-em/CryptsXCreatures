export default function RegistrationForm() {
  const form = document.createElement("form");
  form.classList.add("bg-white", "p-4", "rounded", "shadow");

  form.innerHTML = `
        <h2 class="text-center mb-4">Register</h2>
        <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="registerEmail" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input type="password" id="registerPassword" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password:</label>
            <input type="password" id="confirmPassword" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="recoveryQuestion" class="form-label">Recovery Question:</label>
            <input type="text" id="recoveryQuestion" class="form-control" required>
            <small class="form-text text-muted">Choose a question you can easily answer if you forget your password.</small>
        </div>
        <div class="mb-3">
            <label for="recoveryAnswer" class="form-label">Recovery Answer:</label>
            <input type="text" id="recoveryAnswer" class="form-control" required>
            <small class="form-text text-muted">Provide an answer only you would know.</small>
        </div>

        <button type="submit" class="btn btn-secondary w-100">Register</button>
        <p id="registerMessage" class="text-center mt-3"></p>
    `;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const recoveryQuestion = document.getElementById("recoveryQuestion").value;
    const recoveryAnswer = document.getElementById("recoveryAnswer").value;
    const message = document.getElementById("registerMessage").value;

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
          recovery_question: recoveryQuestion,
          recovery_answer: recoveryAnswer,
        }),
      });

      if (response.ok) {
        message.textContent = "Successfully registerd!";
        const data = await response.json();
        localStorage.setItem("token", data.token);
      } else {
        message.textContent = "Registration failed.";
      }
    } catch (e) {
      message.textContent = "Error: " + e.message;
    }
  };

  return form;
}
