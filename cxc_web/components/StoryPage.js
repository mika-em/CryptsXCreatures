    import { checkLoginStatus } from "../app.js";

    export default async function StoryPage() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "";

    const container = document.createElement("div");
    container.classList.add("container", "mt-5");

    const header = document.createElement("h2");
    header.classList.add("text-center", "mb-4");
    header.textContent = "Story Generator";

    const formCard = document.createElement("div");
    formCard.classList.add("card", "p-4", "shadow-sm");

    const form = document.createElement("form");
    form.id = "promptForm";

    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.setAttribute("for", "prompt");
    label.textContent = "Describe your character:";

    const textarea = document.createElement("textarea");
    textarea.id = "prompt";
    textarea.classList.add("form-control");
    textarea.rows = 4;
    textarea.placeholder = "Type your prompt here...";
    textarea.required = true;

    const button = document.createElement("button");
    button.type = "submit";
    button.classList.add("btn", "btn-primary", "w-100", "mt-3");
    button.textContent = "Generate Text";

    formGroup.appendChild(label);
    formGroup.appendChild(textarea);
    form.appendChild(formGroup);
    form.appendChild(button);
    formCard.appendChild(form);

    const resultContainer = document.createElement("div");
    resultContainer.id = "resultContainer";
    resultContainer.classList.add("card", "mt-4", "p-4", "shadow-sm", "d-none");

    const resultHeader = document.createElement("h4");
    resultHeader.classList.add("text-center");

    const generatedText = document.createElement("p");
    generatedText.id = "generatedText";
    generatedText.classList.add("text-muted");

    resultContainer.appendChild(resultHeader);
    resultContainer.appendChild(generatedText);

    container.appendChild(header);
    container.appendChild(formCard);
    container.appendChild(resultContainer);
    appDiv.appendChild(container);

    const isAuthenticated = await checkLoginStatus();
    if (!isAuthenticated) {
        generatedText.textContent =
        "Please log in.";
        resultContainer.classList.remove("d-none");
        return;
    }

    form.onsubmit = async (e) => {
        e.preventDefault();
        const prompt = textarea.value;
        generatedText.textContent = "Generating...";

        try {
        const response = await fetch("https://cheryl-lau.com/cxc/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            generatedText.textContent = data.generated_text;
            resultContainer.classList.remove("d-none");
        } else {
            generatedText.textContent = "There was an error. Please try again.";
            resultContainer.classList.remove("d-none");
        }
        } catch (error) {
        console.error("Error:", error);
        generatedText.textContent = "There was an error. Please try again.";
        resultContainer.classList.remove("d-none");
        }
    };
    }
