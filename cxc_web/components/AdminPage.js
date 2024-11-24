import { checkLoginStatus } from "../app.js";

export default async function AdminDashboard() {
  const appDiv = document.getElementById("app");
  appDiv.innerHTML = "";

  const container = document.createElement("div");
  container.classList.add("container", "mt-5");

  const header = document.createElement("h2");
  header.classList.add("text-center", "mb-4");
  header.textContent = "Admin Dashboard";

  const tableCard = document.createElement("div");
  tableCard.classList.add("card", "p-4", "shadow-sm");

  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  const tableHeader = `
    <thead>
      <tr>
        <th>Email</th>
        <th>Role</th>
        <th>Prompt Count</th>
      </tr>
    </thead>
  `;
  const tableBody = document.createElement("tbody");

  table.innerHTML = tableHeader;
  table.appendChild(tableBody);
  tableCard.appendChild(table);
  container.appendChild(header);
  container.appendChild(tableCard);
  appDiv.appendChild(container);

  const isAuthenticated = await checkLoginStatus();
  if (!isAuthenticated) {
    appDiv.innerHTML = `
      <div class="alert alert-danger text-center">
        You do not have permission to view this page. Please log in as an admin.
      </div>
    `;
    return;
  }

  try {
    const response = await fetch(
      "https://cheryl-lau.com/cxc/api/admin/users",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (response.ok) {
      const users = await response.json();
      populateTable(users, tableBody);
    } else if (response.status === 403) {
      appDiv.innerHTML = `
        <div class="alert alert-danger text-center">
          You do not have permission to view this page. Admins only.
        </div>
      `;
    } else {
      throw new Error("Failed to fetch users");
    }
  } catch (error) {
    console.error("Error fetching admin users:", error);
    appDiv.innerHTML = `
      <div class="alert alert-danger text-center">
        There was an error loading the user data. Please try again later.
      </div>
    `;
  }
}

function populateTable(users, tableBody) {
  tableBody.innerHTML = ""; // Clear existing rows
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.prompt_count || 0}</td>
    `;
    tableBody.appendChild(row);
  });
}