const USER_STRINGS = {
    email: "Email:",
    password: "Password:",
    confirmPassword: "Confirm Password:",
    login: "Login",
    register: "Register",
    logout: "Logout",
    welcomeMessage: "Welcome to Crypts x Creatures!",
    greeting: (email) => `Hello, ${email}!`,
    accessDenied: "Access Denied. Please log in to access this page.",
    errorOccurred: "There was an error. Please try again.",
    successMessage: "Success!",
    generateTextButton: "Generate Text",

    // HomePage
    storyPageLink: "Generate a Story",

    // ForgotPasswordForm
    forgotPassword: "Forgot Password",
    getRecoveryQuestion: "Get Recovery Question",
    recoveryQuestion: "Recovery Question:",
    recoveryAnswer: "Answer:",
    submitAnswer: "Submit Answer",
    newPassword: "New Password:",
    confirmNewPassword: "Confirm New Password:",
    resetPassword: "Reset Password",
    resetSuccess: `Password reset successful! <a href="/login" class="text-primary">Click here to log in</a>.`,
    noUserFound: "No user found with that email address.",
    incorrectAnswer: "Incorrect answer. Please try again.",
    passwordsDoNotMatch: "Passwords do not match!",

    // RegistrationForm
    recoveryQuestionLabel: "Recovery Question:",
    recoveryAnswerLabel: "Recovery Answer:",
    registrationSuccess: "Successfully registered!",
    registrationFailed: "Registration failed:",

    // LoginForm
    loginSuccess: "Login successful!",
    loginFailed: "Login failed. Please check your credentials.",

    // StoryPage
    enterPrompt: "Enter your prompt:",
    promptPlaceholder: "Type your prompt here...",
    generatedText: "Generated Text",
    generatingText: "Generating...",
};

export default USER_STRINGS;
