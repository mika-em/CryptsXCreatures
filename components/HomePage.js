import { navigateTo } from '../app.js';

export default function HomePage() {
    const container = document.createElement('div');
    container.classList.add('text-center');

    const header = document.createElement('h1');
    header.classList.add('display-4');
    header.textContent = "Welcome to Crypts X Creatures";

    const loginButton = document.createElement('button');
    loginButton.classList.add('btn', 'btn-primary', 'me-2');
    loginButton.textContent = 'Login';
    loginButton.onclick = () => navigateTo('/login');

    const registerButton = document.createElement('button');
    registerButton.classList.add('btn', 'btn-secondary');
    registerButton.textContent = 'Register';
    registerButton.onclick = () => navigateTo('/register');

    container.appendChild(header);
    container.appendChild(loginButton);
    container.appendChild(registerButton);

    return container;
}