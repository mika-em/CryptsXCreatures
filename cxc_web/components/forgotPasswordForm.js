import { navigateTo } from "../app.js";

export default function ForgotPasswordForm() {
  const form = document.createElement("form");
  form.classList.add("bg-white", "p-4", "rounded", "shadow");

  form.innerHTML = `
    <h2 class="text-center mb-4">Forgot Password</h2>
    <div id="emailSection" class="mb-3">
      <label for="forgotEmail" class="form-label">Email:</label>
      <input type="email" id="forgotEmail" name="forgotEmail" class="form-control" required>
    </div>
    <p id="emailMessage" class="text-danger text-center mt-2"></p>
    <button type="submit" id="getRecoveryQuestionButton" class="btn btn-primary w-100">Get Recovery Question</button>

    <div id="recoveryQuestionContainer" class="mt-3" style="display: none;">
      <label class="form-label">Recovery Question:</label>
      <p id="recoveryQuestion" class="text-muted"></p>
      <label for="recoveryAnswer" class="form-label">Answer:</label>
      <input type="text" id="recoveryAnswer" name="recoveryAnswer" class="form-control">
      <p id="answerMessage" class="text-danger mt-2"></p> 
      <button id="verifyAnswer" class="btn btn-secondary w-100 mt-2">Submit Answer</button>
    </div>

    <div id="passwordResetContainer" class="mt-3" style="display: none;">
      <label for="newPassword" class="form-label">New Password:</label>
      <input type="password" id="newPassword" name="newPassword" class="form-control">
      <label for="confirmNewPassword" class="form-label mt-2">Confirm New Password:</label>
      <input type="password" id="confirmNewPassword" name="confirmNewPassword" class="form-control">
      <p id="resetMessage" class="text-danger mt-2"></p> 
      <button id="resetPassword" class="btn btn-success w-100 mt-2">Reset Password</button>
    </div>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;
    const emailMessage = document.getElementById("emailMessage");
    const recoveryQuestionContainer = document.getElementById(
      "recoveryQuestionContainer",
    );
    const recoveryQuestion = document.getElementById("recoveryQuestion");

    try {
      const response = await fetch(
        `https://cheryl-lau.com/cxc/api/forgotpassword?email=${email}`,
      );

      if (response.ok) {
        const data = await response.json();
        emailMessage.textContent = "";
        recoveryQuestion.textContent = data.question;
        recoveryQuestionContainer.style.display = "block";
        document.getElementById("getRecoveryQuestionButton").style.display =
          "none";
        document.getElementById("emailSection").style.display = "none";
        document
          .getElementById("recoveryAnswer")
          .setAttribute("required", "true");
      } else {
        emailMessage.textContent = "No user found with that email address.";
      }
    } catch (e) {
      emailMessage.textContent = "Error. Please try again later";
      console.log(e);
    }
  };

  form.querySelector("#verifyAnswer").onclick = async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;
    const answer = document.getElementById("recoveryAnswer").value;
    const answerMessage = document.getElementById("answerMessage");
    const passwordResetContainer = document.getElementById(
      "passwordResetContainer",
    );
    const recoveryQuestionContainer = document.getElementById(
      "recoveryQuestionContainer",
    );

    try {
      const response = await fetch(
        "https://cheryl-lau.com/cxc/api/verifyanswer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, answer }),
          credentials: "include",
        },
      );

      if (response.ok) {
        answerMessage.textContent = "";
        recoveryQuestionContainer.style.display = "none";
        passwordResetContainer.style.display = "block";
        document.getElementById("newPassword").setAttribute("required", "true");
        document
          .getElementById("confirmNewPassword")
          .setAttribute("required", "true");
      } else {
        answerMessage.textContent = "Incorrect answer. Please try again.";
      }
    } catch (e) {
      answerMessage.textContent = "Error. Please try again later";
      console.log(e);
    }
  };

  form.querySelector("#resetPassword").onclick = async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;
    const resetMessage = document.getElementById("resetMessage");

    if (newPassword !== confirmNewPassword) {
      resetMessage.textContent = "Passwords do not match!";
      resetMessage.classList.remove("text-success");
      resetMessage.classList.add("text-danger");
      return;
    }

    try {
      const response = await fetch(
        "https://cheryl-lau.com/cxc/api/resetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword }),
          credentials: "include",
        },
      );

      if (response.ok) {
        resetMessage.innerHTML = `Password reset successful! <a href="/login" class="text-primary">Click here to log in</a>.`;
        resetMessage.classList.remove("text-danger");
        resetMessage.classList.add("text-success");
        document.getElementById("newPassword").setAttribute("disabled", "true");
        document
          .getElementById("confirmNewPassword")
          .setAttribute("disabled", "true");
        form.querySelector("#resetPassword").style.display = "none";
      } else {
        resetMessage.textContent = "Password reset failed. Try again.";
      }
    } catch (e) {
      resetMessage.textContent = "Error. Please try again later";
      console.log(e);
    }
  };

  return form;
}
