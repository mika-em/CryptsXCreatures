export default function ForgotPasswordForm() {
  const form = document.createElement("form");
  form.classList.add("bg-white", "p-4", "rounded", "shadow");

  form.innerHTML = `
          <h2 class="text-center mb-4">Forgot Password</h2>
        <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="forgotEmail" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Get Recovery Question</button>
        <p id="forgotMessage" class="text-center mt-3"></p>
        <div id="recoveryQuestionContainer" class="mt-3" style="display: none;">
            <p id="recoveryQuestion" class="text-muted"></p>
            <label for="recoveryAnswer" class="form-label">Recovery Answer:</label>
            <input type="text" id="recoveryAnswer" class="form-control" required>
            <button id="verifyAnswerButton" class="btn btn-secondary w-100 mt-2">Submit Answer</button>
        </div>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const message = document.getElementById("forgotMessage").value;
    const recoveryQuestion = document.getElementById("recoveryQuestion").value;
    const recoveryQuestionContainer = document.getElementById(
      "recoveryQuestionContainer",
    );

    try {
      const response = await fetch(
        `https://cheryl-lau.com/cxc/api/forgotpassword?email=${email}`,
      );

      if (response.ok) {
        const data = await response.json();
        message.textContent = "";
        recoveryQuestion.textContent = data.question;
        recoveryQuestionContainer.style.display = "block";
      } else {
        message.textContent = "Email not found.";
      }
    } catch (e) {
      message.textContent = "Error: " + e.message;
    }
  };

  return form;
}
