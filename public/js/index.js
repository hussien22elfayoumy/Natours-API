/* eslint-disable */
import { displayMap } from './leaflet';
import { login, logout } from './login';

const init = () => {
  // Iinit map
  const map = document.getElementById('map');
  const form = document.querySelector('.form');
  const logoutBtn = document.querySelector('.nav__el--logout');

  if (map) {
    const locations = JSON.parse(map.dataset.locations);
    displayMap(locations);
  }

  // Login functionality
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      login(email, password);
    });
  }

  // Lgout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
