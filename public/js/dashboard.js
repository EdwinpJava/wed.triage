import { apiFetch } from './api.js';

const totalPatients = document.querySelector('#totalPatients');
const pendingPatients = document.querySelector('#pendingPatients');
const urgentPatients = document.querySelector('#urgentPatients');
const alertCount = document.querySelector('#alertCount');
const logoutBtn = document.querySelector('#logoutBtn');

async function loadDashboard() {
  try {
    const data = await apiFetch('/api/dashboard');

    if (totalPatients) totalPatients.textContent = data.stats?.totalPatients ?? 0;
    if (pendingPatients) pendingPatients.textContent = data.stats?.pending ?? 0;
    if (urgentPatients) urgentPatients.textContent = data.stats?.urgent ?? 0;
    if (alertCount) alertCount.textContent = data.stats?.alerts ?? 0;
  } catch (error) {
    console.error(error);
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await apiFetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
    }
  });
}

loadDashboard();
