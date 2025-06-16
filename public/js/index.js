/* eslint-disable */
import { displayMap } from './leaflet';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

const init = () => {
  // Iinit map
  const map = document.getElementById('map');
  const userLoginForm = document.querySelector('.user-login-form');
  const logoutBtn = document.querySelector('.nav__el--logout');
  const userDataForm = document.querySelector('.form-user-data');

  if (map) {
    const locations = JSON.parse(map.dataset.locations);
    displayMap(locations);
  }

  // Login
  if (userLoginForm) {
    userLoginForm.addEventListener('submit', (e) => {
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

  // updata user settings
  if (userDataForm)
    userDataForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;

      updateSettings({ name, email }, 'data');
    });
};

document.addEventListener('DOMContentLoaded', init);
