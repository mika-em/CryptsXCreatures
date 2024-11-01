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
        <button type="submit" class="btn btn-secondary w-100">Register</button>
        <p id="registerMessage" class="text-center mt-3"></p>
    `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    console.log("Registration form submitted");
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await fetch("https://cheryl-lau.com/cxc/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const message = document.getElementById("registerMessage");

      // Log response details
      console.log("Server response:", response);
      console.log("Status code:", response.status);

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          message.textContent = "Registration successful! Please log in.";
          console.log("Registration successful, token received:", data.token);
          localStorage.setItem("token", data.token);
        } else {
          const textData = await response.text();
          message.textContent = textData || "Registration successful! Please log in.";
          console.log("Registration response (text):", textData);
        }
      } else {
        console.warn("Registration failed with status:", response.status);
        message.textContent = "Registration failed. Try a different email or password.";
      }
    } catch (error) {
      console.error("Error during registration:", error);
      document.getElementById("registerMessage").textContent = "Error: " + error.message;
    }
  };

  return form;
}