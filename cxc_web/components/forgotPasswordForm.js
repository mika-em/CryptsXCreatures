import { navigateTo, setCookie, getCookie } from "../app.js";

export default function ForgotPasswordForm() {
  const form = document.createElement("form");
  form.classList.add("bg-white", "p-4", "rounded", "shadow");

  form.innerHTML = `
          <h2 class="text-center mb-4">Forgot Password</h2>
        <div id="emailSection" class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="forgotEmail" class="form-control" required>
        </div>
        <p id="emailMessage" class="text-danger text-center mt-2"></p>
        <button type="submit" id="getRecoveryQuestionButton" class="btn btn-primary w-100">Get Recovery Question</button>
        
        <div id="recoveryQuestionContainer" class="mt-3" style="display: none;">
              <label for="recoveryQuestion" class="form-label">Recovery Question:</label>
            <p id="recoveryQuestion" class="text-muted"></p>
            <label for="recoveryAnswer" class="form-label">Answer:</label>
            <input type="text" id="recoveryAnswer" name="recoveryAnswer" class="form-control">
            <p id="answerMessage" class="text-danger mt-2"></p> 
            <button id="verifyAnswer" class="btn btn-secondary w-100 mt-2">Submit Answer</button>
        </div>

        <div id="passwordResetContainer" class="mt-3" style="display: none;">
            <p id="confirmedEmail" class="mb-3"></p>
            <label for="newPassword" class="form-label">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" class="form-control">
            <label for="confirmNewPassword" class="form-label mt-2">Confirm New Password:</label>
            <input type="password" id="confirmNewPassword" name="confirmNewPassword"class="form-control">
            <p id="resetMessage" class="text-danger mt-2"></p> 
            <button id="resetPassword" class="btn btn-success w-100 mt-2">Reset Password</button>
        </div>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("forgotEmail");
    const emailMessage = document.getElementById("emailMessage");
    const recoveryQuestion = document.getElementById("recoveryQuestion");
    const recoveryQuestionContainer = document.getElementById(
      "recoveryQuestionContainer",
    );
    const emailSection = document.getElementById("emailSection");

    if (!emailInput) {
      message.textContent = "Please try again.";
      return;
    }

    const email = emailInput.value;

    try {
      const response = await fetch(
        `https://cheryl-lau.com/cxc/api/forgotpassword?email=${email}`,
      );

      if (response.ok) {
        const data = await response.json();

        if (!data || !data.question) {
          emailMessage.textContent = "No user found with that email address.";
          return;
        }

        emailMessage.textContent = "";
        recoveryQuestion.textContent = data.question;
        emailSection.style.display = "none";
        getRecoveryQuestionButton.style.display = "none";
        recoveryQuestionContainer.style.display = "block";
        document
          .getElementById("recoveryAnswer")
          .setAttribute("required", "true");
      } else if (response.status === 500) {
        console.error("There was an issue. Please try again later.");
        emailMessage.textContent = "There was an issue. Please try again later.";
      } else if (response.status === 404) {
        emailMessage.textContent = "No user found with that email address.";
      } else {
        emailMessage.textContent = "An error occurred. Please try again.";
      }
    } catch (e) {
      emailMessage.textContent = "Error. Please try again later."
      console.error(e.message);
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
    const showEmail = document.getElementById("confirmedEmail");

    try {
      const response = await fetch(
        "https://cheryl-lau.com/cxc/api/verifyanswer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, answer }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        answerMessage.textContent = "";
        setCookie("newToken", data.token, 0.08);
        passwordResetContainer.style.display = "block";
        showEmail.innerText = `Resetting password for: ${email}`;
        document.getElementById("newPassword").setAttribute("required", "true");
        document
          .getElementById("confirmNewPassword")
          .setAttribute("required", "true");
      } else {
        answerMessage.textContent = "Wrong answer! Plese try again.";
      }
    } catch (e) {
      answerMessage.textContent = "Error. Please try again later."
      console.log(e.message);
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
      return;
    }

    try {
      const newToken = getCookie("newToken");
      const response = await fetch(
        "https://cheryl-lau.com/cxc/api/resetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify({ email, newPassword }),
        },
      );

      if (response.ok) {
        resetMessage.textContent = "Password reset successful! Please log in.";
        navigateTo("/login");
      } else {
        resetMessage.textContent =
          "Password reset failed! Please ensure your passwords match.";
      }
    } catch (e) {
      resetMessage.textContent = "Error. Please try again later."
            console.log(e.message);
    }
  };
  return form;
}
