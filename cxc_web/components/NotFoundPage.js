export default function NotFoundPage() {
  const container = document.createElement("div");
  container.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-center", "vh-100", "text-center", "bg-light");

  const heading = document.createElement("h1");
  heading.textContent = "404 - Page Not Found";
  heading.classList.add("display-4", "mb-3", "text-danger");

  const message = document.createElement("p");
  message.textContent = "Oops! The page you are looking for does not exist.";
  message.classList.add("lead", "mb-4");

  const homeLink = document.createElement("a");
  homeLink.href = "/";
  homeLink.textContent = "Go to Home Page";
  homeLink.classList.add("btn", "btn-primary", "mt-3");

  container.appendChild(heading);
  container.appendChild(message);
  container.appendChild(homeLink);


  return container;
}