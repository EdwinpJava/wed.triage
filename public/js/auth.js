import { apiFetch } from './api.js';

const form = document.querySelector('#loginForm');
const message = document.querySelector('#loginMessage');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();

    message.textContent = 'Validando credenciales...';
    message.className = 'status-message';

    try {
      const result = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      message.textContent = result.message || 'Sesión iniciada';
      message.classList.add('success');
      window.location.href = '/dashboard';
    } catch (error) {
      message.textContent = error.message;
      message.classList.add('error');
    }
  });
}
